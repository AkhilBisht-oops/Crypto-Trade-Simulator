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
      color: 'var(--accent)',
      iconBg: 'var(--accent-light)',
    },
    {
      label: 'Cash Balance',
      value: formatCurrency(portfolio.cashBalance),
      icon: HiCash,
      color: '#eab308',
      iconBg: '#eab30815',
    },
    {
      label: 'Holdings Value',
      value: formatCurrency(portfolio.holdingsValue),
      icon: HiCollection,
      color: '#06b6d4',
      iconBg: '#06b6d415',
    },
    {
      label: 'Total P&L',
      value: `${formatCurrency(Math.abs(portfolio.totalPnl))}`,
      subtitle: formatPercentage(portfolio.totalPnlPercentage),
      icon: isProfit ? HiTrendingUp : HiTrendingDown,
      color: isProfit ? 'var(--success)' : 'var(--danger)',
      iconBg: isProfit ? 'var(--success-light)' : 'var(--danger-light)',
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
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: stat.iconBg }}
                >
                  <Icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</span>
              </div>
              <p className="text-xl font-semibold font-mono" style={{ color: 'var(--text-primary)' }}>
                {stat.value}
              </p>
              {stat.subtitle && (
                <p className="text-xs font-mono mt-1" style={{ color: stat.color }}>
                  {isProfit ? '+' : '-'}{stat.subtitle}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {portfolio.holdings.length > 0 && (
        <div className="glass-card">
          <div className="p-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Holdings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                  <th className="p-4 font-medium">Asset</th>
                  <th className="p-4 font-medium">Quantity</th>
                  <th className="p-4 font-medium">Avg Price</th>
                  <th className="p-4 font-medium">Current Price</th>
                  <th className="p-4 font-medium">Value</th>
                  <th className="p-4 font-medium">P&L</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.holdings.map((h) => {
                  const info = SYMBOL_INFO[h.symbol];
                  const isProfitable = h.pnl >= 0;
                  return (
                    <tr
                      key={h.symbol}
                      className="transition-colors"
                      style={{ borderBottom: '1px solid var(--border)' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-sub)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <span style={{ color: info?.color }} className="text-base">{info?.icon}</span>
                          <div>
                            <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                              {h.symbol.replace('USDT', '')}
                            </p>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{info?.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {h.quantity.toFixed(6)}
                      </td>
                      <td className="p-4 font-mono text-sm" style={{ color: 'var(--text-muted)' }}>
                        {formatCurrency(h.avgBuyPrice)}
                      </td>
                      <td className="p-4 font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {formatCurrency(h.currentPrice)}
                      </td>
                      <td className="p-4 font-mono text-sm" style={{ color: 'var(--text-primary)' }}>
                        {formatCurrency(h.currentValue)}
                      </td>
                      <td className="p-4">
                        <div className="font-mono text-sm" style={{ color: isProfitable ? 'var(--success)' : 'var(--danger)' }}>
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
