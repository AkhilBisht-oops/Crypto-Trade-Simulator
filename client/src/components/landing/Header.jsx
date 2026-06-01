import { useState, useEffect } from 'react'
import { Sun, Moon, Coins } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

export default function Header() {
  const { isAuthenticated } = useAuthStore()
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      transition: 'background-color var(--transition-fast), border-color var(--transition-fast)'
    }} className="transition-colors">
      <style>{`
        /* Overriding header bg in dark mode dynamically */
        [data-theme="dark"] header {
          background-color: rgba(9, 9, 11, 0.8) !important;
        }
        
        .nav-link {
          font-size: 0.875rem;
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 500;
          transition: color var(--transition-fast);
        }
        
        .nav-link:hover {
          color: var(--text-primary);
        }
        
        .header-content {
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .nav-group {
          display: flex;
          align-items: center;
          gap: var(--space-6);
        }
        
        .right-group {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }
        
        @media (max-width: 640px) {
          .nav-group {
            display: none;
          }
        }
      `}</style>
      <div className="container header-content">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 600, letterSpacing: '-0.02em', fontSize: '1.125rem' }}>
          <Coins size={20} className="text-accent" style={{ color: 'var(--accent)' }} />
          <span>CryptoSim</span>
        </Link>
        
        <nav className="nav-group">
          <a href="#tickers" className="nav-link">Live Markets</a>
          <a href="#engine" className="nav-link">Trading Engine</a>
          <a href="#leaderboard" className="nav-link">Leaderboard</a>
          <a href="#setup" className="nav-link">Developer Stack</a>
        </nav>
        
        <div className="right-group">
          <button 
            onClick={toggleTheme} 
            className="theme-btn" 
            aria-label="Toggle visual theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          
          {isAuthenticated ? (
            <Link 
              to="/dashboard" 
              className="btn btn-primary"
              style={{ padding: '6px 14px', fontSize: '0.8125rem' }}
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link 
              to="/login" 
              className="btn btn-primary"
              style={{ padding: '6px 14px', fontSize: '0.8125rem' }}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

