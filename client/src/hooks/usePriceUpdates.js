import { useEffect, useRef } from 'react';
import { socketService } from '../services/socket';
import { usePriceStore } from '../stores/priceStore';
import api from '../services/api';

export function usePriceUpdates() {
  const updatePrices = usePriceStore((s) => s.updatePrices);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // Immediately fetch prices from REST API for fast initial load
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      api.get('/prices')
        .then(({ data }) => {
          if (data.success && data.data && Object.keys(data.data).length > 0) {
            updatePrices(data.data);
          }
        })
        .catch(() => {
          // REST fetch failed silently, WebSocket will handle it
        });
    }

    // Subscribe to real-time WebSocket updates
    const unsubscribe = socketService.onPriceUpdate((prices) => {
      updatePrices(prices);
    });
    return unsubscribe;
  }, [updatePrices]);
}
