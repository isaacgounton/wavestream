import * as React from 'react';
import { useRadioApi } from '../hooks/useRadioApi';
import { API_CONFIG } from '../config/api';
import type { Station } from '../types/station';

interface StationsContextType {
  stations: Station[];
  searchStations: (query: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  locationContext: string;
}

export const StationsContext = React.createContext<StationsContextType | undefined>(undefined);

export function StationsProvider({ children }: { children: React.ReactNode }) {
  const [stations, setStations] = React.useState<Station[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [locationContext, setLocationContext] = React.useState('Popular Stations');
  const { searchStations: searchApi, isLoading, error } = useRadioApi();

  // Load popular stations on mount
  React.useEffect(() => {
    const fetchPopularStations = async () => {
      const baseUrl = import.meta.env.PROD 
        ? `https://${API_CONFIG.baseUrls[0]}`
        : '/api';
      
      try {
        const response = await fetch(`${baseUrl}/json/stations/topclick?limit=${API_CONFIG.defaultLimit}&hidebroken=true`);
        if (response.ok) {
          const data = await response.json();
          setStations(data.filter((station: Station) => station.url && station.name));
        }
      } catch (err) {
        console.error('Failed to load popular stations:', err);
      }
    };

    fetchPopularStations();
  }, []);

  const searchStations = React.useCallback(async (query: string) => {
    if (!query.trim()) return;
    const results = await searchApi(query);
    setStations(results);
    setLocationContext(query ? `Results for "${query}"` : 'Popular Stations');
  }, [searchApi]);

  const totalPages = React.useMemo(() => {
    return Math.max(1, Math.ceil(stations.length / API_CONFIG.itemsPerPage));
  }, [stations.length]);

  const paginatedStations = React.useMemo(() => {
    const start = (currentPage - 1) * API_CONFIG.itemsPerPage;
    const end = start + API_CONFIG.itemsPerPage;
    return stations.slice(start, end);
  }, [stations, currentPage]);

  const value = React.useMemo(() => ({
    stations: paginatedStations,
    searchStations,
    isLoading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    locationContext,
  }), [paginatedStations, searchStations, isLoading, error, currentPage, totalPages, locationContext]);

  return (
    <StationsContext.Provider value={value}>
      {children}
    </StationsContext.Provider>
  );
}