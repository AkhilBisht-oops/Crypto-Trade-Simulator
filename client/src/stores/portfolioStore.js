import { create } from 'zustand';
import api from '../services/api';

export const usePortfolioStore = create((set) => ({
  portfolio: null,
  trades: [],
  watchlist: [],
  leaderboard: [],
  tradesPagination: null,
  isLoading: false,

  fetchPortfolio: async () => {
    try {
      const { data } = await api.get('/portfolio');
      if (data.success) {
        set({ portfolio: data.data });
      }
    } catch (error) {
      console.error('Failed to fetch portfolio:', error);
    }
  },

  fetchTrades: async (page = 1, symbol, type) => {
    try {
      const params = { page, limit: 20 };
      if (symbol) params.symbol = symbol;
      if (type) params.type = type;
      const { data } = await api.get('/trades/history', { params });
      if (data.success) {
        set({
          trades: data.data.trades,
          tradesPagination: data.data.pagination,
        });
      }
    } catch (error) {
      console.error('Failed to fetch trades:', error);
    }
  },

  fetchWatchlist: async () => {
    try {
      const { data } = await api.get('/watchlist');
      if (data.success) {
        set({ watchlist: data.data });
      }
    } catch (error) {
      console.error('Failed to fetch watchlist:', error);
    }
  },

  fetchLeaderboard: async () => {
    try {
      const { data } = await api.get('/portfolio/leaderboard');
      if (data.success) {
        set({ leaderboard: data.data });
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    }
  },

  addToWatchlist: async (symbol) => {
    try {
      const { data } = await api.post('/watchlist', { symbol });
      if (data.success) {
        set((state) => ({
          watchlist: [...state.watchlist, data.data],
        }));
      }
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to add to watchlist');
    }
  },

  removeFromWatchlist: async (symbol) => {
    try {
      await api.delete(`/watchlist/${symbol}`);
      set((state) => ({
        watchlist: state.watchlist.filter((w) => w.symbol !== symbol),
      }));
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to remove from watchlist');
    }
  },

  executeTrade: async (symbol, type, quantity) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/trades', { symbol, type, quantity });
      set({ isLoading: false });
      if (data.success) {
        return data.data.message;
      }
      throw new Error('Trade failed');
    } catch (error) {
      set({ isLoading: false });
      throw new Error(error.response?.data?.error || 'Trade execution failed');
    }
  },
}));
