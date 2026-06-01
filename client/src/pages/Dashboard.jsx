import { useState, useEffect } from 'react';
import { usePortfolioStore } from '../stores/portfolioStore';
import { usePriceUpdates } from '../hooks/usePriceUpdates';
import TradingCard from '../components/TradingCard';
import PriceChart from '../components/PriceChart';
import TradeForm from '../components/TradeForm';
import { SYMBOL_INFO } from '../types';
import { HiStar, HiOutlineStar } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const { watchlist, fetchWatchlist, addToWatchlist, removeFromWatchlist } = usePortfolioStore();

  usePriceUpdates();

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const isWatchlisted = watchlist.some((w) => w.symbol === selectedSymbol);

  const toggleWatchlist = async () => {
    try {
      if (isWatchlisted) {
        await removeFromWatchlist(selectedSymbol);
        toast.success(`Removed ${selectedSymbol.replace('USDT', '')} from watchlist`);
      } else {
        await addToWatchlist(selectedSymbol);
        toast.success(`Added ${selectedSymbol.replace('USDT', '')} to watchlist`);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const symbols = Object.keys(SYMBOL_INFO);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Market Dashboard</h1>
          <p className="text-dark-400 text-sm mt-1">Trade real-time crypto assets with zero risk</p>
        </div>
        <button
          onClick={toggleWatchlist}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 text-sm ${
            isWatchlisted
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              : 'bg-dark-900/40 text-dark-400 border-white/5 hover:border-white/10 hover:text-dark-200'
          }`}
        >
          {isWatchlisted ? <HiStar className="w-4 h-4" /> : <HiOutlineStar className="w-4 h-4" />}
          {isWatchlisted ? 'Watchlisted' : 'Add to Watchlist'}
        </button>
      </div>

      {/* Grid of tickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {symbols.map((symbol) => (
          <TradingCard
            key={symbol}
            symbol={symbol}
            onSelect={setSelectedSymbol}
            isSelected={selectedSymbol === symbol}
          />
        ))}
      </div>

      {/* Main trading workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PriceChart symbol={selectedSymbol} />
          {/* Info Panel */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white">Simulator Rules</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-dark-400">
              <div className="p-4 bg-dark-950/40 rounded-lg border border-white/5">
                <span className="text-indigo-400 font-medium block mb-1">Live Pricing</span>
                Real-time WebSocket connection to Binance ensures live market data accuracy.
              </div>
              <div className="p-4 bg-dark-950/40 rounded-lg border border-white/5">
                <span className="text-emerald-400 font-medium block mb-1">$10K Start</span>
                Every new user gets a virtual $10,000 USD to practice trading strategies.
              </div>
              <div className="p-4 bg-dark-950/40 rounded-lg border border-white/5">
                <span className="text-amber-400 font-medium block mb-1">Rankings</span>
                Grow your portfolio to climb the global leaderboard and rank #1.
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <TradeForm selectedSymbol={selectedSymbol} />
        </div>
      </div>
    </div>
  );
}
