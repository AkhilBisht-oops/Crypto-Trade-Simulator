const { Server: SocketServer } = require('socket.io');
const { config } = require('../config');
const { verifyToken } = require('../utils/jwt');
const { binanceService } = require('../services/binance.service');

let io = null;

function getSocketServer() {
  return io;
}

function initializeWebSocket(httpServer) {
  io = new SocketServer(httpServer, {
    cors: {
      origin: config.corsOrigin,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Authentication middleware for Socket.IO
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      // Allow unauthenticated connections for price feeds
      socket.data.authenticated = false;
      return next();
    }

    try {
      const decoded = verifyToken(token);
      socket.data.user = decoded;
      socket.data.authenticated = true;
      next();
    } catch (err) {
      socket.data.authenticated = false;
      next();
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Join user-specific room if authenticated
    if (socket.data.authenticated && socket.data.user) {
      socket.join(`user:${socket.data.user.userId}`);
      console.log(`[Socket.IO] User ${socket.data.user.username} joined their room`);
    }

    // Send current prices immediately
    const currentPrices = binanceService.getAllPrices();
    socket.emit('prices:update', currentPrices);

    // Handle subscribe to specific symbols
    socket.on('prices:subscribe', (symbols) => {
      symbols.forEach((symbol) => {
        socket.join(`price:${symbol.toUpperCase()}`);
      });
    });

    // Handle unsubscribe
    socket.on('prices:unsubscribe', (symbols) => {
      symbols.forEach((symbol) => {
        socket.leave(`price:${symbol.toUpperCase()}`);
      });
    });

    socket.on('disconnect', (reason) => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id} (${reason})`);
    });
  });

  // Connect to Binance and broadcast price updates
  let lastBroadcast = 0;
  const BROADCAST_INTERVAL = 1000; // Throttle to 1 update per second

  binanceService.connect((prices) => {
    const now = Date.now();
    if (now - lastBroadcast < BROADCAST_INTERVAL) return;
    lastBroadcast = now;

    const pricesObj = {};
    prices.forEach((value, key) => {
      if (value.price > 0) {
        pricesObj[key] = value;
      }
    });

    if (io && Object.keys(pricesObj).length > 0) {
      io.emit('prices:update', pricesObj);
    }
  });

  console.log('[Socket.IO] WebSocket server initialized');
  return io;
}

module.exports = { getSocketServer, initializeWebSocket };
