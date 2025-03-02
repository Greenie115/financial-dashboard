// src/api/starling.js
import { createStarlingClientMock } from './mockData';

/**
 * Creates a Starling Bank API client
 * @param {string} token - The Starling API access token
 * @returns {Object} API client object with methods for interacting with Starling API
 */
const createStarlingClient = (token) => {
  // For the demo app, we'll use the mock implementation
  // In a real app, this would make actual API calls to Starling's endpoints
  return createStarlingClientMock();
};

export default createStarlingClient;