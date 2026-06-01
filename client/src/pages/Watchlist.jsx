import { useEffect } from 'react';
import { usePortfolioStore } from '../stores/portfolioStore';
import { usePriceStore } from '../stores/priceStore';
import { SYMBOL_INFO } from '../types';
import { formatCryptoPrice, formatPercentage } from '../utils/format';
import { HiStar, HiArrowRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Watchlist() {
  const { watchlist, fetchWatchlist, removeFromWatchlist } = usePortfolioStore();
  const prices = usePriceStore((s) => s.prices);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const handleRemove = async (symbol) => {
    try {
      await removeFromWatchlist(symbol);
      toast.success(`Removed ${symbol.replace('USDT', '')} from watchlist`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-white">Watchlist</h1>
        <p className="text-dark-400 text-sm mt-1">Keep an eye on assets you watch the most</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {watchlist.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3 glass-card p-12 text-center">
            <div className="text-3xl mb-4">⭐</div>
            <p className="text-sm mb-4 text-dark-300">Your watchlist is currently empty</p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 btn-primary text-sm"
            >
              Explore Markets <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          watchlist.map((item) => {
            const priceData = prices[item.symbol];
            const info = SYMBOL_INFO[item.symbol];
            const isUp = (priceData?.change24h || 0) >= 0;

            return (
              <div key={item.id} className="glass-card-hover p-5 flex flex-col justify-between relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <span style={{ color: info?.color }} className="text-xl">
                      {info?.icon}
                    </span>
                    <div>
                      <h3 className="font-medium text-white text-sm">{item.symbol.replace('USDT', '')}</h3>
                      <p className="text-xs text-dark-400">{info?.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(item.symbol)}
                    className="p-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg hover:bg-amber-500/20 transition-all"
                    title="Remove from Watchlist"
                  >
                    <HiStar className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex justify-between items-baseline mt-4 border-t border-white/5 pt-4">
                  <span className="text-xs text-dark-400">Live Price</span>
                  <span className="font-mono font-semibold text-xl text-white">
                    {priceData ? formatCryptoPrice(priceData.price) : '...'}
                  </span>
                </div>

                {priceData && (
                  <div className="flex justify-between items-center mt-3 text-xs font-mono">
                    <span className="text-dark-400">24h Change</span>
                    <span className={`${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isUp ? '+' : ''}{formatPercentage(priceData.change24h)}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
