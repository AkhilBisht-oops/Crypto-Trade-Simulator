const Redis = require('ioredis');
const { config } = require('./index');

let redis = null;
let redisDisabled = false; // Once Redis fails, stop retrying

function getRedisClient() {
  if (redisDisabled) return null;

  if (!redis) {
    try {
      redis = new Redis(config.redisUrl, {
        maxRetriesPerRequest: 1,
        retryStrategy(times) {
          if (times > 2) {
            return null; // Stop retrying
          }
          return Math.min(times * 200, 1000);
        },
        lazyConnect: true,
        enableOfflineQueue: false,
      });

      redis.on('connect', () => console.log('[Redis] Connected'));
      redis.on('error', () => {}); // Suppress repetitive error logs

      redis.connect().catch(() => {
        console.warn('[Redis] Could not connect — running without cache');
        redis = null;
        redisDisabled = true;
      });
    } catch {
      console.warn('[Redis] Initialization failed — running without cache');
      redis = null;
      redisDisabled = true;
    }
  }
  return redis;
}

async function cacheGet(key) {
  try {
    const client = getRedisClient();
    if (!client) return null;
    return await client.get(key);
  } catch {
    return null;
  }
}

async function cacheSet(key, value, ttlSeconds = 60) {
  try {
    const client = getRedisClient();
    if (!client) return;
    await client.set(key, value, 'EX', ttlSeconds);
  } catch {
    // silent fail
  }
}

async function cacheDel(key) {
  try {
    const client = getRedisClient();
    if (!client) return;
    await client.del(key);
  } catch {
    // silent fail
  }
}

module.exports = { getRedisClient, cacheGet, cacheSet, cacheDel };
