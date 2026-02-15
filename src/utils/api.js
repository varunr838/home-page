// src/utils/api.js

const BASE_URL = "https://dorie-lunulate-breezily.ngrok-free.dev";

/**
 * A wrapper around fetch that handles token refreshing automatically.
 * Use this instead of fetch() for all protected endpoints.
 */
export const apiFetch = async (endpoint, options = {}) => {
  // 1. Prepare default options (cookies, headers)
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  };

  const config = {
    ...options,
    credentials: 'include', // Always send cookies (Access/Refresh tokens)
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  // Ensure endpoint starts with / if not providing full URL
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

  try {
    // 2. Make the initial request
    let response = await fetch(url, config);

    // 3. If 401 Unauthorized, Access Token might be expired
    if (response.status === 401) {
      console.warn("Access token expired. Attempting refresh...");

      // 4. Attempt to refresh the token
      const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include', // Sends the httpOnly REFRESH_TOKEN cookie
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });

      if (refreshResponse.ok) {
        console.log("Refresh successful. Retrying original request...");
        
        // 5. Retry the original request
        // The browser has already updated the Access Token cookie from the refreshResponse
        response = await fetch(url, config);
      } else {
        // 6. Refresh failed (Token expired/invalid) -> Force Logout
        console.error("Refresh failed. Redirecting to login.");
        doLogout();
        return response; // Return the error response so the UI stops loading
      }
    }

    return response;

  } catch (error) {
    console.error("API Request Failed:", error);
    throw error;
  }
};

// Helper to clear local state and redirect
const doLogout = () => {
  localStorage.removeItem('isLoggedIn');
  // Use window.location to force a full redirect since we are outside a React component
  window.location.href = '/login';
};