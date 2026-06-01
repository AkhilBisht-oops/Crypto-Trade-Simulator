const prisma = require('../config/database');

class WatchlistController {
  async getWatchlist(req, res) {
    try {
      const userId = req.user.userId;
      const watchlist = await prisma.watchlist.findMany({
        where: { userId },
        select: { id: true, symbol: true },
      });
      res.status(200).json({ success: true, data: watchlist });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async addToWatchlist(req, res) {
    try {
      const userId = req.user.userId;
      const { symbol } = req.body;
      const normalizedSymbol = symbol.toUpperCase();

      const existing = await prisma.watchlist.findUnique({
        where: { userId_symbol: { userId, symbol: normalizedSymbol } },
      });

      if (existing) {
        res.status(409).json({ success: false, error: 'Symbol already in watchlist' });
        return;
      }

      const item = await prisma.watchlist.create({
        data: { userId, symbol: normalizedSymbol },
      });

      res.status(201).json({ success: true, data: item });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async removeFromWatchlist(req, res) {
    try {
      const userId = req.user.userId;
      const symbol = req.params.symbol;
      const normalizedSymbol = symbol.toUpperCase();

      await prisma.watchlist.delete({
        where: { userId_symbol: { userId, symbol: normalizedSymbol } },
      });

      res.status(200).json({ success: true, message: 'Removed from watchlist' });
    } catch (error) {
      if (error.code === 'P2025') {
        res.status(404).json({ success: false, error: 'Symbol not in watchlist' });
        return;
      }
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

const watchlistController = new WatchlistController();
module.exports = { watchlistController };
