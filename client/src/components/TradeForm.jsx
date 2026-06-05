import { useState } from 'react';
import { usePriceStore } from '../stores/priceStore';
import { usePortfolioStore } from '../stores/portfolioStore';
import { useAuthStore } from '../stores/authStore';
import { SYMBOL_INFO } from '../types';
import { formatCryptoPrice, formatCurrency } from '../utils/format';
import toast from 'react-hot-toast';
import { HiArrowUp, HiArrowDown } from 'react-icons/hi';

export default function TradeForm({ selectedSymbol }) {
  const [type, setType] = useState('BUY');
  const [quantity, setQuantity] = useState('');
  const priceData = usePriceStore((s) => s.prices[selectedSymbol]);
  const { executeTrade, isLoading, fetchPortfolio } = usePortfolioStore();
  const { updateBalance, user } = useAuthStore();
  const info = SYMBOL_INFO[selectedSymbol];

  const price = priceData?.price || 0;
  const total = price * (parseFloat(quantity) || 0);

  const handleTrade = async () => {
    const qty = parseFloat(quantity);
    if (!qty || qty <= 0) {
      toast.error('Enter a valid quantity');
      return;
    }

    try {
      const message = await executeTrade(selectedSymbol, type, qty);
      toast.success(message);
      setQuantity('');
      fetchPortfolio();
      const newBalance = type === 'BUY' ? (user?.balance || 0) - total : (user?.balance || 0) + total;
      updateBalance(newBalance);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const quickAmounts = [0.01, 0.1, 0.5, 1];

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
          style={{ backgroundColor: `${info?.color}10`, color: info?.color }}
        >
          {info?.icon}
        </div>
        <div>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Trade {selectedSymbol.replace('USDT', '')}
          </h2>
          <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            {formatCryptoPrice(price)}
          </p>
        </div>
      </div>

      {/* Buy/Sell Toggle */}
      <div
        className="relative flex p-1 rounded-lg mb-6"
        style={{
          backgroundColor: 'var(--bg-sub)',
          border: '1px solid var(--border)',
        }}
      >
        <button
          onClick={() => setType('BUY')}
          className="flex-1 py-2.5 rounded-md font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 z-10"
          style={{
            backgroundColor: type === 'BUY' ? 'var(--success)' : 'transparent',
            color: type === 'BUY' ? '#ffffff' : 'var(--text-muted)',
          }}
        >
          <HiArrowUp className="w-3.5 h-3.5" /> Buy
        </button>
        <button
          onClick={() => setType('SELL')}
          className="flex-1 py-2.5 rounded-md font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 z-10"
          style={{
            backgroundColor: type === 'SELL' ? 'var(--danger)' : 'transparent',
            color: type === 'SELL' ? '#ffffff' : 'var(--text-muted)',
          }}
        >
          <HiArrowDown className="w-3.5 h-3.5" /> Sell
        </button>
      </div>

      {/* Quantity Input */}
      <div className="mb-4">
        <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
          Quantity
        </label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="0.00"
          className="input-field"
          step="0.001"
          min="0"
        />
      </div>

      {/* Quick Amount Buttons */}
      <div className="flex gap-2 mb-6">
        {quickAmounts.map((amt) => (
          <button
            key={amt}
            onClick={() => setQuantity(amt.toString())}
            className="flex-1 py-1.5 text-xs font-mono rounded-lg transition-all"
            style={{
              backgroundColor: 'var(--bg-sub)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-hover)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            {amt}
          </button>
        ))}
      </div>

      {/* Order Summary */}
      <div
        className="space-y-3 mb-6 p-4 rounded-lg"
        style={{
          backgroundColor: 'var(--bg-sub)',
          border: '1px solid var(--border)',
        }}
      >
        <div className="flex justify-between text-xs">
          <span style={{ color: 'var(--text-muted)' }}>Price</span>
          <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{formatCryptoPrice(price)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span style={{ color: 'var(--text-muted)' }}>Quantity</span>
          <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{parseFloat(quantity) || 0}</span>
        </div>
        <div className="pt-3 flex justify-between" style={{ borderTop: '1px solid var(--border)' }}>
          <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Total</span>
          <span
            className="font-mono font-semibold text-sm"
            style={{ color: type === 'BUY' ? 'var(--success)' : 'var(--danger)' }}
          >
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* Available Balance */}
      <div
        className="text-xs mb-4 text-center px-3 py-1.5 rounded-lg"
        style={{
          backgroundColor: 'var(--bg-sub)',
          border: '1px solid var(--border)',
          color: 'var(--text-muted)',
        }}
      >
        Available: <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{formatCurrency(user?.balance || 0)}</span>
      </div>

      {/* Execute Button */}
      <button
        onClick={handleTrade}
        disabled={isLoading || !quantity || parseFloat(quantity) <= 0}
        className="w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          backgroundColor: type === 'BUY' ? 'var(--success)' : 'var(--danger)',
          color: '#ffffff',
        }}
      >
        {isLoading ? 'Processing...' : `${type === 'BUY' ? 'Buy' : 'Sell'} ${selectedSymbol.replace('USDT', '')}`}
      </button>
    </div>
  );
}
