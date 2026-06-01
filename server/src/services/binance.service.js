const WebSocket = require('ws');
const { config } = require('../config');
const { cacheSet } = require('../config/redis');

class BinanceService {
  constructor() {
    this.ws = null;
    this.prices = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.reconnectDelay = 5000;
    this.onPriceUpdate = null;
    this.priceHistory = new Map();

    // Initialize with default prices
    config.supportedSymbols.forEach((symbol) => {
      this.prices.set(symbol, {
        symbol,
        price: 0,
        change24h: 0,
        timestamp: Date.now(),
      });
      this.priceHistory.set(symbol, []);
    });
  }

  connect(onPriceUpdate) {
    if (onPriceUpdate) {
      this.onPriceUpdate = onPriceUpdate;
    }

    const streams = config.supportedSymbols.map((s) => `${s.toLowerCase()}@miniTicker`).join('/');
    const url = `${config.binanceWsUrl}/${streams}`;

    console.log('[Binance] Connecting to WebSocket...');

    try {
      this.ws = new WebSocket(url);

      this.ws.on('open', () => {
        console.log('[Binance] WebSocket connected');
        this.reconnectAttempts = 0;
      });

      this.ws.on('message', (data) => {
        try {
          const parsed = JSON.parse(data.toString());
          this.handleMessage(parsed);
        } catch (err) {
          // ignore parse errors
        }
      });

      this.ws.on('close', () => {
        console.log('[Binance] WebSocket disconnected');
        this.scheduleReconnect();
      });

      this.ws.on('error', (err) => {
        console.error('[Binance] WebSocket error:', err.message);
      });
    } catch (err) {
      console.error('[Binance] Connection failed, will retry');
      this.scheduleReconnect();
    }
  }

  handleMessage(data) {
    if (!data.s || !data.c) return;

    const symbol = data.s;
    if (!config.supportedSymbols.includes(symbol)) return;

    const price = parseFloat(data.c);
    const change24h = parseFloat(data.P || '0');

    const priceData = {
      symbol,
      price,
      change24h,
      timestamp: Date.now(),
    };

    this.prices.set(symbol, priceData);

    // Store price history (last 100 prices for sparklines)
    const history = this.priceHistory.get(symbol) || [];
    history.push(price);
    if (history.length > 100) history.shift();
    this.priceHistory.set(symbol, history);

    // Cache in Redis
    cacheSet(`price:${symbol}`, JSON.stringify(priceData), 30).catch(() => {});

    if (this.onPriceUpdate) {
      this.onPriceUpdate(this.prices);
    }
  }

  scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[Binance] Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * this.reconnectAttempts;
    console.log(`[Binance] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      this.connect();
    }, delay);
  }

  getPrice(symbol) {
    const data = this.prices.get(symbol.toUpperCase());
    return data?.price || null;
  }

  getPriceData(symbol) {
    return this.prices.get(symbol.toUpperCase()) || null;
  }

  getAllPrices() {
    const result = {};
    this.prices.forEach((value, key) => {
      if (value.price > 0) {
        result[key] = value;
      }
    });
    return result;
  }

  getPriceHistory(symbol) {
    return this.priceHistory.get(symbol.toUpperCase()) || [];
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

const binanceService = new BinanceService();
module.exports = { binanceService };
