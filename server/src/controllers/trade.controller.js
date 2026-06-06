const { tradeService } = require('../services/trade.service');
const { portfolioService } = require('../services/portfolio.service');
const { getSocketServer } = require('../websocket');

class TradeController {
  async executeTrade(req, res) {
    try {
      const { symbol, type, quantity } = req.body;
      const userId = req.user.userId;

      const result = await tradeService.executeTrade(userId, symbol, type, quantity);

      await portfolioService.invalidateCache(userId);

      const io = getSocketServer();
      if (io) {
        io.to(`user:${userId}`).emit('trade:executed', {
          trade: result.trade,
          message: result.message,
        });
      }

      res.status(201).json({ success: true, data: result });
    } catch (error) {
      const status = error.message.includes('Insufficient') ? 400 : 500;
      res.status(status).json({ success: false, error: error.message });
    }
  }

  async getTradeHistory(req, res) {
    try {
      const userId = req.user.userId;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const symbol = req.query.symbol;
      const type = req.query.type;
      const startDate = req.query.startDate;
      const endDate = req.query.endDate;

      const result = await tradeService.getTradeHistory(userId, page, limit, symbol, type, startDate, endDate);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

const tradeController = new TradeController();
module.exports = { tradeController };
