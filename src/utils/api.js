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
    if (!res.ok) throw new Error((await res.json()).detail || 'Error');
    return res.json();
  },
  async get(path) { return this.json(path, { headers: this.headers() }); },
  async post(path, body) { return this.json(path, { method: 'POST', headers: this.headers(), body: JSON.stringify(body) }); },
  async upload(path, formData) {
    const headers = {};
    if (this.token) headers.Authorization = `Bearer ${this.token}`;
    const res = await fetch(`${BASE_URL}${path}`, { method: 'POST', headers, body: formData });
    if (!res.ok) throw new Error((await res.json()).detail || 'Error');
    return res.json();
  },
  baseUrl: BASE_URL,
};
