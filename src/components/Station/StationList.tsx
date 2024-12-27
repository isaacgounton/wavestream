import { useState } from 'react';
import { Station } from '../../types/station';
import { StationCard } from './StationCard';
import { AudioPlayer } from '../Player/AudioPlayer';
import { useStations } from '../../hooks/useStations';
import { useFavorites } from '../../hooks/useFavorites';

export function StationList() {
  const { 
    stations, 
    isLoading, 
    error, 
    currentPage, 
    totalPages, 
    setCurrentPage 
  } = useStations();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayStation = (station: Station) => {
    setCurrentStation(station);
    setIsPlaying(true);
  };

  const handleToggleFavorite = (station: Station) => {
    toggleFavorite(station);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        Error: {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-4">
        Loading stations...
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {stations.map((station: Station, index: number) => (
          <StationCard
            key={station.id || `station-${index}`}
            station={station}
            isPlaying={currentStation?.id === station.id && isPlaying}
            isFavorite={isFavorite(station.id)}
            onPlay={() => handlePlayStation(station)}
            onFavorite={() => handleToggleFavorite(station)}
          />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-4 py-2 rounded-md ${
                currentPage === i + 1
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              aria-label={`Go to page ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
      
      <AudioPlayer
        currentStation={currentStation}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
      />
    </>
  );
}