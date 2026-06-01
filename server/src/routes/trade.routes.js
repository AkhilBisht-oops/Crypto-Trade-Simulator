const { Router } = require('express');
const { tradeController } = require('../controllers/trade.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { tradeSchema } = require('../validators/trade.validator');

const router = Router();

router.post('/', authenticate, validate(tradeSchema), (req, res) => tradeController.executeTrade(req, res));
router.get('/history', authenticate, (req, res) => tradeController.getTradeHistory(req, res));

module.exports = router;
