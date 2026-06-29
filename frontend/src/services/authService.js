// services/authService.js
import { authApi } from './api';

const normalizeUser = (backendUser) => {
  if (!backendUser) return null;
  return {
    id: backendUser.id || backendUser.id,
    _id: backendUser.id,
    name: backendUser.name,
    email: backendUser.email,
    role: backendUser.role,
    canCreateStore: backendUser.role === 'storeOwner' || backendUser.canCreateStore === true,
    storeId: backendUser.storeId?._id || backendUser.storeId,
    phone: backendUser.phone || '',
    profileImage: backendUser.profileImage || '',
    createdAt: backendUser.createdAt,
  };
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const data = await authApi.getMe(); // data = user object
    const user = normalizeUser(data);
    return user;
  } catch (err) {
    console.error('Erro ao buscar usuário:', err);
    localStorage.removeItem('token');
    return null;
  }
};

export const login = async ({ email, password }) => {
  const data = await authApi.login(email, password); // { token }
  if (!data.token) throw new Error('Token não recebido');
  localStorage.setItem('token', data.token);
  const user = await getCurrentUser();
  return user;
};

export const register = async ({ name, email, password, role = 'client', phone = '' }) => {
  const data = await authApi.register({ name, email, password, role, phone }); // { user, token }
  if (!data.token) throw new Error('Token não recebido');
  localStorage.setItem('token', data.token);
  const user = normalizeUser(data.user);
  return user;
};

export const logout = async () => {
  localStorage.removeItem('token');
};

export const upgradeToStoreOwner = async () => {
  const data = await authApi.upgradeToStoreOwner(); // { user, token }
  if (data.token) localStorage.setItem('token', data.token);
  const user = normalizeUser(data.user);
  // Salva também no localStorage para cache
  localStorage.setItem('kihavie_user', JSON.stringify(user));
  return user;
};

export const updateUserProfile = async (updates) => {
  const data = await authApi.updateProfile(updates); // { user }
  const user = normalizeUser(data.user);
  return user;
};

export const updateProfileImage = async (imageBase64) => {
  const data = await authApi.updateProfileImage(imageBase64); // { profileImage, user }
  return data.profileImage;
};

// Funções mock (se não existirem no backend)
export const getUsersCount = () => Promise.resolve(0);
export const loadUsers = () => Promise.resolve([]);
export const saveUsers = () => Promise.resolve();
export const deleteUser = () => Promise.resolve();
export const updateUser = () => Promise.resolve();

export default {
  getCurrentUser,
  login,
  register,
  logout,
  upgradeToStoreOwner,
  updateUserProfile,
  updateProfileImage,
  getUsersCount,
  loadUsers,
  saveUsers,
  deleteUser,
  updateUser,
};