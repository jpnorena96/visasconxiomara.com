// src/utils/api.js
const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const api = {
  setToken(token, persist = false) {
    // persist: true → localStorage; false → sessionStorage
    if (persist) {
      localStorage.setItem('token', token);
      sessionStorage.removeItem('token');
    } else {
      sessionStorage.setItem('token', token);
      localStorage.removeItem('token');
    }
  },
  clearToken() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  },
  get token() {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  },
  headers(extra = {}) {
    const h = { 'Content-Type': 'application/json', ...extra };
    if (this.token) h.Authorization = `Bearer ${this.token}`;
    return h;
  },
  async json(path, options = {}) {
    const res = await fetch(`${BASE_URL}${path}`, options);
    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: 'Error desconocido' }));
      throw new Error(error.detail || 'Error en la petición');
    }
    return res.json();
  },

  // Métodos básicos
  async get(path) {
    return this.json(path, { headers: this.headers() });
  },
  async post(path, body) {
    return this.json(path, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(body)
    });
  },
  async put(path, body) {
    return this.json(path, {
      method: 'PUT',
      headers: this.headers(),
      body: JSON.stringify(body)
    });
  },
  async patch(path, body) {
    return this.json(path, {
      method: 'PATCH',
      headers: this.headers(),
      body: JSON.stringify(body)
    });
  },
  async delete(path) {
    return this.json(path, {
      method: 'DELETE',
      headers: this.headers()
    });
  },

  // Upload de archivos
  async upload(path, formData) {
    const headers = {};
    if (this.token) headers.Authorization = `Bearer ${this.token}`;
    const res = await fetch(`${BASE_URL}${path}`, { method: 'POST', headers, body: formData });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: 'Error al subir archivo' }));
      throw new Error(error.detail || 'Error al subir archivo');
    }
    return res.json();
  },

  // Auth endpoints
  auth: {
    login: (email, password) => api.post('/api/v1/auth/login', { email, password }),
    register: (email, password) => api.post('/api/v1/auth/register', { email, password }),
    me: () => api.get('/api/v1/auth/me'),
  },

  // Client endpoints
  clients: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return api.get(`/api/v1/admin/clients${query ? '?' + query : ''}`);
    },
    getById: (id) => api.get(`/api/v1/admin/clients/${id}`),
    create: (clientData, email, password) => api.post('/api/v1/admin/clients', { ...clientData, email, password }),
    update: (id, data) => api.put(`/api/v1/admin/clients/${id}`, data),
    delete: (id) => api.delete(`/api/v1/admin/clients/${id}`),
    getDocuments: (id) => api.get(`/api/v1/admin/clients/${id}/documents`),
    getMyProfile: () => api.get('/api/v1/admin/clients/me/profile'),
    updateMyProfile: (data) => api.put('/api/v1/admin/clients/me/profile', data),
  },

  // Document endpoints
  documents: {
    upload: (formData) => api.upload('/api/v1/documents/upload', formData),
    getAll: () => api.get('/api/v1/documents'),
    getAllAdmin: () => api.get('/api/v1/admin/documents'),
    getById: (id) => api.get(`/api/v1/documents/${id}`),
    delete: (id) => api.delete(`/api/v1/documents/${id}`),
    review: (id, status, notes) => api.patch(`/api/v1/admin/documents/${id}`, { status, admin_notes: notes }),
  },

  // Form endpoints
  forms: {
    createOrUpdate: (data) => api.post('/api/v1/forms', data),
    getMy: () => api.get('/api/v1/forms/me'),
    updateMy: (data) => api.put('/api/v1/forms/me', data),
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return api.get(`/api/v1/forms/admin/all${query ? '?' + query : ''}`);
    },
    getById: (id) => api.get(`/api/v1/forms/admin/${id}`),
  },

  // Category endpoints
  categories: {
    getAll: (activeOnly = true) => api.get(`/api/v1/categories?active_only=${activeOnly}`),
    getById: (id) => api.get(`/api/v1/categories/${id}`),
    create: (data) => api.post('/api/v1/categories/admin', data),
    update: (id, data) => api.put(`/api/v1/categories/admin/${id}`, data),
    delete: (id) => api.delete(`/api/v1/categories/admin/${id}`),
  },

  // Activity endpoints
  activities: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return api.get(`/api/v1/admin/activities${query ? '?' + query : ''}`);
    },
    getRecent: (limit = 10) => api.get(`/api/v1/admin/activities/recent?limit=${limit}`),
    getTypes: () => api.get('/api/v1/admin/activities/types'),
    create: (data) => api.post('/api/v1/admin/activities', data),
  },

  baseUrl: BASE_URL,
};
