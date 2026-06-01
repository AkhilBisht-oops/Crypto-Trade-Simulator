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
      color: 'text-textPrimary',
      iconColor: 'text-accentColor',
      iconBg: 'bg-accentColor/10',
    },
    {
      label: 'Cash Balance',
      value: formatCurrency(portfolio.cashBalance),
      icon: HiCash,
      color: 'text-textPrimary',
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-500/10',
    },
    {
      label: 'Holdings Value',
      value: formatCurrency(portfolio.holdingsValue),
      icon: HiCollection,
      color: 'text-textPrimary',
      iconColor: 'text-cyan-500',
      iconBg: 'bg-cyan-500/10',
    },
    {
      label: 'Total P&L',
      value: `${formatCurrency(Math.abs(portfolio.totalPnl))}`,
      subtitle: formatPercentage(portfolio.totalPnlPercentage),
      icon: isProfit ? HiTrendingUp : HiTrendingDown,
      color: isProfit ? 'text-successColor' : 'text-dangerColor',
      iconColor: isProfit ? 'text-successColor' : 'text-dangerColor',
      iconBg: isProfit ? 'bg-successColorLight' : 'bg-dangerColorLight',
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
                <span className="text-xs text-textMuted font-medium">{stat.label}</span>
              </div>
              <p className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
              {stat.subtitle && (
                <p className={`text-xs font-mono font-semibold mt-1 ${stat.color}`}>
                  {isProfit ? '+' : '-'}{stat.subtitle}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {portfolio.holdings.length > 0 && (
        <div className="glass-card">
          <div className="p-4 border-b border-borderAccent/60">
            <h3 className="text-sm font-semibold text-textPrimary">Holdings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-textMuted border-b border-borderAccent">
                  <th className="p-4 font-semibold">Asset</th>
                  <th className="p-4 font-semibold">Quantity</th>
                  <th className="p-4 font-semibold">Avg Price</th>
                  <th className="p-4 font-semibold">Current Price</th>
                  <th className="p-4 font-semibold">Value</th>
                  <th className="p-4 font-semibold">P&L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderAccent/50">
                {portfolio.holdings.map((h) => {
                  const info = SYMBOL_INFO[h.symbol];
                  const isProfitable = h.pnl >= 0;
                  return (
                     <tr key={h.symbol} className="hover:bg-bgSub/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <span style={{ color: info?.color }} className="text-base">{info?.icon}</span>
                          <div>
                            <p className="font-semibold text-textPrimary text-sm">{h.symbol.replace('USDT', '')}</p>
                            <p className="text-xs text-textMuted">{info?.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-sm text-textSecondary">{h.quantity.toFixed(6)}</td>
                      <td className="p-4 font-mono text-sm text-textMuted">{formatCurrency(h.avgBuyPrice)}</td>
                      <td className="p-4 font-mono text-sm text-textSecondary">{formatCurrency(h.currentPrice)}</td>
                      <td className="p-4 font-mono text-sm text-textPrimary font-semibold">{formatCurrency(h.currentValue)}</td>
                      <td className="p-4">
                        <div className={`font-mono text-sm font-semibold ${isProfitable ? 'text-successColor' : 'text-dangerColor'}`}>
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
