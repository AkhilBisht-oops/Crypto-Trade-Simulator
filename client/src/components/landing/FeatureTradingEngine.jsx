import { useState } from 'react'
import { ShieldCheck, Database, RefreshCw, HelpCircle } from 'lucide-react'

export default function FeatureTradingEngine() {
  const [activeTab, setActiveTab] = useState('buy')
  const [btcAmount, setBtcAmount] = useState('0.05')
  const [cashBalance, setCashBalance] = useState(10245.50)
  const [btcHoldings, setBtcHoldings] = useState(0.05)
  const [avgBuyPrice, setAvgBuyPrice] = useState(94200.00)
  const [feedback, setFeedback] = useState(null)
  
  const btcPrice = 94200.00
  const totalCost = Number(btcAmount) * btcPrice || 0

  const handleExecute = (e) => {
    e.preventDefault()
    const amount = Number(btcAmount)
    if (isNaN(amount) || amount <= 0) {
      setFeedback({ type: 'error', message: 'Please enter a valid amount.' })
      return
    }

    if (activeTab === 'buy') {
      if (totalCost > cashBalance) {
        setFeedback({ type: 'error', message: 'Insufficient cash balance.' })
        return
      }
      const newCash = cashBalance - totalCost
      const newHoldings = btcHoldings + amount
      // Weighted average calculation
      const newAvgPrice = ((btcHoldings * avgBuyPrice) + (amount * btcPrice)) / newHoldings
      
      setCashBalance(newCash)
      setBtcHoldings(newHoldings)
      setAvgBuyPrice(newAvgPrice)
      setFeedback({
        type: 'success',
        message: `Order Executed: Bought ${amount} BTC at $${btcPrice.toLocaleString()} (Total: $${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })})`
      })
    } else {
      if (amount > btcHoldings) {
        setFeedback({ type: 'error', message: 'Insufficient BTC holdings.' })
        return
      }
      const newCash = cashBalance + totalCost
      const newHoldings = btcHoldings - amount
      
      setCashBalance(newCash)
      setBtcHoldings(newHoldings)
      if (newHoldings === 0) setAvgBuyPrice(0)
      
      setFeedback({
        type: 'success',
        message: `Order Executed: Sold ${amount} BTC at $${btcPrice.toLocaleString()} (Total: $${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })})`
      })
    }

    // Clear feedback toast after 5s
    setTimeout(() => {
      setFeedback(null)
    }, 5000)
  }

  return (
    <section id="engine" className="bg-sub">
      <style>{`
        .engine-features {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          margin-top: var(--space-6);
        }
        
        .engine-feat-card {
          display: flex;
          gap: var(--space-3);
        }
        
        .tab-btn {
          flex: 1;
          background: none;
          border: none;
          padding: var(--space-2) 0;
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }
        
        .tab-btn.active-buy {
          border-bottom-color: var(--success);
          color: var(--success);
        }
        
        .tab-btn.active-sell {
          border-bottom-color: var(--danger);
          color: var(--danger);
        }
      `}</style>
      
      <div className="container grid-2">
        <div className="order-mobile-2">
          <div className="card" style={{ maxWidth: '420px', margin: '0 auto' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 'var(--space-4)' }}>
              <button 
                className={`tab-btn ${activeTab === 'buy' ? 'active-buy' : ''}`}
                onClick={() => { setActiveTab('buy'); setFeedback(null); }}
              >
                BUY BTC
              </button>
              <button 
                className={`tab-btn ${activeTab === 'sell' ? 'active-sell' : ''}`}
                onClick={() => { setActiveTab('sell'); setFeedback(null); }}
              >
                SELL BTC
              </button>
            </div>
            
            <form onSubmit={handleExecute}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 'var(--space-2)' }}>
                <span>Available Cash</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  ${cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 'var(--space-4)' }}>
                <span>BTC Holdings</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {btcHoldings.toFixed(4)} BTC {avgBuyPrice > 0 && <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(avg ${Math.round(avgBuyPrice).toLocaleString()})</span>}
                </span>
              </div>
              
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, marginBottom: '6px' }}>Amount (BTC)</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="number" 
                    step="0.001"
                    min="0.0001"
                    value={btcAmount} 
                    onChange={(e) => setBtcAmount(e.target.value)}
                    className="form-input" 
                    style={{ paddingRight: '48px', fontFamily: 'var(--font-mono)' }}
                  />
                  <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>BTC</span>
                </div>
              </div>
              
              <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-3)', backgroundColor: 'var(--bg-sub)', marginBottom: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem' }}>Estimated Cost</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              
              <button 
                type="submit" 
                className="btn" 
                style={{ 
                  width: '100%', 
                  backgroundColor: activeTab === 'buy' ? 'var(--success)' : 'var(--danger)',
                  color: '#ffffff'
                }}
              >
                {activeTab === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
              </button>
            </form>
            
            {feedback && (
              <div style={{ 
                marginTop: 'var(--space-3)', 
                padding: 'var(--space-2) var(--space-3)', 
                borderRadius: 'var(--radius-md)',
                fontSize: '0.75rem',
                border: '1px solid',
                backgroundColor: feedback.type === 'success' ? 'var(--success-light)' : 'var(--danger-light)',
                borderColor: feedback.type === 'success' ? 'var(--success)' : 'var(--danger)',
                color: feedback.type === 'success' ? 'var(--success)' : 'var(--danger)'
              }}>
                {feedback.message}
              </div>
            )}
          </div>
        </div>
        
        <div>
          <span className="badge">Atomic Execution</span>
          <h2>The Trading Engine</h2>
          <p className="lead">
            Trade with confidence. Our engine processes purchases and sales instantly using atomic database operations, preventing race conditions or currency imbalances.
          </p>
          
          <div className="engine-features">
            <div className="engine-feat-card">
              <ShieldCheck size={20} style={{ color: 'var(--success)', flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '0.9375rem', marginBottom: '4px' }}>Atomic Transactions</h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 0 }}>
                  Utilizes Prisma multi-model transactions. Balances and holdings are updated simultaneously or failed completely, maintaining database integrity.
                </p>
              </div>
            </div>
            
            <div className="engine-feat-card">
              <RefreshCw size={20} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '0.9375rem', marginBottom: '4px' }}>Average Cost Basis Calculations</h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 0 }}>
                  Auto-calculates weighted average entry price for holdings. Keep track of accurate Profit and Loss (P&L) margins against current live market rates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
