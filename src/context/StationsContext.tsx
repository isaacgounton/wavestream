import * as React from 'react';
import { useRadioApi } from '../hooks/useRadioApi';
import { API_CONFIG } from '../config/api';
import type { Station } from '../types/station';
import { useDefaultStations } from '../hooks/useDefaultStations';

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
  
  const { searchStations: searchApi, isLoading: searchLoading, error: searchError } = useRadioApi();
  const { defaultStations, isLoading: defaultLoading, error: defaultError } = useDefaultStations();

  // Load default stations when component mounts
  React.useEffect(() => {
    if (defaultStations.length > 0) {
      setStations(defaultStations);
    }
  }, [defaultStations]);

  const isLoading = searchLoading || defaultLoading;
  const error = searchError || defaultError;

  const totalPages = Math.ceil(stations.length / API_CONFIG.defaultLimit);

  const searchStations = React.useCallback(async (query: string) => {
    setCurrentPage(1);
    const results = await searchApi(query);
    setStations(results);
    setLocationContext(query ? `Results for "${query}"` : 'Popular Stations');
  }, [searchApi]);

  const value = React.useMemo(() => ({
    stations: stations.slice(
      (currentPage - 1) * API_CONFIG.defaultLimit,
      currentPage * API_CONFIG.defaultLimit
    ),
    searchStations,
    isLoading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    locationContext,
  }), [stations, searchStations, isLoading, error, currentPage, totalPages, locationContext]);

  return (
    <StationsContext.Provider value={value}>
      {children}
    </StationsContext.Provider>
  );
}