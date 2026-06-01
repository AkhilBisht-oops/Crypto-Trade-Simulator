const express = require('express');
const { createServer } = require('http');
const cors = require('cors');
const { config } = require('./config');
const { initializeWebSocket } = require('./websocket');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/auth.routes');
const tradeRoutes = require('./routes/trade.routes');
const portfolioRoutes = require('./routes/portfolio.routes');
const watchlistRoutes = require('./routes/watchlist.routes');
const priceRoutes = require('./routes/price.routes');

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/prices', priceRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Initialize WebSocket
initializeWebSocket(httpServer);

// Start server
httpServer.listen(config.port, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║   🚀 Crypto Trading Simulator Server    ║
  ║   Running on port ${config.port}                  ║
  ║   Environment: ${config.nodeEnv.padEnd(22)}  ║
  ╚══════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down...');
  httpServer.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down...');
  httpServer.close(() => process.exit(0));
});

module.exports = app;
