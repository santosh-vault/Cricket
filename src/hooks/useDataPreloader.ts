import { useEffect } from 'react';
import { preloadCriticalData } from '../lib/optimizedQueries';

export function useDataPreloader() {
  useEffect(() => {
    // Preload critical data when the app starts
    preloadCriticalData();
  }, []);
}

// Custom hook for optimized data fetching with error handling
export function useOptimizedData() {
  const preloadData = async () => {
    try {
      await preloadCriticalData();
    } catch (error) {
      console.error('Failed to preload data:', error);
    }
  };

  return { preloadData };
}
