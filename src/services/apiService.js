import client from './api';

export const authService = {
  login: (email, password) => client.post('/users/login', { email, password }),
};

export const teamService = {
  getAll: () => client.get('/team'),
  create: (data) => client.post('/team', data),
  update: (id, data) => client.put(`/team/${id}`, data),
  delete: (id) => client.delete(`/team/${id}`),
};

export const blogService = {
  getAll: (params) => client.get('/blogs', { params }),
  create: (data) => client.post('/blogs', data),
  update: (id, data) => client.put(`/blogs/${id}`, data),
  delete: (id) => client.delete(`/blogs/${id}`),
  getPublished: () => client.get('/blogs/published'),
  getBySlug: (slug) => client.get(`/blogs/slug/${slug}`),
};

export const inquiriesAPI = {
  getAll: (params) => client.get('/admin/inquiries', { params }),
  getById: (id) => client.get(`/admin/inquiries/${id}`),
  create: (data) => client.post('/admin/inquiries', data),
  updateStatus: (id, status) => client.put(`/admin/inquiries/${id}/status`, { status }),
  updateNotes: (id, notes) => client.put(`/admin/inquiries/${id}/notes`, { notes }),
  delete: (id) => client.delete(`/admin/inquiries/${id}`),
};
