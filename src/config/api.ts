export const API_CONFIG = {
  baseUrls: [
    'de1.api.radio-browser.info',  // Primary server
    'fr1.api.radio-browser.info',  // Backup servers
    'nl1.api.radio-browser.info'
  ],
  defaultLimit: 100, // Increased from 10 to 100
  itemsPerPage: 10,  // New: Number of items to show per page
  minSearchDelay: 2000, // Increased delay to avoid rate limiting
};