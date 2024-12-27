import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, Heart, ArrowLeft, Radio } from 'lucide-react';
import { useStations } from '../hooks/useStations';
import { useFavorites } from '../hooks/useFavorites';
import { API_CONFIG } from '../config/api';

export function StationDetail() {
  const { stationId } = useParams();
  const navigate = useNavigate();
  const { stations } = useStations();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [station, setStation] = React.useState(() => stations.find(s => s.id === stationId));
  const audioRef = React.useRef<HTMLAudioElement>(null);

  // Fetch station details if not found in context
  React.useEffect(() => {
    async function fetchStation() {
      if (!stationId || station) return;
      
      setIsLoading(true);
      try {
        const baseUrl = import.meta.env.PROD 
          ? `https://${API_CONFIG.baseUrls[0]}`
          : '/api';
        
        const response = await fetch(`${baseUrl}/json/stations/byid/${stationId}`);
        if (!response.ok) throw new Error('Station not found');
        
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setStation(data[0]);
        } else {
          throw new Error('Station not found');
        }
      } catch (error) {
        console.error('Failed to fetch station:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStation();
  }, [stationId, station]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600 dark:text-gray-400">
          Loading station...
        </div>
      </div>
    );
  }

  if (!station) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600 dark:text-gray-400">
          Station not found
        </div>
      </div>
    );
  }

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.src = station.url;
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        aria-label="Back to stations list"
        title="Back to stations list"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        <span>Back to stations</span>
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <audio ref={audioRef} className="hidden" />
        
        <div className="flex items-start space-x-6">
          <div className="w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 
                         dark:from-indigo-900 dark:to-purple-900 rounded-lg flex items-center justify-center">
            <Radio className="w-16 h-16 text-indigo-600 dark:text-indigo-400" />
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {station.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {station.country}
            </p>

            <div className="flex items-center space-x-4">
              <button
                onClick={handlePlayPause}
                className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700
                         flex items-center space-x-2"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-5 h-5" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Play</span>
                  </>
                )}
              </button>

              <button
                onClick={() => toggleFavorite(station)}
                className={`p-3 rounded-full ${
                  isFavorite(station.id)
                    ? 'text-red-500 hover:text-red-600'
                    : 'text-gray-400 hover:text-gray-500'
                }`}
                aria-label={isFavorite(station.id) ? `Remove ${station.name} from favorites` : `Add ${station.name} to favorites`}
                title={isFavorite(station.id) ? `Remove from favorites` : `Add to favorites`}
              >
                <Heart 
                  className="w-5 h-5" 
                  fill={isFavorite(station.id) ? 'currentColor' : 'none'} 
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
