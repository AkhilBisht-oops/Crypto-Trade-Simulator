const { Router } = require('express');
const { watchlistController } = require('../controllers/watchlist.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { watchlistSchema } = require('../validators/trade.validator');

const router = Router();

router.get('/', authenticate, (req, res) => watchlistController.getWatchlist(req, res));
router.post('/', authenticate, validate(watchlistSchema), (req, res) => watchlistController.addToWatchlist(req, res));
router.delete('/:symbol', authenticate, (req, res) => watchlistController.removeFromWatchlist(req, res));

module.exports = router;
