import { Users, Award, TrendingUp } from 'lucide-react'

const TOP_TRADERS = [
  { rank: 1, name: 'Satoshi Trader', initials: 'ST', balance: 28450.20, profit: 184.50 },
  { rank: 2, name: 'Block Master', initials: 'BM', balance: 19120.45, profit: 91.20 },
  { rank: 3, name: 'Ether Whale', initials: 'EW', balance: 15310.00, profit: 53.10 },
  { rank: 4, name: 'Sol Runner', initials: 'SR', balance: 12940.55, profit: 29.41 },
  { rank: 5, name: 'HODL Crew', initials: 'HC', balance: 10840.00, profit: 8.40 }
]

export default function FeatureLeaderboard() {
  return (
    <section id="leaderboard" className="bg-main">
      <style>{`
        .leaderboard-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.875rem;
        }
        
        .leaderboard-table th {
          font-weight: 500;
          color: var(--text-secondary);
          padding: var(--space-3);
          border-bottom: 1px solid var(--border);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .leaderboard-table td {
          padding: var(--space-3);
          border-bottom: 1px solid var(--border);
          color: var(--text-primary);
          vertical-align: middle;
        }
        
        .leaderboard-table tr:last-child td {
          border-bottom: none;
        }
        
        .leaderboard-table tr:hover td {
          background-color: var(--bg-sub);
        }
        
        .avatar-circle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: var(--accent-light);
          color: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .rank-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .rank-1 { background-color: #fef08a; color: #854d0e; }
        .rank-2 { background-color: #e4e4e7; color: #3f3f46; }
        .rank-3 { background-color: #ffedd5; color: #9a3412; }
        .rank-other { color: var(--text-secondary); }
      `}</style>
      
      <div className="container grid-2">
        <div>
          <span className="badge">Social Competition</span>
          <h2>Global Leaderboard</h2>
          <p className="lead">
            Hone your skills and claim your rank. Every trader starts with a clean slate of $10,000. Compete with participants around the globe based on net portfolio returns.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ display: 'flex', width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--bg-sub)', border: '1px solid var(--border)', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                <Users size={16} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.875rem', marginBottom: '2px' }}>Real Competitors</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 0 }}>Compete with developers and traders from around the globe.</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ display: 'flex', width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--bg-sub)', border: '1px solid var(--border)', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                <TrendingUp size={16} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.875rem', marginBottom: '2px' }}>Detailed P&L Reporting</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 0 }}>Analyze growth curves, asset allocations, and order logs in real-time.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: 'var(--space-4)', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-sub)' }}>
              <Award size={16} style={{ color: 'var(--accent)' }} />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Top Traders Standings</span>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Trader</th>
                    <th style={{ textAlign: 'right' }}>Portfolio Value</th>
                    <th style={{ textAlign: 'right' }}>ROI</th>
                  </tr>
                </thead>
                <tbody>
                  {TOP_TRADERS.map((trader) => (
                    <tr key={trader.rank}>
                      <td>
                        <span className={`rank-badge ${
                          trader.rank === 1 ? 'rank-1' :
                          trader.rank === 2 ? 'rank-2' :
                          trader.rank === 3 ? 'rank-3' : 'rank-other'
                        }`}>
                          {trader.rank}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div className="avatar-circle">
                            {trader.initials}
                          </div>
                          <span style={{ fontWeight: 500 }}>{trader.name}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                        ${trader.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--success)' }}>
                        +{trader.profit.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
