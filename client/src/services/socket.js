import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.priceCallbacks = new Set();
    this.tradeCallbacks = new Set();
  }

  connect(token) {
    if (this.socket?.connected) return;

    this.socket = io('/', {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    this.socket.on('connect', () => {
      console.log('[Socket] Connected');
    });

    this.socket.on('prices:update', (prices) => {
      this.priceCallbacks.forEach((cb) => cb(prices));
    });

    this.socket.on('trade:executed', (data) => {
      this.tradeCallbacks.forEach((cb) => cb(data));
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
    });

    this.socket.on('connect_error', (err) => {
      console.warn('[Socket] Connection error:', err.message);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onPriceUpdate(callback) {
    this.priceCallbacks.add(callback);
    return () => this.priceCallbacks.delete(callback);
  }

  onTradeExecuted(callback) {
    this.tradeCallbacks.add(callback);
    return () => this.tradeCallbacks.delete(callback);
  }

  subscribeToSymbols(symbols) {
    this.socket?.emit('prices:subscribe', symbols);
  }

  isConnected() {
    return this.socket?.connected ?? false;
  }
}

export const socketService = new SocketService();
