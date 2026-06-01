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
      toast.success(message, {
        icon: type === 'BUY' ? '✓' : '✓',
        style: {
          background: '#1a1d2e',
          color: '#e2e8f0',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
      });
      setQuantity('');
      fetchPortfolio();
      const newBalance = type === 'BUY' ? (user?.balance || 0) - total : (user?.balance || 0) + total;
      updateBalance(newBalance);
    } catch (error) {
      toast.error(error.message, {
        style: { 
          background: '#1a1d2e', 
          color: '#e2e8f0', 
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
      });
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
          <h2 className="text-sm font-semibold text-textPrimary">Trade {selectedSymbol.replace('USDT', '')}</h2>
          <p className="text-xs text-textMuted font-mono font-medium">{formatCryptoPrice(price)}</p>
        </div>
      </div>

      {/* Buy/Sell Toggle */}
      <div className="relative flex p-1 bg-bgSub rounded-lg border border-borderAccent mb-6">
        <button
          onClick={() => setType('BUY')}
          className={`flex-1 py-2.5 rounded-md font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 z-10 ${
            type === 'BUY'
              ? 'bg-successColor text-white shadow-sm'
              : 'text-textSecondary hover:text-textPrimary'
          }`}
        >
          <HiArrowUp className="w-3.5 h-3.5" /> Buy
        </button>
        <button
          onClick={() => setType('SELL')}
          className={`flex-1 py-2.5 rounded-md font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 z-10 ${
            type === 'SELL'
              ? 'bg-dangerColor text-white shadow-sm'
              : 'text-textSecondary hover:text-textPrimary'
          }`}
        >
          <HiArrowDown className="w-3.5 h-3.5" /> Sell
        </button>
      </div>

      {/* Quantity Input */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-textSecondary mb-2">Quantity</label>
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
            className="flex-1 py-1.5 text-xs font-mono font-medium text-textSecondary bg-bgSub border border-borderAccent rounded-lg hover:border-borderAccentHover hover:text-textPrimary hover:bg-bgCard transition-all"
          >
            {amt}
          </button>
        ))}
      </div>

      {/* Order Summary */}
      <div className="space-y-3 mb-6 p-4 bg-bgSub/40 rounded-lg border border-borderAccent">
        <div className="flex justify-between text-xs">
          <span className="text-textMuted">Price</span>
          <span className="font-mono text-textSecondary font-medium">{formatCryptoPrice(price)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-textMuted">Quantity</span>
          <span className="font-mono text-textSecondary font-medium">{parseFloat(quantity) || 0}</span>
        </div>
        <div className="border-t border-borderAccent/60 pt-3 flex justify-between">
          <span className="text-textPrimary text-xs font-semibold">Total</span>
          <span className={`font-mono font-bold text-sm ${type === 'BUY' ? 'text-successColor' : 'text-dangerColor'}`}>
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* Available Balance */}
      <div className="text-xs text-textMuted mb-4 text-center px-3 py-1.5 rounded-lg border border-borderAccent bg-bgSub/30">
        Available: <span className="font-mono text-textPrimary font-semibold">{formatCurrency(user?.balance || 0)}</span>
      </div>

      {/* Execute Button */}
      <button
        onClick={handleTrade}
        disabled={isLoading || !quantity || parseFloat(quantity) <= 0}
        className={`w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed ${
          type === 'BUY'
            ? 'bg-successColor text-white hover:bg-successColor/90 shadow-sm'
            : 'bg-dangerColor text-white hover:bg-dangerColor/90 shadow-sm'
        }`}
      >
        {isLoading ? 'Processing...' : `${type === 'BUY' ? 'Buy' : 'Sell'} ${selectedSymbol.replace('USDT', '')}`}
      </button>
    </div>
  );
}
