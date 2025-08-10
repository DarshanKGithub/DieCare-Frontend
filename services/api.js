const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiService = {
  /**
   * Logs a user in by calling the backend API.
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @returns {Promise<object>} An object with { success, message, accessToken?, user? }.
   */
  login: async (email, password) => {
    const API_URL = `${API_BASE_URL}/api/login`;
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
   * @returns {Promise<object>} An object with { success, message, user? }.
   */
  register: async (userData) => {
    const API_URL = `${API_BASE_URL}/api/register`;
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
      return { success: true, message: data.message, user: data.user };
    } catch (error) {
      console.error('Registration API Error:', error);
      return { success: false, message: error.message };
    }
  },

  /**
   * Fetches all users (Admin only).
   * @param {string} token - JWT access token.
   * @returns {Promise<object>} An object with { success, message, users? }.
   */
  getAllUsers: async (token) => {
    const API_URL = `${API_BASE_URL}/api/register`;
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      return { success: true, message: data.message, users: data.users };
    } catch (error) {
      console.error('Get All Users API Error:', error);
      return { success: false, message: error.message };
    }
  },

  /**
   * Fetches a single user by ID.
   * @param {string} id - User ID.
   * @param {string} token - JWT access token.
   * @returns {Promise<object>} An object with { success, message, user? }.
   */
  getUser: async (id, token) => {
    const API_URL = `${API_BASE_URL}/api/register/${id}`;
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      return { success: true, message: data.message, user: data.user };
    } catch (error) {
      console.error(`Get User ${id} API Error:`, error);
      return { success: false, message: error.message };
    }
  },

  /**
   * Updates a user by ID.
   * @param {string} id - User ID.
   * @param {object} userData - User data to update (email, name, phone_number, role, designation, password).
   * @param {string} token - JWT access token.
   * @returns {Promise<object>} An object with { success, message, user? }.
   */
  updateUser: async (id, userData, token) => {
    const API_URL = `${API_BASE_URL}/api/register/${id}`;
    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      return { success: true, message: data.message, user: data.user };
    } catch (error) {
      console.error(`Update User ${id} API Error:`, error);
      return { success: false, message: error.message };
    }
  },

  /**
   * Deletes a user by ID (Admin only).
   * @param {string} id - User ID.
   * @param {string} token - JWT access token.
   * @returns {Promise<object>} An object with { success, message }.
   */
  deleteUser: async (id, token) => {
    const API_URL = `${API_BASE_URL}/api/register/${id}`;
    try {
      const response = await fetch(API_URL, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      return { success: true, message: data.message };
    } catch (error) {
      console.error(`Delete User ${id} API Error:`, error);
      return { success: false, message: error.message };
    }
  },
};