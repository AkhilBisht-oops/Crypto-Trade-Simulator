const dotenv = require('dotenv');
dotenv.config();

const parseCorsOrigin = () => {
  const originStr = process.env.CORS_ORIGIN || 'http://localhost:5173';
  if (originStr === '*') return '*';

  const origins = originStr.split(',').map(o => o.trim());
  const finalOrigins = [];
  origins.forEach(origin => {
    finalOrigins.push(origin);
    const clean = origin.replace(/\/$/, '');
    if (clean !== origin) {
      finalOrigins.push(clean);
    } else {
      finalOrigins.push(clean + '/');
    }
  });
  
  const devOrigins = ['http://localhost:5173', 'http://localhost:5173/'];
  devOrigins.forEach(devOrig => {
    if (!finalOrigins.includes(devOrig)) {
      finalOrigins.push(devOrig);
    }
  });

  return finalOrigins;
};

const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  databaseUrl: process.env.DATABASE_URL || '',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_key',
  corsOrigin: parseCorsOrigin(),
  nodeEnv: process.env.NODE_ENV || 'development',
  binanceWsUrl: process.env.BINANCE_WS_URL || 'wss://stream.binance.com:9443/ws',
  supportedSymbols: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT', 'ADAUSDT', 'DOGEUSDT', 'DOTUSDT'],
  initialBalance: 10000,
};

module.exports = { config };
