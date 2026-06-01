import { useEffect } from 'react';
import { socketService } from '../services/socket';
import { usePriceStore } from '../stores/priceStore';

export function usePriceUpdates() {
  const updatePrices = usePriceStore((s) => s.updatePrices);

  useEffect(() => {
    const unsubscribe = socketService.onPriceUpdate((prices) => {
      updatePrices(prices);
    });
    return unsubscribe;
  }, [updatePrices]);
}
