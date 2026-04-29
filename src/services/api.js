import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const appointmentsAPI = {
  schedule: (data) => client.post('/appointments', data),
};

export const propertiesAPI = {
  getAll: (params) => client.get('/properties', { params }),
  getById: (id) => client.get(`/properties/${id}`),
};

export const inquiriesAPI = {
  create: (data) => client.post('/inquiries', data),
  getAll: () => client.get('/inquiries'),
};

export default client;