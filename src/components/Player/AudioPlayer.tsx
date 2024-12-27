import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Radio } from 'lucide-react';
import { Station } from '../../types/station';

interface AudioPlayerProps {
  currentStation: Station | null;
  isPlaying: boolean;
  onPlayPause: () => void;
}

export function AudioPlayer({ currentStation, isPlaying, onPlayPause }: AudioPlayerProps) {
  const audioRef = React.useRef<HTMLAudioElement>(null);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Clear current audio source when switching stations
    if (!isPlaying || !currentStation?.url) {
      audio.src = '';
      audio.removeAttribute('src');
      audio.load();
      return;
    }

    // Set up new audio source
    if (currentStation.url !== audio.src) {
      audio.src = currentStation.url;
    }

    // Play or pause based on isPlaying state
    const playPromise = isPlaying ? audio.play() : Promise.resolve();
    playPromise.then(() => {
      if (!isPlaying) {
        audio.pause();
      }
    }).catch(console.error);

    // Cleanup function
    return () => {
      audio.pause();
      audio.src = '';
      audio.removeAttribute('src');
      audio.load();
    };
  }, [isPlaying, currentStation]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-3">
      <audio ref={audioRef} className="hidden" />
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
              <Radio className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {currentStation?.name || 'Select a station'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {currentStation?.country || 'No station playing'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <button 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Previous station"
              title="Previous station"
            >
              <SkipBack className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={onPlayPause}
              className="p-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white"
              aria-label={isPlaying ? `Pause ${currentStation?.name || 'current station'}` : `Play ${currentStation?.name || 'current station'}`}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </button>
            <button 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Next station"
              title="Next station"
            >
              <SkipForward className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="100"
              className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              aria-label="Volume control"
              title="Adjust volume"
            />
          </div>
        </div>
      </div>
    </div>
  );
}