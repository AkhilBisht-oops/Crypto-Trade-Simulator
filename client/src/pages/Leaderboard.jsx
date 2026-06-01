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
    <div className="space-y-6 animate-fade-in text-textSecondary">
      <div>
        <h1 className="text-2xl font-bold text-textPrimary tracking-tight">Global Leaderboard</h1>
        <p className="text-textSecondary text-sm mt-1">Compare your virtual trading performance with other simulated accounts</p>
      </div>

      <div className="glass-card max-w-4xl mx-auto">
        <div className="p-5 border-b border-borderAccent/60 flex items-center gap-3">
          <div className="p-2 bg-amber-500/15 rounded-lg">
            <HiTrophy className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h2 className="font-semibold text-textPrimary text-sm">Top Performers</h2>
            <p className="text-xs text-textMuted">Ranked by total valuation (cash + holdings)</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-textMuted border-b border-borderAccent">
                <th className="p-4 text-center font-semibold">Rank</th>
                <th className="p-4 font-semibold">Trader</th>
                <th className="p-4 text-right font-semibold">Total Portfolio Value</th>
                <th className="p-4 text-right font-semibold">All-Time Return</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderAccent/50">
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-textMuted text-sm font-medium">
                    Leaderboard is calculating...
                  </td>
                </tr>
              ) : (
                leaderboard.map((entry) => {
                  const isUp = entry.pnl >= 0;
                  const rankColors =
                    entry.rank === 1
                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      : entry.rank === 2
                      ? 'bg-bgSub text-textPrimary border-borderAccent'
                      : entry.rank === 3
                      ? 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                      : 'text-textMuted border-borderAccent bg-bgSub/40';

                  return (
                    <tr
                      key={entry.userId}
                      className="hover:bg-bgSub/40 transition-colors"
                    >
                      <td className="p-4 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border text-xs font-bold font-mono ${rankColors}`}
                        >
                          {entry.rank}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-bgSub border border-borderAccent flex items-center justify-center font-semibold text-textPrimary text-xs">
                            {entry.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-textPrimary text-sm">{entry.username}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right font-mono text-sm text-textPrimary font-semibold">
                        {formatCurrency(entry.totalValue)}
                      </td>
                      <td className="p-4 text-right font-mono">
                        <span className={`text-xs font-semibold ${isUp ? 'text-successColor' : 'text-dangerColor'}`}>
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
