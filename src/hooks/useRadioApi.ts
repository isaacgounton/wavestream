import { useState, useRef } from 'react';
import { API_CONFIG } from '../config/api';
import { getHeaders, rotateServer } from '../utils/apiHelpers';
import type { Station } from '../types/station';

export function useRadioApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastQueryRef = useRef<string>('');
  const [lastSearchTime, setLastSearchTime] = useState<number>(0);

  const searchStations = async (query: string): Promise<Station[]> => {
    const now = Date.now();
    if (now - lastSearchTime < 2000) {
      // Skip if called again too soon
      return [];
    }
    setLastSearchTime(now);

    if (!query.trim()) return [];
    if (query === lastQueryRef.current && isLoading) {
      // Prevent multiple identical calls when one is still in flight
      return [];
    }
    lastQueryRef.current = query;

    setIsLoading(true);
    setError(null);

    try {
      const encodedQuery = encodeURIComponent(query);
      const url = `/api/json/stations/search?name=${encodedQuery}&limit=${API_CONFIG.defaultLimit}&hidebroken=true`;

      const response = await fetch(url, {
        headers: getHeaders(),
        mode: 'cors',
      });

      if (!response.ok || response.status === 429) {
        throw new Error(response.status === 429
          ? 'Too many requests. Please try again in a moment.'
          : 'Failed to fetch stations');
      }

      const data = await response.json();
      return data.filter((station: Station) => station.url && station.name);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      if (message.includes('ERR_NAME_NOT_RESOLVED')) {
        rotateServer(); // Move to next server
      }
      setError(message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return { searchStations, isLoading, error };
}