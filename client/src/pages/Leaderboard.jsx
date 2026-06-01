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
        <h1 className="text-2xl font-semibold text-white">Global Leaderboard</h1>
        <p className="text-dark-400 text-sm mt-1">Compare your virtual trading performance with other simulated accounts</p>
      </div>

      <div className="glass-card max-w-4xl mx-auto">
        <div className="p-5 border-b border-white/5 flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg">
            <HiTrophy className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="font-semibold text-white text-sm">Top Performers</h2>
            <p className="text-xs text-dark-400">Ranked by total valuation (cash + holdings)</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-dark-400 border-b border-white/5">
                <th className="p-4 text-center font-medium">Rank</th>
                <th className="p-4 font-medium">Trader</th>
                <th className="p-4 text-right font-medium">Total Portfolio Value</th>
                <th className="p-4 text-right font-medium">All-Time Return</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-dark-400 text-sm">
                    Leaderboard is calculating...
                  </td>
                </tr>
              ) : (
                leaderboard.map((entry) => {
                  const isUp = entry.pnl >= 0;
                  const rankColors =
                    entry.rank === 1
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : entry.rank === 2
                      ? 'bg-dark-700/40 text-dark-200 border-white/10'
                      : entry.rank === 3
                      ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                      : 'text-dark-400 border-white/5 bg-dark-900/40';

                  return (
                    <tr
                      key={entry.userId}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="p-4 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border text-xs font-semibold font-mono ${rankColors}`}
                        >
                          {entry.rank}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center font-medium text-dark-200 text-xs border border-white/5">
                            {entry.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-white text-sm">{entry.username}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right font-mono text-sm text-white">
                        {formatCurrency(entry.totalValue)}
                      </td>
                      <td className="p-4 text-right font-mono">
                        <span className={`text-xs ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
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
