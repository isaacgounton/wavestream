import { useState, useEffect } from 'react';
import { API_CONFIG } from '../config/api';
import { getHeaders } from '../utils/apiHelpers';
import type { Station } from '../types/station';

export function useDefaultStations() {
  const [defaultStations, setDefaultStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDefaultStations() {
      try {
        const baseUrl = import.meta.env.PROD 
          ? `https://${API_CONFIG.baseUrls[0]}`
          : '/api';
        
        // Fetch popular stations or stations by click count
        const url = `${baseUrl}/json/stations/topclick?limit=${API_CONFIG.defaultLimit}&hidebroken=true`;
        
        const response = await fetch(url, {
          headers: getHeaders(),
          mode: 'cors',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch default stations');
        }

        const data = await response.json();
        setDefaultStations(data.filter((station: Station) => station.url && station.name));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load default stations');
      } finally {
        setIsLoading(false);
      }
    }

    fetchDefaultStations();
  }, []);

  return { defaultStations, isLoading, error };
}
