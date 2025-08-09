// ============================================================================
// --- API Service ---
// FILE: /services/api.js
// NOTE: Add 'export' to make this object importable.
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ;
export const apiService = {
  /**
   * Logs a user in by calling the backend API.
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @returns {Promise<object>} An object with { success, message, accessToken?, user? }.
   */
  login: async (email, password) => {
    const API_URL = `${API_BASE_URL}/api/login`; // Assumes a proxy or same-domain API route
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      return { success: true, message: data.message, accessToken: data.accessToken, user: data.user };
    } catch (error) {
      console.error('Login API Error:', error);
      return { success: false, message: error.message };
    }
  },

  /**
   * Registers a new user by calling the backend API.
   * @param {object} userData - The user's registration data.
   * @returns {Promise<object>} An object with { success, message }.
   */
  register: async (userData) => {
    const API_URL = `${API_BASE_URL}/api/register`; // Assumes a proxy or same-domain API route
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      return { success: true, message: data.message };
    } catch (error) {
      console.error('Registration API Error:', error);
      return { success: false, message: error.message };
    }
  },
};
