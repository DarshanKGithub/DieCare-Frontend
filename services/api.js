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

 //================================================================//
  //                      PARTS API METHODS                         //
  //================================================================//

  /**
   * Creates a new part (Admin/HOD only).
   * @param {object} partData - Data for the new part { part_name, company_name?, sap_code }.
   * @param {string} token - JWT access token.
   * @returns {Promise<object>} An object with { success, message, part? }.
   */
  addPart: async (partData, token) => {
    const API_URL = `${API_BASE_URL}/api/parts`;
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(partData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      return { success: true, message: data.message, part: data.part };
    } catch (error) {
      console.error('Add Part API Error:', error);
      return { success: false, message: error.message };
    }
  },

  /**
   * Fetches all parts.
   * @param {string} token - JWT access token.
   * @returns {Promise<object>} An object with { success, message, parts? }.
   */
  getAllParts: async (token) => {
    const API_URL = `${API_BASE_URL}/api/parts`;
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
      return { success: true, message: data.message, parts: data.parts };
    } catch (error) {
      console.error('Get All Parts API Error:', error);
      return { success: false, message: error.message };
    }
  },
  
  /**
   * Updates a part by ID (Admin/HOD only).
   * @param {string} id - Part ID.
   * @param {object} partData - Part data to update.
   * @param {string} token - JWT access token.
   * @returns {Promise<object>} An object with { success, message, part? }.
   */
  updatePart: async (id, partData, token) => {
    const API_URL = `${API_BASE_URL}/api/parts/${id}`;
    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(partData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      return { success: true, message: data.message, part: data.part };
    } catch (error) {
      console.error(`Update Part ${id} API Error:`, error);
      return { success: false, message: error.message };
    }
  },

  /**
   * Deletes a part by ID (Admin only).
   * @param {string} id - Part ID.
   * @param {string} token - JWT access token.
   * @returns {Promise<object>} An object with { success, message }.
   */
  deletePart: async (id, token) => {
    const API_URL = `${API_BASE_URL}/api/parts/${id}`;
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
      console.error(`Delete Part ${id} API Error:`, error);
      return { success: false, message: error.message };
    }
  },

   //================================================================//
  //                      Tasks API METHODS                         //
  //================================================================//

   /**
   * Creates a new quality task.
   * @param {FormData} formData - The form data, including text fields and images.
   * @param {string} token - JWT access token.
   * @returns {Promise<object>} An object with { success, message, task? }.
   */
  addTask: async (formData, token) => {
    const API_URL = `${API_BASE_URL}/api/tasks`;
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          // 'Content-Type' is NOT set, the browser does it automatically for FormData
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      return { success: true, message: data.message, task: data.task };
    } catch (error) {
      console.error('Add Task API Error:', error);
      return { success: false, message: error.message };
    }
  },

   /**
   * Fetches all quality tasks.
   * @param {string} token - JWT access token.
   * @returns {Promise<object>} An object with { success, tasks? }.
   */
  getAllTasks: async (token) => {
    const API_URL = `${API_BASE_URL}/api/tasks`;
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
        throw new Error(data.error || 'Failed to fetch tasks.');
      }
      return { success: true, tasks: data.tasks };
    } catch (error) {
      console.error('Get All Tasks API Error:', error);
      return { success: false, message: error.message };
    }
  },
};
