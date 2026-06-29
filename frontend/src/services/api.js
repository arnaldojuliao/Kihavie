// services/api.js
const API_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token'); // PADRÃO: "token"

export const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  
  // Resposta pode ser vazia (204 No Content)
  if(response.status === 204) {
    return null;
  }
  
  let data = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  }

  if (!response.ok) {
    const errorMsg = data?.error || data?.message || 'Erro na requisição';
    throw new Error(errorMsg);
  }

  return data;
};

// Funções específicas para autenticação
export const authApi = {
  login: (email, password) => 
    apiCall('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  
  register: (userData) => 
    apiCall('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  
  getMe: () => 
    apiCall('/auth/me'),
  
  upgradeToStoreOwner: () => 
    apiCall('/auth/upgrade-to-store', { method: 'POST' }),
  
  updateProfile: (data) => 
    apiCall('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
  
  updateProfileImage: (image) => 
    apiCall('/auth/profile-image', { method: 'PUT', body: JSON.stringify({ image }) }),
};

// Restante (storeApi, productApi, orderApi) permanece igual
export const storeApi = {
  getActiveStores: () => apiCall('/stores'),
  getStoreById: (storeId) => apiCall(`/stores/${storeId}`),
  updateStore: (storeId, data) => apiCall(`/stores/${storeId}`, { method: 'PUT', body: JSON.stringify(data) }),
  adminGetAllStores: () => apiCall('/admin/stores'),
  adminToggleStoreStatus: (storeId) => apiCall(`/admin/store/${storeId}/toggle-status`, { method: 'PATCH' }),
  getStoreStats: (storeId) => apiCall(`/stores/${storeId}/stats`),
};

export const productApi = {
  getActiveProducts: () => apiCall('/products'),
  getProductsByStore: (storeId) => apiCall(`/products/store/${storeId}`),
  createProduct: (productData) => apiCall('/products', { method: 'POST', body: JSON.stringify(productData) }),
  deleteProduct: (productId) => apiCall(`/products/${productId}`, { method: 'DELETE' }),
};

export const orderApi = {
  createOrder: (orderData) => apiCall('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
  getStoreOrders: (storeId) => apiCall(`/orders/store/${storeId}`),
  getStoreRevenue: () => apiCall('/orders/store/revenue'),
  getStoreRevenueById: (storeId) => apiCall(`/orders/store/${storeId}/revenue`),
};

export const adminApi = {
  getAllUsers: () => apiCall('/admin/users'),
  getUsersCount: () => apiCall('/admin/users/count'),
  changeUserRole: (userId, role) => apiCall(`/admin/user/${userId}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
  makeUserAdmin: (userId) => apiCall(`/admin/user/${userId}/make-admin`, { method: 'PUT' }),
  adminUpdateProduct: (productId, data) => apiCall(`/admin/products/${productId}`, { method: 'PUT', body: JSON.stringify(data) }),
  adminDeleteProduct: (productId) => apiCall(`/admin/products/${productId}`, { method: 'DELETE' }),
  adminToggleBlockProduct: (productId) => apiCall(`/admin/products/${productId}/toggle-block`, { method: 'PATCH' }),
  adminGetAllProducts: () => apiCall('/admin/products'),
};

export default { apiCall, authApi, storeApi, productApi, orderApi, adminApi };