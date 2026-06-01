import { usePriceStore } from '../stores/priceStore';
import { SYMBOL_INFO } from '../types';
import { formatCryptoPrice } from '../utils/format';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const EMPTY_ARRAY = [];

export default function PriceChart({ symbol }) {
  const history = usePriceStore((s) => s.priceHistory[symbol] ?? EMPTY_ARRAY);
  const priceData = usePriceStore((s) => s.prices[symbol]);
  const info = SYMBOL_INFO[symbol];

  const isUp = (priceData?.change24h || 0) >= 0;
  const color = isUp ? 'var(--success)' : 'var(--danger)';

  const chartData = history.map((price, index) => ({
    index,
    price,
  }));

  if (chartData.length < 3) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-textPrimary flex items-center gap-2 mb-4">
          <span style={{ color: info?.color }}>{info?.icon}</span>
          {symbol.replace('USDT', '')}/USDT
        </h3>
        <div className="h-64 flex items-center justify-center text-textMuted">
          <div className="text-center animate-pulse">
            <div className="text-3xl mb-3">📊</div>
            <p className="text-sm font-medium">Collecting price data...</p>
            <p className="text-xs text-textMuted mt-1">Chart will appear shortly</p>
          </div>
        </div>
      </div>
    );
  }

  const minPrice = Math.min(...history) * 0.9999;
  const maxPrice = Math.max(...history) * 1.0001;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-textPrimary flex items-center gap-2">
          <span style={{ color: info?.color }}>{info?.icon}</span>
          {symbol.replace('USDT', '')}/USDT
        </h3>
        <span className="font-mono text-xl font-bold text-textPrimary">
          {formatCryptoPrice(priceData?.price || 0)}
        </span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`gradient-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.15} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="index" hide />
            <YAxis domain={[minPrice, maxPrice]} hide />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontFamily: 'JetBrains Mono, monospace',
                boxShadow: 'var(--shadow-md)',
              }}
              formatter={(value) => [formatCryptoPrice(value), 'Price']}
              labelFormatter={() => ''}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={color}
              strokeWidth={2}
              fill={`url(#gradient-${symbol})`}
              dot={false}
              activeDot={{ r: 4, fill: color, stroke: 'var(--bg-card)', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
