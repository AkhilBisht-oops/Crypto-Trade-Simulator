const { portfolioService } = require('../services/portfolio.service');

class PortfolioController {
  async getPortfolio(req, res) {
    try {
      const userId = req.user.userId;
      const portfolio = await portfolioService.getPortfolio(userId);
      res.status(200).json({ success: true, data: portfolio });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getLeaderboard(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 20;
      const leaderboard = await portfolioService.getLeaderboard(limit);
      res.status(200).json({ success: true, data: leaderboard });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

const portfolioController = new PortfolioController();
module.exports = { portfolioController };
