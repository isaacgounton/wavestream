import { useState, useCallback } from 'react';
import { API_CONFIG } from '../config/api';
import type { Station } from '../types/station';

const API_URL = `https://${API_CONFIG.baseUrls[0]}/json/stations/search`;

export function useRadioApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchStations = useCallback(async (query: string): Promise<Station[]> => {
    if (!query.trim()) return [];
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}?name=${encodeURIComponent(query)}&limit=${API_CONFIG.defaultLimit}&hidebroken=true`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch stations');
      }

      const stations = await response.json();
      return stations.filter((station: Station) => station.url && station.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { searchStations, isLoading, error };
}