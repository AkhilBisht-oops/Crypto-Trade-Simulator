import { useState, useEffect } from 'react'
import { Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react'

const INITIAL_COINS = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC/USDT', price: 94250.00, change: 3.42, flash: null },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH/USDT', price: 2980.50, change: -1.15, flash: null },
  { id: 'sol', name: 'Solana', symbol: 'SOL/USDT', price: 165.20, change: 8.75, flash: null },
  { id: 'bnb', name: 'Binance Coin', symbol: 'BNB/USDT', price: 592.80, change: 0.22, flash: null }
]

export default function FeatureWebSocket() {
  const [coins, setCoins] = useState(INITIAL_COINS)

  useEffect(() => {
    const timer = setInterval(() => {
      setCoins(prevCoins => {
        // Pick a random coin to update
        const randomIndex = Math.floor(Math.random() * prevCoins.length)
        return prevCoins.map((coin, index) => {
          if (index !== randomIndex) {
            // Clear previous flash states for other coins
            return { ...coin, flash: null }
          }
          
          const changePercent = (Math.random() * 0.15 + 0.01) * (Math.random() > 0.45 ? 1 : -1)
          const newPrice = Number((coin.price * (1 + changePercent / 100)).toFixed(2))
          const newChange = Number((coin.change + changePercent).toFixed(2))
          const flashState = changePercent > 0 ? 'up' : 'down'
          
          return {
            ...coin,
            price: newPrice,
            change: newChange,
            flash: flashState
          }
        })
      })
    }, 2500)

    return () => clearInterval(timer)
  }, [])

  return (
    <section id="tickers" className="bg-main">
      <div className="container grid-2">
        <div>
          <span className="badge">WebSocket Engine</span>
          <h2>Direct Binance Feed</h2>
          <p className="lead">
            Experience latency-free market movements. Our backend maintains a persistent TCP websocket connection directly to Binance API, broadcasting ticker rates to active users instantly.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>&lt; 100ms</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Update Latency</div>
            </div>
            <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: 'var(--space-4)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>100%</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Simulated Execution</div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-4) var(--space-4)', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-sub)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={16} className="text-accent" style={{ color: 'var(--accent)' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Live Rates Ticker</span>
              </div>
              <span style={{ fontSize: '0.6875rem', color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--success)', borderRadius: '50%' }}></span> Connected
              </span>
            </div>
            
            <div>
              {coins.map((coin) => {
                let flashClass = '';
                if (coin.flash === 'up') flashClass = 'flash-up';
                if (coin.flash === 'down') flashClass = 'flash-down';
                
                return (
                  <div key={coin.id} className={`ticker-row ${flashClass}`}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{coin.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{coin.symbol}</span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                      <span style={{ 
                        fontSize: '0.9375rem', 
                        fontFamily: 'var(--font-mono)', 
                        fontWeight: 500,
                        color: coin.flash === 'up' ? 'var(--success)' : coin.flash === 'down' ? 'var(--danger)' : 'var(--text-primary)',
                        transition: 'color 0.1s ease'
                      }}>
                        ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: 600,
                        display: 'inline-flex', 
                        alignItems: 'center',
                        gap: '2px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: coin.change >= 0 ? 'var(--success-light)' : 'var(--danger-light)',
                        color: coin.change >= 0 ? 'var(--success)' : 'var(--danger)',
                        width: '74px',
                        justifyContent: 'center'
                      }}>
                        {coin.change >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {Math.abs(coin.change).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
