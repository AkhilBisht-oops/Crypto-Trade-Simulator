import { Coins } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-sub)',
      borderTop: '1px solid var(--border)',
      padding: 'var(--space-12) 0 var(--space-8) 0',
      transition: 'background-color var(--transition-fast), border-color var(--transition-fast)'
    }}>
      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
          gap: var(--space-8);
          margin-bottom: var(--space-12);
        }
        
        .footer-col h4 {
          font-size: 0.8125rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-primary);
          margin-bottom: var(--space-4);
          font-weight: 600;
        }
        
        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .footer-links li {
          margin-bottom: var(--space-2);
        }
        
        .footer-links a {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          text-decoration: none;
          transition: color var(--transition-fast);
        }
        
        .footer-links a:hover {
          color: var(--text-primary);
        }
        
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: var(--space-6);
          border-top: 1px solid var(--border);
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: var(--space-6);
          }
          
          .footer-bottom {
            flex-direction: column;
            gap: var(--space-3);
            text-align: center;
          }
        }
        
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1rem', marginBottom: 'var(--space-3)' }}>
              <Coins size={18} className="text-accent" style={{ color: 'var(--accent)' }} />
              <span>CryptoSim</span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', maxWidth: '240px', lineHeight: 1.6 }}>
              A real-time paper trading platform built with Node.js, React, WebSockets, and Prisma ORM.
            </p>
          </div>
          
          <div className="footer-col">
            <h4>Product</h4>
            <ul className="footer-links">
              <li><a href="#tickers">Live Markets</a></li>
              <li><a href="#engine">Trading Engine</a></li>
              <li><a href="#leaderboard">Leaderboard</a></li>
              <li><a href="#setup">Developer Stack</a></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h4>Resources</h4>
            <ul className="footer-links">
              <li><a href="https://github.com/vitejs/vite" target="_blank" rel="noreferrer">Vite Documentation</a></li>
              <li><a href="https://react.dev/" target="_blank" rel="noreferrer">React Guide</a></li>
              <li><a href="https://www.prisma.io/" target="_blank" rel="noreferrer">Prisma ORM</a></li>
              <li><a href="https://developers.binance.com/" target="_blank" rel="noreferrer">Binance API</a></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h4>Disclaimer</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 0 }}>
              All trading operations executed on this server are strictly simulated. No actual financial transactions or currencies are handled.
            </p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} CryptoSim. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
