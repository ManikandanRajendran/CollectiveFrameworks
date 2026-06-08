const API = {
  baseUrl: '',

  getToken() {
    return localStorage.getItem('authToken') || '';
  },

  setToken(token) {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  },

  async request(method, path, body = null) {
    const headers = { 'Content-Type': 'application/json' };
    const token = this.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const options = { method, headers };
    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseUrl}${path}`, options);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || 'Request failed');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  },

  get(path) { return this.request('GET', path); },
  post(path, body) { return this.request('POST', path, body); },
  put(path, body) { return this.request('PUT', path, body); },
  delete(path) { return this.request('DELETE', path); },

  auth: {
    login: (credentials) => API.post('/api/auth/login', credentials),
    register: (data) => API.post('/api/auth/register', data),
    logout: () => API.post('/api/auth/logout'),
    me: () => API.get('/api/auth/me'),
  },

  customer: {
    getProfile: () => API.get('/api/customer/profile'),
    updateProfile: (data) => API.put('/api/customer/profile', data),
  },

  products: {
    list: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return API.get(`/api/products${query ? `?${query}` : ''}`);
    },
    categories: () => API.get('/api/products/categories'),
    get: (id) => API.get(`/api/products/${id}`),
  },

  cart: {
    get: () => API.get('/api/cart'),
    addItem: (productId, quantity) => API.post('/api/cart/items', { productId, quantity }),
    updateItem: (id, quantity) => API.put(`/api/cart/items/${id}`, { quantity }),
    removeItem: (id) => API.delete(`/api/cart/items/${id}`),
    clear: () => API.delete('/api/cart'),
  },

  checkout: {
    validate: (data) => API.post('/api/checkout/validate', data),
    payment: (data) => API.post('/api/checkout/payment', data),
  },

  orders: {
    list: () => API.get('/api/orders'),
    get: (id) => API.get(`/api/orders/${id}`),
  },

  pages: {
    get: (name) => API.get(`/api/pages/${name}`),
  },
};
