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
    if (currentStation?.id === station.id) {
      // Toggle play/pause for current station
      setIsPlaying(!isPlaying);
    } else {
      // Stop current audio before switching
      setIsPlaying(false);
      setCurrentStation(null);
      
      // Small delay to ensure cleanup
      requestAnimationFrame(() => {
        setCurrentStation(station);
        setIsPlaying(true);
      });
    }
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
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
        <div className="flex justify-center items-center gap-2 mt-8 mb-20">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 
                     text-gray-700 dark:text-gray-300 disabled:opacity-50"
            aria-label="Previous page"
          >
            Previous
          </button>
          
          <span className="mx-4 text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 
                     text-gray-700 dark:text-gray-300 disabled:opacity-50"
            aria-label="Next page"
          >
            Next
          </button>
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