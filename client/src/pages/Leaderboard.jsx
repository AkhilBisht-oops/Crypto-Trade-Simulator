import { useEffect } from 'react';
import { usePortfolioStore } from '../stores/portfolioStore';
import { formatCurrency, formatPercentage } from '../utils/format';
import { HiTrophy } from 'react-icons/hi2';

export default function Leaderboard() {
  const { leaderboard, fetchLeaderboard } = usePortfolioStore();

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Global Leaderboard</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Compare your virtual trading performance with other simulated accounts</p>
      </div>

      <div className="glass-card max-w-4xl mx-auto">
        <div className="p-5 flex items-center gap-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
            <HiTrophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Top Performers</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Ranked by total valuation (cash + holdings)</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                <th className="p-4 text-center font-medium">Rank</th>
                <th className="p-4 font-medium">Trader</th>
                <th className="p-4 text-right font-medium">Total Portfolio Value</th>
                <th className="p-4 text-right font-medium">All-Time Return</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                    Leaderboard is calculating...
                  </td>
                </tr>
              ) : (
                leaderboard.map((entry) => {
                  const isUp = entry.pnl >= 0;
                  const isGold = entry.rank === 1;
                  const isSilver = entry.rank === 2;
                  const isBronze = entry.rank === 3;
                  
                  let rankStyles = {
                    backgroundColor: 'var(--bg-sub)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-secondary)'
                  };

                  if (isGold) {
                    rankStyles = {
                      backgroundColor: 'rgba(234, 179, 8, 0.1)',
                      borderColor: 'rgba(234, 179, 8, 0.2)',
                      color: 'rgb(234, 179, 8)'
                    };
                  } else if (isSilver) {
                    rankStyles = {
                      backgroundColor: 'var(--bg-sub)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)'
                    };
                  } else if (isBronze) {
                    rankStyles = {
                      backgroundColor: 'rgba(249, 115, 22, 0.1)',
                      borderColor: 'rgba(249, 115, 22, 0.2)',
                      color: 'rgb(249, 115, 22)'
                    };
                  }

                  return (
                    <tr
                      key={entry.userId}
                      className="transition-colors"
                      style={{ borderBottom: '1px solid var(--border)' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-sub)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td className="p-4 text-center">
                        <span
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg border text-xs font-semibold font-mono"
                          style={rankStyles}
                        >
                          {entry.rank}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center font-medium text-xs border"
                            style={{
                              backgroundColor: 'var(--bg-sub)',
                              color: 'var(--text-secondary)',
                              borderColor: 'var(--border)'
                            }}
                          >
                            {entry.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{entry.username}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right font-mono text-sm" style={{ color: 'var(--text-primary)' }}>
                        {formatCurrency(entry.totalValue)}
                      </td>
                      <td className="p-4 text-right font-mono">
                        <span className="text-xs" style={{ color: isUp ? 'var(--success)' : 'var(--danger)' }}>
                          {isUp ? '+' : ''}{formatPercentage(entry.pnlPercentage)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
