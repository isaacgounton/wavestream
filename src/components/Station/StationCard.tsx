import { Play, Pause, Heart, Radio } from 'lucide-react';
import { Station } from '../../types/station';

interface StationCardProps {
  station: Station;
  isPlaying: boolean;
  isFavorite: boolean;
  onPlay: () => void;
  onFavorite: () => void;
}

export function StationCard({
  station,
  isPlaying,
  isFavorite,
  onPlay,
  onFavorite,
}: StationCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onPlay();
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md 
                    transition-all duration-200 overflow-hidden">
      <div className="aspect-square bg-gradient-to-br from-indigo-100 to-purple-100 
                      dark:from-indigo-900 dark:to-purple-900 p-6 flex items-center justify-center">
        <Radio className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-gray-900 dark:text-white truncate">
          {station.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {station.country}
        </p>
        
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={handleClick}
            className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white 
                     transition-colors duration-200"
            aria-label={isPlaying ? `Pause ${station.name}` : `Play ${station.name}`}
            title={isPlaying ? `Pause ${station.name}` : `Play ${station.name}`}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>
          
          <button
            onClick={onFavorite}
            className={`p-2 rounded-full transition-colors duration-200 
                      ${isFavorite 
                        ? 'text-red-500 hover:text-red-600' 
                        : 'text-gray-400 hover:text-gray-500'}`}
            aria-label={isFavorite ? `Remove ${station.name} from favorites` : `Add ${station.name} to favorites`}
            title={isFavorite ? `Remove ${station.name} from favorites` : `Add ${station.name} to favorites`}
          >
            <Heart className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  );
}