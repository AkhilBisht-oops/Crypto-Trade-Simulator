const { Router } = require('express');
const { priceController } = require('../controllers/price.controller');

const router = Router();

router.get('/', (req, res) => priceController.getAllPrices(req, res));
router.get('/:symbol', (req, res) => priceController.getPrice(req, res));
router.get('/:symbol/history', (req, res) => priceController.getPriceHistory(req, res));

module.exports = router;
