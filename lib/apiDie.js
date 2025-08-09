import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'; // Fallback if not set in .env.local
const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const login = async (email, password) => {
  const response = await instance.post('/auth/login', { email, password });
  return response.data;
};

export const adminLogin = async (email, password) => {
  const response = await instance.post('/admin/login', { email, password });
  return response.data;
};

// User APIs
export const registerUser = async (userData) => {
  const response = await instance.post('/users/register', userData);
  return response.data;
};

export const getUsersByRole = async (role) => {
  const response = await instance.get('/users', { params: { role } });
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await instance.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await instance.delete(`/users/${id}`);
  return response.data;
};

// Task APIs
export const createTask = async (taskData) => {
  const response = await instance.post('/tasks', taskData);
  return response.data;
};

export const getTasks = async () => {
  const response = await instance.get('/tasks');
  return response.data;
};

export const getTaskById = async (id) => {
  const response = await instance.get(`/tasks/${id}`);
  return response.data;
};

// Part APIs
export const createPart = async (partData, images) => {
  const formData = new FormData();
  Object.keys(partData).forEach((key) => {
    formData.append(key, partData[key]);
  });
  images.forEach((image) => {
    formData.append('images', image);
  });
  const response = await instance.post('/parts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getParts = async () => {
  const response = await instance.get('/parts');
  return response.data;
};

export const getPartBySerialNumber = async (serialNumber) => {
  const response = await instance.get(`/parts/${serialNumber}`);
  return response.data;
};

export const updatePart = async (serialNumber, partData, images) => {
  const formData = new FormData();
  Object.keys(partData).forEach((key) => {
    formData.append(key, partData[key]);
  });
  images.forEach((image) => {
    formData.append('images', image);
  });
  const response = await instance.put(`/parts/${serialNumber}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deletePart = async (serialNumber) => {
  const response = await instance.delete(`/parts/${serialNumber}`);
  return response.data;
};

// Notification APIs
export const createNotification = async (notificationData) => {
  const response = await instance.post('/notifications', notificationData);
  return response.data;
};

export const getNotificationsByRole = async (role) => {
  const response = await instance.get(`/notifications/${role}`);
  return response.data;
};

export const markNotificationAsRead = async (id) => {
  const response = await instance.put(`/notifications/${id}/read`);
  return response.data;
};

export default instance;