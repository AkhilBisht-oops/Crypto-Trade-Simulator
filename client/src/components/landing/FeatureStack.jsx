import { useState } from 'react'
import { Terminal, Copy, Check, Server, Database, Layers, Cpu } from 'lucide-react'

export default function FeatureStack() {
  const [copied, setCopied] = useState(false)
  const commandText = 'git clone https://github.com/user/crypto-simulator.git\ncd crypto-simulator\ndocker-compose up --build'

  const handleCopy = () => {
    navigator.clipboard.writeText(commandText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="setup" className="bg-sub">
      <style>{`
        .stack-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-4);
        }
        
        .stack-card {
          padding: var(--space-4);
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          display: flex;
          gap: var(--space-3);
          align-items: flex-start;
        }
        
        .stack-icon {
          color: var(--accent);
          flex-shrink: 0;
          margin-top: 2px;
        }
        
        .stack-card h4 {
          font-size: 0.875rem;
          margin-bottom: 4px;
        }
        
        .stack-card p {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-bottom: 0;
          line-height: 1.5;
        }
        
        @media (max-width: 640px) {
          .stack-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      
      <div className="container grid-2">
        <div>
          <span className="badge">Technical Stack</span>
          <h2>Built for Developers</h2>
          <p className="lead" style={{ marginBottom: 'var(--space-6)' }}>
            Dive into a fully-configured microservices setup. The application includes a containerized PostgreSQL database, Redis store, real-time backend API, and a React frontend client.
          </p>
          
          <div className="stack-grid">
            <div className="stack-card">
              <Server className="stack-icon" size={18} />
              <div>
                <h4>Express Backend</h4>
                <p>Node.js server handles WebSocket subscriptions, user authentication, and trade operations.</p>
              </div>
            </div>
            
            <div className="stack-card">
              <Database className="stack-icon" size={18} />
              <div>
                <h4>Prisma & Postgres</h4>
                <p>Type-safe schema modeling, database migrations, and structured relations for all holdings.</p>
              </div>
            </div>
            
            <div className="stack-card">
              <Cpu className="stack-icon" size={18} />
              <div>
                <h4>Redis Caching</h4>
                <p>Reduces database pressure by caching tickers, leaders, and tracking temporary watchlist states.</p>
              </div>
            </div>
            
            <div className="stack-card">
              <Layers className="stack-icon" size={18} />
              <div>
                <h4>React Client</h4>
                <p>Responsive interface leveraging Zustand for state management and Socket.IO for feed connections.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="terminal-window">
            <div className="terminal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Terminal size={14} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontWeight: 500 }}>Setup Command</span>
              </div>
              <button 
                onClick={handleCopy} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: copied ? 'var(--success)' : 'var(--text-muted)', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.6875rem',
                  fontWeight: 500
                }}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="terminal-body">
              <div style={{ color: 'var(--text-muted)' }}># Clone and spin up the local environment</div>
              <div><span style={{ color: 'var(--accent)' }}>$</span> git clone https://github.com/user/crypto-sim.git</div>
              <div><span style={{ color: 'var(--accent)' }}>$</span> cd crypto-sim</div>
              <div><span style={{ color: 'var(--accent)' }}>$</span> docker-compose up --build</div>
              <div style={{ marginTop: '12px', color: 'var(--text-muted)' }}># Once ready, access at:</div>
              <div style={{ color: 'var(--success)' }}># Frontend client: http://localhost:5173</div>
              <div style={{ color: 'var(--success)' }}># Backend API: http://localhost:4000</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
