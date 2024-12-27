export const API_CONFIG = {
  // List of radio-browser.info API servers
  baseUrls: [
    'de1.api.radio-browser.info',
    'fr1.api.radio-browser.info',
    'nl1.api.radio-browser.info'
  ],
  defaultLimit: 10,
  // Avoid rate limiting by implementing reasonable delays
  minSearchDelay: 300, // ms between searches
};