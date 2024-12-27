export const API_CONFIG = {
  baseUrls: [
    'de1.api.radio-browser.info',  // Primary server
    'fr1.api.radio-browser.info',  // Backup servers
    'nl1.api.radio-browser.info'
  ],
  defaultLimit: 10,
  minSearchDelay: 2000, // Increased delay to avoid rate limiting
};