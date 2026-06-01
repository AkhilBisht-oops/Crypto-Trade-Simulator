const prisma = require('../config/database');
const { roundToDecimals } = require('../utils/helpers');
const { binanceService } = require('./binance.service');

class TradeService {
  async executeTrade(userId, symbol, type, quantity) {
    const normalizedSymbol = symbol.toUpperCase();
    const currentPrice = binanceService.getPrice(normalizedSymbol);

    if (!currentPrice) {
      throw new Error(`Price not available for ${normalizedSymbol}. Please wait for market data.`);
    }

    const roundedQuantity = roundToDecimals(quantity, 8);
    if (roundedQuantity <= 0) {
      throw new Error('Quantity must be at least 0.00000001');
    }

    const total = roundToDecimals(currentPrice * roundedQuantity, 2);

    if (type === 'BUY') {
      return this.executeBuy(userId, normalizedSymbol, roundedQuantity, currentPrice, total);
    } else {
      return this.executeSell(userId, normalizedSymbol, roundedQuantity, currentPrice, total);
    }
  }

  async executeBuy(userId, symbol, quantity, price, total) {
    return prisma.$transaction(async (tx) => {
      // Check balance
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error('User not found');
      if (user.balance < total) {
        throw new Error(`Insufficient balance. Required: $${total.toFixed(2)}, Available: $${user.balance.toFixed(2)}`);
      }

      // Deduct balance
      await tx.user.update({
        where: { id: userId },
        data: { balance: { decrement: total } },
      });

      // Update or create holding
      const existingHolding = await tx.holding.findUnique({
        where: { userId_symbol: { userId, symbol } },
      });

      if (existingHolding) {
        const totalQuantity = existingHolding.quantity + quantity;
        const newAvgPrice = roundToDecimals(
          (existingHolding.avgBuyPrice * existingHolding.quantity + price * quantity) / totalQuantity,
          8
        );

        await tx.holding.update({
          where: { userId_symbol: { userId, symbol } },
          data: {
            quantity: totalQuantity,
            avgBuyPrice: newAvgPrice,
          },
        });
      } else {
        await tx.holding.create({
          data: {
            userId,
            symbol,
            quantity,
            avgBuyPrice: price,
          },
        });
      }

      // Record trade
      const trade = await tx.trade.create({
        data: {
          userId,
          symbol,
          type: 'BUY',
          quantity,
          price,
          total,
        },
      });

      return {
        trade,
        message: `Successfully bought ${quantity} ${symbol} at $${price.toFixed(2)}`,
      };
    });
  }

  async executeSell(userId, symbol, quantity, price, total) {
    return prisma.$transaction(async (tx) => {
      // Check holdings
      const holding = await tx.holding.findUnique({
        where: { userId_symbol: { userId, symbol } },
      });

      if (!holding || holding.quantity < quantity) {
        const available = holding?.quantity || 0;
        throw new Error(`Insufficient holdings. Available: ${available} ${symbol}`);
      }

      // Add balance
      await tx.user.update({
        where: { id: userId },
        data: { balance: { increment: total } },
      });

      // Update holding
      const remainingQuantity = roundToDecimals(holding.quantity - quantity, 8);

      if (remainingQuantity <= 0.00000001) {
        await tx.holding.delete({
          where: { userId_symbol: { userId, symbol } },
        });
      } else {
        await tx.holding.update({
          where: { userId_symbol: { userId, symbol } },
          data: { quantity: remainingQuantity },
        });
      }

      // Record trade
      const trade = await tx.trade.create({
        data: {
          userId,
          symbol,
          type: 'SELL',
          quantity,
          price,
          total,
        },
      });

      return {
        trade,
        message: `Successfully sold ${quantity} ${symbol} at $${price.toFixed(2)}`,
      };
    });
  }

  async getTradeHistory(
    userId,
    page = 1,
    limit = 20,
    symbol,
    type,
    startDate,
    endDate
  ) {
    const where = { userId };

    if (symbol) where.symbol = symbol.toUpperCase();
    if (type) where.type = type;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [trades, totalCount] = await Promise.all([
      prisma.trade.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.trade.count({ where }),
    ]);

    return {
      trades,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }
}

const tradeService = new TradeService();
module.exports = { tradeService };
