import { useState, useEffect } from 'react';
import { usePortfolioStore } from '../stores/portfolioStore';
import { SYMBOL_INFO } from '../types';
import { formatCurrency, formatCryptoPrice, timeAgo } from '../utils/format';
import { HiChevronLeft, HiChevronRight, HiFilter } from 'react-icons/hi';

export default function TradeHistory() {
  const { trades, tradesPagination, fetchTrades } = usePortfolioStore();
  const [page, setPage] = useState(1);
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    fetchTrades(page, selectedSymbol || undefined, selectedType || undefined);
  }, [fetchTrades, page, selectedSymbol, selectedType]);

  const handlePrevPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const handleNextPage = () => {
    if (tradesPagination && page < tradesPagination.totalPages) {
      setPage((p) => p + 1);
    }
  };

  const symbols = Object.keys(SYMBOL_INFO);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Trade History</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>View and filter all your completed trades</p>
      </div>

      {/* Filters Bar */}
      <div className="glass-card p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
          <HiFilter className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          <span className="text-xs font-medium">Filter Trades</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Symbol Selector */}
          <select
            value={selectedSymbol}
            onChange={(e) => {
              setSelectedSymbol(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-lg text-xs font-mono transition-all"
            style={{
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              outline: 'none'
            }}
          >
            <option value="">All Coins</option>
            {symbols.map((sym) => (
              <option key={sym} value={sym}>
                {sym.replace('USDT', '')}
              </option>
            ))}
          </select>

          {/* Type Selector */}
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-lg text-xs font-mono transition-all"
            style={{
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              outline: 'none'
            }}
          >
            <option value="">All Types</option>
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
        </div>
      </div>

      {/* Trades Table */}
      <div className="glass-card">
        {trades.length === 0 ? (
          <div className="p-12 text-center" style={{ color: 'var(--text-muted)' }}>
            <div className="text-3xl mb-3">📁</div>
            <p className="text-sm">No trades found matching your filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                    <th className="p-4 font-medium">Time</th>
                    <th className="p-4 font-medium">Asset</th>
                    <th className="p-4 font-medium">Type</th>
                    <th className="p-4 font-medium">Quantity</th>
                    <th className="p-4 font-medium">Execution Price</th>
                    <th className="p-4 font-medium">Total Value</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((trade) => {
                    const info = SYMBOL_INFO[trade.symbol];
                    const isBuy = trade.type === 'BUY';
                    return (
                      <tr
                        key={trade.id}
                        className="transition-colors"
                        style={{ borderBottom: '1px solid var(--border)' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-sub)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <td className="p-4 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{timeAgo(trade.createdAt)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2.5">
                            <span style={{ color: info?.color }} className="text-base">{info?.icon}</span>
                            <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{trade.symbol.replace('USDT', '')}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className="text-xs font-mono px-2 py-0.5 rounded"
                            style={{
                              backgroundColor: isBuy ? 'var(--success-light)' : 'var(--danger-light)',
                              color: isBuy ? 'var(--success)' : 'var(--danger)'
                            }}
                          >
                            {trade.type}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>{trade.quantity}</td>
                        <td className="p-4 font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>{formatCryptoPrice(trade.price)}</td>
                        <td className="p-4 font-mono text-sm" style={{ color: 'var(--text-primary)' }}>{formatCurrency(trade.total)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination controls */}
            {tradesPagination && tradesPagination.totalPages > 1 && (
              <div className="p-4 flex items-center justify-between text-xs" style={{ borderTop: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)' }}>
                  Page <span style={{ color: 'var(--text-secondary)' }}>{page}</span> of{' '}
                  <span style={{ color: 'var(--text-secondary)' }}>{tradesPagination.totalPages}</span> ({tradesPagination.totalCount} total)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={page === 1}
                    className="p-2 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-all duration-200"
                    style={{
                      backgroundColor: 'var(--bg-sub)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    <HiChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={page === tradesPagination.totalPages}
                    className="p-2 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-all duration-200"
                    style={{
                      backgroundColor: 'var(--bg-sub)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    <HiChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
