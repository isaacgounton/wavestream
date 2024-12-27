import { useState, useRef } from 'react';
import { API_CONFIG } from '../config/api';
import { getHeaders } from '../utils/apiHelpers';
import type { Station } from '../types/station';

export function useRadioApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastQueryRef = useRef<string>('');
  const [lastSearchTime, setLastSearchTime] = useState<number>(0);
  const activeRequest = useRef<AbortController | null>(null);

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

    // Cancel any in-flight request
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
        ? `https://${API_CONFIG.baseUrls[0]}`  // Use first server in production
        : '/api';
      
      const url = `${baseUrl}/json/stations/search?name=${encodedQuery}&limit=${API_CONFIG.defaultLimit}&hidebroken=true`;

      const response = await fetch(url, {
        headers: getHeaders(),
        mode: 'cors',
        signal: controller.signal,
      });

      if (!response.ok || response.status === 429) {
        throw new Error(response.status === 429
          ? 'Too many requests. Please try again in a moment.'
          : 'Failed to fetch stations');
      }

      const data = await response.json();
      return data.filter((station: Station) => station.url && station.name);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        return [];
      }
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      return [];
    } finally {
      if (activeRequest.current === controller) {
        activeRequest.current = null;
        setIsLoading(false);
      }
    }
  };

  return { searchStations, isLoading, error };
}