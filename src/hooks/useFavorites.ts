import * as React from 'react';
import type { Station } from '../types/station';

const STORAGE_KEY = 'wavestream_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = React.useState<Station[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  }, [favorites]);

  const toggleFavorite = React.useCallback((station: Station) => {
    setFavorites(prev => 
      prev.some(fav => fav.id === station.id)
        ? prev.filter(fav => fav.id !== station.id)
        : [...prev, station]
    );
  }, []);

  const isFavorite = React.useCallback((stationId: string) => {
    return favorites.some(fav => fav.id === stationId);
  }, [favorites]);

  const getFavorites = React.useCallback(() => favorites, [favorites]);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    getFavorites
  };
}
