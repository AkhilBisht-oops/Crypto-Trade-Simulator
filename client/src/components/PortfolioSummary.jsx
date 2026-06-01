import { useEffect } from 'react';
import { usePortfolioStore } from '../stores/portfolioStore';
import { formatCurrency, formatPercentage } from '../utils/format';
import { SYMBOL_INFO } from '../types';
import { HiTrendingUp, HiTrendingDown, HiCash, HiCollection } from 'react-icons/hi';

export default function PortfolioSummary() {
  const { portfolio, fetchPortfolio } = usePortfolioStore();

  useEffect(() => {
    fetchPortfolio();
    const interval = setInterval(fetchPortfolio, 10000);
    return () => clearInterval(interval);
  }, [fetchPortfolio]);

  if (!portfolio) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card p-5 animate-pulse">
            <div className="h-4 w-24 skeleton mb-3" />
            <div className="h-7 w-32 skeleton" />
          </div>
        ))}
      </div>
    );
  }

  const isProfit = portfolio.totalPnl >= 0;

  const stats = [
    {
      label: 'Total Portfolio',
      value: formatCurrency(portfolio.totalValue),
      icon: HiCollection,
      color: 'text-white',
      iconColor: 'text-indigo-400',
      iconBg: 'bg-indigo-500/10',
    },
    {
      label: 'Cash Balance',
      value: formatCurrency(portfolio.cashBalance),
      icon: HiCash,
      color: 'text-white',
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/10',
    },
    {
      label: 'Holdings Value',
      value: formatCurrency(portfolio.holdingsValue),
      icon: HiCollection,
      color: 'text-white',
      iconColor: 'text-cyan-400',
      iconBg: 'bg-cyan-500/10',
    },
    {
      label: 'Total P&L',
      value: `${formatCurrency(Math.abs(portfolio.totalPnl))}`,
      subtitle: formatPercentage(portfolio.totalPnlPercentage),
      icon: isProfit ? HiTrendingUp : HiTrendingDown,
      color: isProfit ? 'text-emerald-400' : 'text-rose-400',
      iconColor: isProfit ? 'text-emerald-400' : 'text-rose-400',
      iconBg: isProfit ? 'bg-emerald-500/10' : 'bg-rose-500/10',
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                  <Icon className={`w-4 h-4 ${stat.iconColor}`} />
                </div>
                <span className="text-xs text-dark-400">{stat.label}</span>
              </div>
              <p className={`text-xl font-semibold font-mono ${stat.color}`}>{stat.value}</p>
              {stat.subtitle && (
                <p className={`text-xs font-mono mt-1 ${stat.color}`}>
                  {isProfit ? '+' : '-'}{stat.subtitle}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {portfolio.holdings.length > 0 && (
        <div className="glass-card">
          <div className="p-4 border-b border-white/5">
            <h3 className="text-sm font-semibold text-white">Holdings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-dark-400 border-b border-white/5">
                  <th className="p-4 font-medium">Asset</th>
                  <th className="p-4 font-medium">Quantity</th>
                  <th className="p-4 font-medium">Avg Price</th>
                  <th className="p-4 font-medium">Current Price</th>
                  <th className="p-4 font-medium">Value</th>
                  <th className="p-4 font-medium">P&L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {portfolio.holdings.map((h) => {
                  const info = SYMBOL_INFO[h.symbol];
                  const isProfitable = h.pnl >= 0;
                  return (
                    <tr key={h.symbol} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <span style={{ color: info?.color }} className="text-base">{info?.icon}</span>
                          <div>
                            <p className="font-medium text-white text-sm">{h.symbol.replace('USDT', '')}</p>
                            <p className="text-xs text-dark-400">{info?.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-sm text-dark-200">{h.quantity.toFixed(6)}</td>
                      <td className="p-4 font-mono text-sm text-dark-400">{formatCurrency(h.avgBuyPrice)}</td>
                      <td className="p-4 font-mono text-sm text-dark-200">{formatCurrency(h.currentPrice)}</td>
                      <td className="p-4 font-mono text-sm text-white">{formatCurrency(h.currentValue)}</td>
                      <td className="p-4">
                        <div className={`font-mono text-sm ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                          <p>{isProfitable ? '+' : ''}{formatCurrency(h.pnl)}</p>
                          <p className="text-xs">{isProfitable ? '+' : ''}{formatPercentage(h.pnlPercentage)}</p>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
