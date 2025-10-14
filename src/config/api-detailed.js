// Temporary API configuration for testing
// Switch between local test server and production API Gateway

const API_CONFIGS = {
  // Use this for testing locally (when test-server.js is running)
  LOCAL_TEST: 'http://localhost:3002',
  
  // Use this for production (once API Gateway routes are configured)
  PRODUCTION: 'https://j0x67zhvpb.execute-api.us-east-2.amazonaws.com/dev',
  
  // Use this for working endpoints (packages, login, etc.)
  PRODUCTION_WORKING: 'https://j0x67zhvpb.execute-api.us-east-2.amazonaws.com/dev'
};

// Current configuration - change this to switch between environments
const CURRENT_CONFIG = 'PRODUCTION_WORKING';

const API_BASE_URL = API_CONFIGS[CURRENT_CONFIG];

export default API_BASE_URL;

// Export specific URLs for different endpoint groups
export const PROFILE_API_URL = API_CONFIGS.LOCAL_TEST; // Use local test for profile endpoints
export const MAIN_API_URL = API_CONFIGS.PRODUCTION_WORKING; // Use production for working endpoints
