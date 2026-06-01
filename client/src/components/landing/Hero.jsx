import { ArrowRight, Star, TrendingUp, Shield, Activity } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

export default function Hero() {
  const { isAuthenticated } = useAuthStore()
  return (
    <section className="bg-sub" style={{ overflow: 'hidden', padding: 'var(--space-16) 0' }}>
      <style>{`
        .hero-layout {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: var(--space-12);
          align-items: center;
        }
        
        .hero-title {
          font-size: 3.5rem;
          line-height: 1.1;
          margin-bottom: var(--space-4);
          font-weight: 700;
          color: var(--text-primary);
        }
        
        .hero-desc {
          font-size: 1.125rem;
          color: var(--text-secondary);
          margin-bottom: var(--space-6);
          line-height: 1.6;
        }
        
        .hero-ctas {
          display: flex;
          gap: var(--space-3);
          margin-bottom: var(--space-8);
        }
        
        .hero-features-list {
          display: flex;
          gap: var(--space-6);
          border-top: 1px solid var(--border);
          padding-top: var(--space-6);
        }
        
        .hero-feature-item {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--text-secondary);
        }
        
        .hero-feature-icon {
          color: var(--accent);
        }
        
        /* Interactive CSS Mockup */
        .hero-mockup {
          perspective: 1000px;
        }
        
        .dashboard-frame {
          transform: rotateY(-8deg) rotateX(4deg);
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.12);
          transition: transform 0.5s ease, box-shadow 0.5s ease;
        }
        
        [data-theme="dark"] .dashboard-frame {
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.6);
        }
        
        .dashboard-frame:hover {
          transform: rotateY(-3deg) rotateX(2deg) translateY(-2px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.16);
        }
        
        .dashboard-chart-path {
          stroke-dasharray: 600;
          stroke-dashoffset: 600;
          animation: drawChart 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        @keyframes drawChart {
          to {
            stroke-dashoffset: 0;
          }
        }
        
        @media (max-width: 1024px) {
          .hero-layout {
            grid-template-columns: 1fr;
            gap: var(--space-8);
            text-align: center;
          }
          
          .hero-title {
            font-size: 2.75rem;
          }
          
          .hero-ctas {
            justify-content: center;
          }
          
          .hero-features-list {
            justify-content: center;
          }
          
          .dashboard-frame {
            transform: none !important;
          }
        }
      `}</style>
      
      <div className="container hero-layout">
        <div>
          <span className="badge badge-accent">
            <Star size={12} style={{ marginRight: '6px', fill: 'currentColor' }} /> Live Binance WebSockets
          </span>
          <h1 className="hero-title">
            Simulate crypto trading in real-time.
          </h1>
          <p className="hero-desc">
            Test your strategies, monitor market fluctuations, and climb the global leaderboards risk-free. Trade top digital assets with a $10,000 simulated cash balance.
          </p>
          
          <div className="hero-ctas">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary">
                Go to Dashboard <ArrowRight size={16} />
              </Link>
            ) : (
              <Link to="/login" className="btn btn-primary">
                Start Trading <ArrowRight size={16} />
              </Link>
            )}
            <a href="#leaderboard" className="btn btn-secondary">
              View Leaderboard
            </a>
          </div>
          
          <div className="hero-features-list">
            <div className="hero-feature-item">
              <Activity size={14} className="hero-feature-icon" />
              <span>Real-Time Quotes</span>
            </div>
            <div className="hero-feature-item">
              <Shield size={14} className="hero-feature-icon" />
              <span>Atomic Execution</span>
            </div>
            <div className="hero-feature-item">
              <TrendingUp size={14} className="hero-feature-icon" />
              <span>Performance Metrics</span>
            </div>
          </div>
        </div>
        
        <div className="hero-mockup">
          <div className="mockup-dashboard dashboard-frame">
            <div className="mockup-header">
              <div className="mockup-dots">
                <div className="mockup-dot red"></div>
                <div className="mockup-dot yellow"></div>
                <div className="mockup-dot green"></div>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>app.cryptosim.io/dashboard</span>
              <div style={{ width: '40px' }}></div>
            </div>
            <div className="mockup-body" style={{ padding: 'var(--space-4)' }}>
              {/* Account Balance */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Trading Account</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>$10,245.50</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>+$245.50 (2.45%)</span>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Daily Return</div>
                </div>
              </div>
              
              {/* Chart Mockup */}
              <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2)', marginBottom: 'var(--space-4)', position: 'relative' }}>
                <div style={{ display: 'flex', gap: '8px', fontSize: '0.6875rem', marginBottom: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>BTC/USDT</span>
                  <span style={{ color: 'var(--success)' }}>$94,200.00</span>
                </div>
                
                <svg viewBox="0 0 300 80" style={{ width: '100%', height: '80px', display: 'block' }}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Fill under chart */}
                  <path 
                    d="M 10 70 L 40 55 L 80 62 L 120 40 L 160 48 L 200 25 L 240 32 L 280 15 L 280 80 L 10 80 Z" 
                    fill="url(#chartGradient)"
                  />
                  
                  {/* Chart line */}
                  <path 
                    d="M 10 70 L 40 55 L 80 62 L 120 40 L 160 48 L 200 25 L 240 32 L 280 15" 
                    fill="none" 
                    stroke="var(--accent)" 
                    strokeWidth="1.5"
                    className="dashboard-chart-path"
                  />
                  
                  {/* Active dot */}
                  <circle cx="280" cy="15" r="3" fill="var(--accent)" />
                  <circle cx="280" cy="15" r="6" fill="var(--accent)" opacity="0.3" />
                </svg>
              </div>
              
              {/* Order Book / Holdings */}
              <div className="grid-2" style={{ gap: 'var(--space-3)' }}>
                <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2)' }}>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 600, borderBottom: '1px solid var(--border)', paddingBottom: '4px', marginBottom: '4px' }}>Assets</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.625rem', marginBottom: '2px' }}>
                    <span>BTC</span>
                    <span>0.05 ($4,710)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.625rem' }}>
                    <span>ETH</span>
                    <span>0.80 ($2,400)</span>
                  </div>
                </div>
                
                <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2)' }}>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 600, borderBottom: '1px solid var(--border)', paddingBottom: '4px', marginBottom: '4px' }}>Quick Trade</div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button style={{ flex: 1, padding: '4px 0', fontSize: '0.625rem', border: 'none', backgroundColor: 'var(--success)', color: 'white', borderRadius: '4px', fontWeight: 500 }}>BUY</button>
                    <button style={{ flex: 1, padding: '4px 0', fontSize: '0.625rem', border: 'none', backgroundColor: 'var(--danger)', color: 'white', borderRadius: '4px', fontWeight: 500 }}>SELL</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
