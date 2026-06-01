import { usePriceStore } from '../stores/priceStore';
import { SYMBOL_INFO } from '../types';
import { formatCryptoPrice, formatPercentage } from '../utils/format';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const EMPTY_ARRAY = [];

export default function TradingCard({ symbol, onSelect, isSelected }) {
  const priceData = usePriceStore((s) => s.prices[symbol]);
  const history = usePriceStore((s) => s.priceHistory[symbol] ?? EMPTY_ARRAY);
  const info = SYMBOL_INFO[symbol];

  if (!priceData || priceData.price === 0) {
    return (
      <div className="glass-card p-4 animate-pulse">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg skeleton" />
          <div>
            <div className="h-4 w-16 skeleton mb-1" />
            <div className="h-3 w-24 skeleton" />
          </div>
        </div>
        <div className="h-6 w-28 skeleton mb-2" />
        <div className="h-12 skeleton rounded" />
      </div>
    );
  }

  const isUp = priceData.change24h >= 0;
  const chartData = history.map((p, i) => ({ i, p }));

  return (
    <button
      onClick={() => onSelect(symbol)}
      className={`glass-card-hover p-4 text-left w-full transition-all duration-200 ${
        isSelected ? 'border-indigo-500/40 bg-indigo-500/5' : ''
      }`}
    >
      {/* Subtle left accent for selected card */}
      {isSelected && (
        <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-indigo-500" />
      )}
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
            style={{ backgroundColor: `${info.color}10`, color: info.color }}
          >
            {info.icon}
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">{symbol.replace('USDT', '')}</h3>
            <p className="text-[11px] text-dark-400">{info.name}</p>
          </div>
        </div>
        <span className={`text-xs font-medium font-mono px-2 py-0.5 rounded-md ${
          isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
        }`}>
          {isUp ? '+' : ''}{formatPercentage(priceData.change24h)}
        </span>
      </div>

      <p className="text-lg font-semibold font-mono text-white mb-3">
        {formatCryptoPrice(priceData.price)}
      </p>

      {chartData.length > 2 && (
        <div className="h-10 opacity-60 hover:opacity-100 transition-opacity">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="p"
                stroke={isUp ? '#34d399' : '#fb7185'}
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </button>
  );
}
