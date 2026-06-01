import { create } from 'zustand';

export const usePriceStore = create((set, get) => ({
  prices: {},
  priceHistory: {},

  updatePrices: (update) => {
    set((state) => {
      const newPrices = { ...state.prices };
      const newHistory = { ...state.priceHistory };

      Object.entries(update).forEach(([symbol, data]) => {
        newPrices[symbol] = data;
        const history = newHistory[symbol] || [];
        history.push(data.price);
        if (history.length > 60) history.shift();
        newHistory[symbol] = [...history];
      });

      return { prices: newPrices, priceHistory: newHistory };
    });
  },

  getPrice: (symbol) => {
    return get().prices[symbol]?.price || 0;
  },

  getPriceData: (symbol) => {
    return get().prices[symbol] || null;
  },
}));
