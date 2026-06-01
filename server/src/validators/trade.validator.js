const { z } = require('zod');
const { config } = require('../config');

const tradeSchema = z.object({
  symbol: z.string().refine((s) => config.supportedSymbols.includes(s.toUpperCase()), {
    message: 'Unsupported trading symbol',
  }),
  type: z.enum(['BUY', 'SELL']),
  quantity: z.number().positive('Quantity must be positive'),
});

const watchlistSchema = z.object({
  symbol: z.string().refine((s) => config.supportedSymbols.includes(s.toUpperCase()), {
    message: 'Unsupported symbol',
  }),
});

module.exports = { tradeSchema, watchlistSchema };
