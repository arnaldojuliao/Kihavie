import { storeApi } from './api';

// Helper: normaliza loja (converte _id para id)
const normalizeStore = (store) => {
  if (!store) return null;
  return {
    ...store,
    id: store.id,
  };
};

// Cache simples (opcional)
let storesCache = null;
let storesCacheTime = 0;
const CACHE_TTL = 60000;

const getStoresFromApi = async (forceRefresh = false) => {
  if (!forceRefresh && storesCache && (Date.now() - storesCacheTime) < CACHE_TTL) {
    return storesCache;
  }
  const stores = await storeApi.getActiveStores();
  const normalized = stores.map(normalizeStore);
  storesCache = normalized;
  storesCacheTime = Date.now();
  return normalized;
};

export const getStores = async () => {
  return getStoresFromApi();
};

export const getAllStores = async () => {
  // Admin pode usar endpoint admin; por segurança usamos o público
  try {
    const stores = await storeApi.adminGetAllStores();
    return stores.map(normalizeStore);
  } catch (err) {
    console.warn('Falha ao buscar lojas via admin, usando endpoint público:', err);
    const stores = await storeApi.getActiveStores();
    return stores.map(normalizeStore);
  }
};

export const getStoreById = async (storeId) => {
  try {
    const store = await storeApi.getStoreById(storeId);
    return normalizeStore(store);
  } catch (err) {
    console.error('Erro ao buscar loja:', err);
    return null;
  }
};

export const getStoreByOwnerEmail = async (ownerEmail) => {
  const stores = await getStoresFromApi();
  return stores.find(store => store.ownerEmail === ownerEmail) || null;
};

export const updateStore = async (storeId, updates) => {
  const updated = await storeApi.updateStore(storeId, updates);
  storesCache = null;
  window.dispatchEvent(new Event('stores-updated'));
  return normalizeStore(updated);
};

export const updateStoreStatus = async (storeId) => {
  const result = await storeApi.adminToggleStoreStatus(storeId);
  storesCache = null;
  window.dispatchEvent(new Event('stores-updated'));
  return result;
};

export const getActiveStoreIds = async () => {
  const stores = await getStoresFromApi();
  return stores.filter(store => store.status === 'active').map(store => store.id);
};

export const getStoreStats = async (storeId) => {
  const stats = await storeApi.getStoreStats(storeId);
  return stats;
};