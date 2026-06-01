const { Router } = require('express');
const { portfolioController } = require('../controllers/portfolio.controller');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.get('/', authenticate, (req, res) => portfolioController.getPortfolio(req, res));
router.get('/leaderboard', (req, res) => portfolioController.getLeaderboard(req, res));

module.exports = router;
