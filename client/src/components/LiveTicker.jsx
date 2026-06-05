import { usePriceStore } from '../stores/priceStore';
import { SYMBOL_INFO } from '../types';
import { formatCryptoPrice, formatPercentage } from '../utils/format';

export default function LiveTicker() {
  const prices = usePriceStore((s) => s.prices);
  const symbols = Object.keys(SYMBOL_INFO);

  const tickerItems = symbols
    .filter((s) => prices[s]?.price > 0)
    .map((symbol) => {
      const price = prices[symbol];
      const info = SYMBOL_INFO[symbol];
      const isUp = price.change24h >= 0;
      return { symbol, price, info, isUp };
    });

  if (tickerItems.length === 0) return null;

  // Duplicate for infinite scroll effect
  const items = [...tickerItems, ...tickerItems];

  return (
    <div
      className="w-full overflow-hidden py-2.5 transition-colors duration-200"
      style={{
        backgroundColor: 'var(--bg-sub)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="flex animate-ticker whitespace-nowrap">
        {items.map((item, idx) => (
          <div
            key={`${item.symbol}-${idx}`}
            className="flex items-center gap-2 px-5"
            style={{ borderRight: '1px solid var(--border)' }}
          >
            <span className="text-sm" style={{ color: item.info.color }}>{item.info.icon}</span>
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              {item.symbol.replace('USDT', '')}
            </span>
            <span className="text-sm font-mono" style={{ color: 'var(--text-primary)' }}>
              {formatCryptoPrice(item.price.price)}
            </span>
            <span
              className="text-xs font-mono px-1.5 py-0.5 rounded"
              style={{ color: item.isUp ? 'var(--success)' : 'var(--danger)' }}
            >
              {item.isUp ? '+' : ''}{formatPercentage(item.price.change24h)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
