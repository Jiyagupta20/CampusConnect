// Centralized REST API Service

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('cc_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    // Check if CSV or blob response
    if (options.responseType === 'blob') {
      if (!response.ok) throw new Error('Download failed');
      return await response.blob();
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, error.message);
    throw error;
  }
}

export const api = {
  // Auth
  auth: {
    login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    getProfile: () => request('/auth/me'),
    forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) })
  },

  // Complaints
  complaints: {
    getAll: (params = {}) => {
      const searchParams = new URLSearchParams(params).toString();
      return request(`/complaints${searchParams ? `?${searchParams}` : ''}`);
    },
    getById: (id) => request(`/complaints/${id}`),
    create: (data) => request('/complaints', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id, status, adminRemarks) => 
      request(`/complaints/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, adminRemarks }) }),
    delete: (id) => request(`/complaints/${id}`, { method: 'DELETE' }),
    exportCSV: async () => {
      const blob = await request('/complaints/export/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `campusconnect_complaints_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  },

  // Announcements
  announcements: {
    getAll: (params = {}) => {
      const searchParams = new URLSearchParams(params).toString();
      return request(`/announcements${searchParams ? `?${searchParams}` : ''}`);
    },
    create: (data) => request('/announcements', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/announcements/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/announcements/${id}`, { method: 'DELETE' })
  },

  // Events
  events: {
    getAll: (params = {}) => {
      const searchParams = new URLSearchParams(params).toString();
      return request(`/events${searchParams ? `?${searchParams}` : ''}`);
    },
    create: (data) => request('/events', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/events/${id}`, { method: 'DELETE' }),
    register: (id) => request(`/events/${id}/register`, { method: 'POST' })
  },

  // Lost & Found
  lostFound: {
    getAll: (params = {}) => {
      const searchParams = new URLSearchParams(params).toString();
      return request(`/lost-found${searchParams ? `?${searchParams}` : ''}`);
    },
    create: (data) => request('/lost-found', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id, status) => request(`/lost-found/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    delete: (id) => request(`/lost-found/${id}`, { method: 'DELETE' })
  },

  // Analytics
  analytics: {
    get: () => request('/analytics')
  },

  // Users
  users: {
    getStudents: () => request('/users/students'),
    updateProfile: (data) => request('/users/profile', { method: 'PUT', body: JSON.stringify(data) }),
    deleteStudent: (id) => request(`/users/${id}`, { method: 'DELETE' })
  },

  // Notifications
  notifications: {
    getAll: () => request('/notifications'),
    markRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
    markAllRead: () => request('/notifications/read-all', { method: 'PATCH' })
  }
};

