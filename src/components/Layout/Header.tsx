import React, { useState, useEffect } from 'react';
import { Radio, Menu, Search, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useStations } from '../../hooks/useStations';
import { useDebounce } from '../../hooks/useDebounce';

export function Header() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { searchStations, isLoading } = useStations();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 2000);

  // Effect to handle debounced search
  useEffect(() => {
    if (debouncedSearchTerm) {
      searchStations(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, searchStations]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    
    // The actual search will be triggered by the debounced value
    // through the useDebounce hook
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Radio className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">WaveStream</h1>
          </div>
          
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="search"
                placeholder={isLoading ? "Searching..." : "Search stations, genres, or countries..."}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 
                         bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                         focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                         disabled:opacity-50"
                value={searchTerm}
                onChange={handleSearchChange}
                disabled={isLoading}
              />
            </div>
          </div>

          <nav className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            <button 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Open menu"
              title="Open menu"
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}