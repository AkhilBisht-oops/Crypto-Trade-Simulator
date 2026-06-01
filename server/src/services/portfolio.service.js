const prisma = require('../config/database');
const { binanceService } = require('./binance.service');
const { calculatePnl } = require('../utils/helpers');
const { cacheGet, cacheSet, cacheDel } = require('../config/redis');
const { config } = require('../config');

class PortfolioService {
  async getPortfolio(userId) {
    // Try cache first
    const cacheKey = `portfolio:${userId}`;
    const cached = await cacheGet(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      // Update with live prices
      return this.enrichWithLivePrices(parsed);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true },
    });

    if (!user) throw new Error('User not found');

    const holdings = await prisma.holding.findMany({
      where: { userId },
    });

    const portfolioHoldings = holdings.map((h) => {
      const currentPrice = binanceService.getPrice(h.symbol) || h.avgBuyPrice;
      const { pnl, pnlPercentage, currentValue } = calculatePnl(currentPrice, h.avgBuyPrice, h.quantity);

      return {
        symbol: h.symbol,
        quantity: h.quantity,
        avgBuyPrice: h.avgBuyPrice,
        currentPrice,
        currentValue,
        pnl,
        pnlPercentage,
      };
    });

    const holdingsValue = portfolioHoldings.reduce((sum, h) => sum + h.currentValue, 0);
    const totalCost = portfolioHoldings.reduce((sum, h) => sum + h.avgBuyPrice * h.quantity, 0);
    const totalPnl = holdingsValue - totalCost;
    const totalPnlPercentage = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;

    const portfolio = {
      totalValue: user.balance + holdingsValue,
      cashBalance: user.balance,
      holdingsValue,
      totalPnl,
      totalPnlPercentage,
      holdings: portfolioHoldings,
    };

    // Cache for 5 seconds
    await cacheSet(cacheKey, JSON.stringify(portfolio), 5);

    return portfolio;
  }

  enrichWithLivePrices(portfolio) {
    let holdingsValue = 0;
    let totalCost = 0;

    portfolio.holdings = portfolio.holdings.map((h) => {
      const currentPrice = binanceService.getPrice(h.symbol) || h.currentPrice;
      const { pnl, pnlPercentage, currentValue } = calculatePnl(currentPrice, h.avgBuyPrice, h.quantity);
      holdingsValue += currentValue;
      totalCost += h.avgBuyPrice * h.quantity;

      return { ...h, currentPrice, currentValue, pnl, pnlPercentage };
    });

    const totalPnl = holdingsValue - totalCost;
    const totalPnlPercentage = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;

    return {
      ...portfolio,
      holdingsValue,
      totalValue: portfolio.cashBalance + holdingsValue,
      totalPnl,
      totalPnlPercentage,
    };
  }

  async invalidateCache(userId) {
    await cacheDel(`portfolio:${userId}`);
  }

  async getLeaderboard(limit = 20) {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        balance: true,
        holdings: true,
      },
    });

    const leaderboard = users.map((user) => {
      let holdingsValue = 0;
      let totalCost = 0;

      user.holdings.forEach((h) => {
        const price = binanceService.getPrice(h.symbol) || h.avgBuyPrice;
        holdingsValue += price * h.quantity;
        totalCost += h.avgBuyPrice * h.quantity;
      });

      const totalValue = user.balance + holdingsValue;
      const pnl = totalValue - config.initialBalance; // initial balance
      const pnlPercentage = (pnl / config.initialBalance) * 100;

      return {
        userId: user.id,
        username: user.username,
        totalValue,
        pnl,
        pnlPercentage,
        rank: 0,
      };
    });

    leaderboard.sort((a, b) => b.totalValue - a.totalValue);
    leaderboard.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return leaderboard.slice(0, limit);
  }
}

const portfolioService = new PortfolioService();
module.exports = { portfolioService };
