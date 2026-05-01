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
  create: (data) => client.post('/admin/inquiries', data),
  getAll: (params) => client.get('/admin/inquiries', { params }),
  getById: (id) => client.get(`/admin/inquiries/${id}`),
  updateStatus: (id, data) => client.put(`/admin/inquiries/${id}/status`, data),
  delete: (id) => client.delete(`/admin/inquiries/${id}`),
};

export const blogsAPI = {
  getAll: (params) => client.get('/blogs', { params }),
  getById: (id) => client.get(`/blogs/${id}`),
  create: (data) => client.post('/blogs', data),
  update: (id, data) => client.put(`/blogs/${id}`, data),
  delete: (id) => client.delete(`/blogs/${id}`),
  getPublished: () => client.get('/blogs/published'),
  getBySlug: (slug) => client.get(`/blogs/slug/${slug}`),
};

export const teamAPI = {
  getAll: () => client.get('/team'),
  getById: (id) => client.get(`/team/${id}`),
  create: (data) => client.post('/team', data),
  update: (id, data) => client.put(`/team/${id}`, data),
  delete: (id) => client.delete(`/team/${id}`),
};

export default client;