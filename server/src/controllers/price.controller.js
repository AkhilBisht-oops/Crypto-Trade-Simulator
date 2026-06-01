const { binanceService } = require('../services/binance.service');

class PriceController {
  async getAllPrices(_req, res) {
    try {
      const prices = binanceService.getAllPrices();
      res.status(200).json({ success: true, data: prices });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getPrice(req, res) {
    try {
      const symbol = req.params.symbol;
      const priceData = binanceService.getPriceData(symbol.toUpperCase());

      if (!priceData || priceData.price === 0) {
        res.status(404).json({ success: false, error: 'Price not available' });
        return;
      }

      res.status(200).json({ success: true, data: priceData });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getPriceHistory(req, res) {
    try {
      const symbol = req.params.symbol;
      const history = binanceService.getPriceHistory(symbol.toUpperCase());
      res.status(200).json({ success: true, data: history });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

const priceController = new PriceController();
module.exports = { priceController };
