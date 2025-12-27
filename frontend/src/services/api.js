const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const request = async (endpoint, options = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
};

const api = {
  auth: {
    login: (credentials) => request('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    register: (userData) => request('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  },

  expenses: {
    getAll: (params) => {
      const query = new URLSearchParams(params).toString();
      return request(`/expenses?${query}`);
    },
    getById: (id) => request(`/expenses/${id}`), // NEW
    create: (data) => request('/expenses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id, data) => request(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id) => request(`/expenses/${id}`, { method: 'DELETE' }),
    getSummary: (params) => {
      const query = new URLSearchParams(params).toString();
      return request(`/expenses/summary?${query}`);
    },
  },

  users: {
    getAll: () => request('/users'),
    getById: (id) => request(`/users/${id}`), // NEW
    update: (id, data) => request(`/users/${id}`, { // NEW
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id) => request(`/users/${id}`, { method: 'DELETE' }),
  },
};

export default api;