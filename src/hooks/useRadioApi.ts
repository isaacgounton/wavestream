import * as React from 'react';
import { API_CONFIG } from '../config/api';
import { getHeaders } from '../utils/apiHelpers';
import type { Station } from '../types/station';

export function useRadioApi() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [lastSearchTime, setLastSearchTime] = React.useState(0);
  const lastQueryRef = React.useRef<string>('');
  const activeRequest = React.useRef<AbortController | null>(null);

  const searchStations = React.useCallback(async (query: string): Promise<Station[]> => {
    const now = Date.now();
    if (now - lastSearchTime < 2000) {
      return [];
    }
    setLastSearchTime(now);

    if (!query.trim()) return [];
    if (query === lastQueryRef.current && isLoading) {
      return [];
    }
    lastQueryRef.current = query;

    if (activeRequest.current) {
      activeRequest.current.abort();
    }

    setIsLoading(true);
    setError(null);

    const controller = new AbortController();
    activeRequest.current = controller;

    try {
      const encodedQuery = encodeURIComponent(query);
      const baseUrl = import.meta.env.PROD 
        ? `https://${API_CONFIG.baseUrls[0]}`
        : '/api';
      
      const url = `${baseUrl}/json/stations/search?name=${encodedQuery}&limit=${API_CONFIG.defaultLimit}&hidebroken=true`;

      const response = await fetch(url, {
        headers: getHeaders(),
        mode: 'cors',
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stations');
      }

      const data = await response.json();
      return data.filter((station: Station) => station.url && station.name);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return [];
      }
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    } finally {
      if (activeRequest.current === controller) {
        activeRequest.current = null;
        setIsLoading(false);
      }
    }
  }, [isLoading, lastSearchTime]);

  return { searchStations, isLoading, error };
}