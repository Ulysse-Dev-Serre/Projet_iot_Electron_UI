const CONFIG = {
  API_KEY: 'test-key',
  BASE_URL: 'http://10.0.0.216:5000',
  POLL_INTERVAL: 10000
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
