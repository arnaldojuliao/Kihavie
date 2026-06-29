import { productApi } from './api';

// Normaliza produto (converte _id para id)
const normalizeProduct = (product) => {
  if (!product) return null;
  return {
    ...product,
    id: product.id,
    storeId: product.storeId?.id || product.storeId,
  };
};

export const getAllProducts = async () => {
  const products = await productApi.getActiveProducts();
  return products.map(normalizeProduct);
};

export const getProductsByStoreId = async (storeId) => {
  const products = await productApi.getProductsByStore(storeId);
  return products.map(normalizeProduct);
};

export const createProduct = async (productData) => {
  const newProduct = await productApi.createProduct(productData);
  return normalizeProduct(newProduct);
};

export const deleteProductById = async (productId) => {
  await productApi.deleteProduct(productId);
  window.dispatchEvent(new Event('products-updated'));
  return true;
};

// Para compatibilidade
export const saveProducts = () => {};