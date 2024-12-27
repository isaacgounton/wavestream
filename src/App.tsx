import React from 'react';
import { Header } from './components/Layout/Header';
import { StationList } from './components/Station/StationList';
import { StationsProvider } from './context/StationsContext';

function App() {
  return (
    <StationsProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        
        <main className="container mx-auto px-4 py-8 pb-24">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Discover Stations
            </h2>
            <StationList />
          </section>
        </main>
      </div>
    </StationsProvider>
  );
}

export default App;