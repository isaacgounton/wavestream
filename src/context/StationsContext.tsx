import React, { createContext, useState } from 'react';
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
}

export const StationsContext = createContext<StationsContextType | undefined>(undefined);

export function StationsProvider({ children }: { children: React.ReactNode }) {
  const [stations, setStations] = useState<Station[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { searchStations: searchApi, isLoading, error } = useRadioApi();
  
  const totalPages = Math.ceil(stations.length / API_CONFIG.defaultLimit);

  const searchStations = async (query: string) => {
    setCurrentPage(1); // Reset to first page on new search
    const results = await searchApi(query);
    setStations(results);
  };

  const value = {
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
  };

  return (
    <StationsContext.Provider value={value}>
      {children}
    </StationsContext.Provider>
  );
}