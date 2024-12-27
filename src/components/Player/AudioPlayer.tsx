import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Radio } from 'lucide-react';
import { Station } from '../../types/station';

interface AudioPlayerProps {
  currentStation: Station | null;
  isPlaying: boolean;
  onPlayPause: () => void;
}

export function AudioPlayer({ currentStation, isPlaying, onPlayPause }: AudioPlayerProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-3">
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
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <SkipBack className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={onPlayPause}
              className="p-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <SkipForward className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <input
              type="range"
              min="0"
              max="100"
              className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}