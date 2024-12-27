import { API_CONFIG } from '../config/api';

let currentServerIndex = 0;

export function getNextServer(): string {
  // Return the current server
  return API_CONFIG.baseUrls[currentServerIndex];
}

export function rotateServer(): void {
  // Move to the next server and wrap around
  currentServerIndex = (currentServerIndex + 1) % API_CONFIG.baseUrls.length;
}

export function getHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'User-Agent': 'WaveStream/1.0',
  };
}