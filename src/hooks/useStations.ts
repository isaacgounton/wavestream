import { useContext } from 'react';
import { StationsContext } from '../context/StationsContext';

export function useStations() {
  const context = useContext(StationsContext);
  if (context === undefined) {
    throw new Error('useStations must be used within a StationsProvider');
  }
  return context;
}
