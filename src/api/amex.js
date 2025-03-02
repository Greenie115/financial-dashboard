// src/api/amex.js
import { createAmexClientMock } from './mockData';

/**
 * Creates an American Express API client
 * @param {string} token - The Amex API access token
 * @returns {Object} API client object with methods for interacting with Amex API
 */
const createAmexClient = (token) => {
  // For the demo app, we'll use the mock implementation
  // In a real app, this would make actual API calls to Amex's endpoints
  return createAmexClientMock();
};

export default createAmexClient;