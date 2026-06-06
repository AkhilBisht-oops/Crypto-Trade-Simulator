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
    this.wsConnected = false;

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

  /**
   * Fetch initial prices from Binance REST API (works globally, no geo-block).
   * This ensures prices are available immediately on server startup,
   * even before the WebSocket connects (or if it's blocked by 451).
   */
  async fetchInitialPrices() {
    try {
      const restUrl = process.env.BINANCE_REST_URL || 'https://api.binance.com';
      const symbolsParam = config.supportedSymbols.map(s => `"${s}"`).join(',');
      const url = `${restUrl}/api/v3/ticker/24hr?symbols=[${symbolsParam}]`;

      console.log('[Binance] Fetching initial prices via REST API...');
      const response = await fetch(url);

      if (!response.ok) {
        // If binance.com is blocked, try binance.us
        console.warn(`[Binance] REST API returned ${response.status}, trying fallback...`);
        return await this.fetchInitialPricesFallback();
      }

      const data = await response.json();
      let count = 0;

      for (const ticker of data) {
        const symbol = ticker.symbol;
        if (!config.supportedSymbols.includes(symbol)) continue;

        const price = parseFloat(ticker.lastPrice);
        const change24h = parseFloat(ticker.priceChangePercent);

        if (price > 0) {
          const priceData = { symbol, price, change24h, timestamp: Date.now() };
          this.prices.set(symbol, priceData);

          const history = this.priceHistory.get(symbol) || [];
          history.push(price);
          this.priceHistory.set(symbol, history);

          cacheSet(`price:${symbol}`, JSON.stringify(priceData), 60).catch(() => {});
          count++;
        }
      }

      console.log(`[Binance] Loaded ${count} initial prices via REST API`);

      if (this.onPriceUpdate) {
        this.onPriceUpdate(this.prices);
      }
    } catch (err) {
      console.warn('[Binance] REST API fetch failed:', err.message);
      await this.fetchInitialPricesFallback();
    }
  }

  /**
   * Fallback: fetch prices from Binance US REST API.
   */
  async fetchInitialPricesFallback() {
    try {
      console.log('[Binance] Trying Binance US REST API as fallback...');

      let count = 0;
      for (const symbol of config.supportedSymbols) {
        try {
          const url = `https://api.binance.us/api/v3/ticker/24hr?symbol=${symbol}`;
          const response = await fetch(url);
          if (!response.ok) continue;

          const ticker = await response.json();
          const price = parseFloat(ticker.lastPrice);
          const change24h = parseFloat(ticker.priceChangePercent);

          if (price > 0) {
            const priceData = { symbol, price, change24h, timestamp: Date.now() };
            this.prices.set(symbol, priceData);

            const history = this.priceHistory.get(symbol) || [];
            history.push(price);
            this.priceHistory.set(symbol, history);

            cacheSet(`price:${symbol}`, JSON.stringify(priceData), 60).catch(() => {});
            count++;
          }
        } catch {
          // Some symbols may not exist on Binance US, skip them
        }
      }

      console.log(`[Binance] Loaded ${count} prices from Binance US fallback`);

      if (this.onPriceUpdate && count > 0) {
        this.onPriceUpdate(this.prices);
      }
    } catch (err) {
      console.warn('[Binance] All REST API fallbacks failed:', err.message);
    }
  }

  connect(onPriceUpdate) {
    if (onPriceUpdate) {
      this.onPriceUpdate = onPriceUpdate;
    }

    // Fetch initial prices via REST immediately (non-blocking)
    this.fetchInitialPrices();

    // Also set up a periodic REST poll as backup (every 10 seconds)
    this.pollInterval = setInterval(() => {
      if (!this.wsConnected) {
        this.fetchInitialPrices();
      }
    }, 10000);

    const streams = config.supportedSymbols.map((s) => `${s.toLowerCase()}@miniTicker`).join('/');
    const url = `${config.binanceWsUrl}/${streams}`;

    console.log('[Binance] Connecting to WebSocket...');

    try {
      this.ws = new WebSocket(url);

      this.ws.on('open', () => {
        console.log('[Binance] WebSocket connected');
        this.reconnectAttempts = 0;
        this.wsConnected = true;
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
        this.wsConnected = false;
        this.scheduleReconnect();
      });

      this.ws.on('error', (err) => {
        console.error('[Binance] WebSocket error:', err.message);
        this.wsConnected = false;
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
    let change24h = parseFloat(data.P || '0');

    // miniTicker doesn't have P (priceChangePercent), so we calculate it
    if (!data.P && data.o) {
      const openPrice = parseFloat(data.o);
      if (openPrice > 0) {
        change24h = ((price - openPrice) / openPrice) * 100;
      }
    }

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
      console.error('[Binance] Max reconnect attempts reached, falling back to REST polling');
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
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

const binanceService = new BinanceService();
module.exports = { binanceService };
