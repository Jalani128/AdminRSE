import client from './api';

export const authService = {
  login: (email, password) => client.post('/auth/login', { email, password }),
};

export const teamService = {
  getAll: () => client.get('/team'),
  create: (data) => client.post('/team/create', data),
  update: (id, data) => client.put(`/team/${id}`, data),
  delete: (id) => client.delete(`/team/${id}`),
};

export const blogService = {
  getAll: () => client.get('/blogs'),
  create: (data) => client.post('/blogs/create', data),
  update: (id, data) => client.put(`/blogs/${id}`, data),
  delete: (id) => client.delete(`/blogs/${id}`),
};