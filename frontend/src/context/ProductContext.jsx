import { createContext, useContext, useState, useEffect } from "react";
import { getAllProducts, createProduct, deleteProductById } from "../services/productService";
import { getActiveStoreIds } from "../services/storeService";

const ProductContext = createContext();

const CACHE_KEY_PRODUCTS = "kihavie_products";
const CACHE_KEY_STORE_IDS = "kihavie_active_store_ids";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

const loadFromCache = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
};

const saveToCache = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // localStorage cheio, ignora
  }
};

export const ProductProvider = ({ children }) => {
  // Inicializa com cache se disponível
  const cachedProducts = loadFromCache(CACHE_KEY_PRODUCTS);
  const cachedStoreIds = loadFromCache(CACHE_KEY_STORE_IDS);

  const [products, setProducts] = useState(cachedProducts || []);
  const [loading, setLoading] = useState(!cachedProducts);
  const [activeStoreIds, setActiveStoreIds] = useState(cachedStoreIds || []);

  useEffect(() => {
    // Se já tem cache, não precisa carregar
    if (cachedProducts && cachedStoreIds) {
      return;
    }

    const loadProducts = async () => {
      try {
        const [allProducts, storeIds] = await Promise.all([
          getAllProducts(),
          getActiveStoreIds()
        ]);
        const normalizedProducts = allProducts.map(p => ({
          ...p,
          id: p.id,
          storeId: p.storeId
        }));
        setProducts(normalizedProducts);
        saveToCache(CACHE_KEY_PRODUCTS, normalizedProducts);
        setActiveStoreIds(storeIds);
        saveToCache(CACHE_KEY_STORE_IDS, storeIds);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Adicionar produto via API
  const addProduct = async (productData) => {
    try {
      const newProduct = await createProduct(productData);
      const normalized = { ...newProduct, id: newProduct.id, storeId: newProduct.storeId };
      setProducts(prev => [normalized, ...prev]);
      localStorage.removeItem(CACHE_KEY_PRODUCTS);
      return normalized;
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      throw error;
    }
  };

  // Deletar produto via API
  const deleteProduct = async (productId) => {
    try {
      await deleteProductById(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      localStorage.removeItem(CACHE_KEY_PRODUCTS);
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      throw error;
    }
  };

  // Refrescar lista (útil após atualizações externas)
  const refreshProducts = () => {
    setLoading(true);
    const loadProducts = async () => {
      try {
        const [allProducts, storeIds] = await Promise.all([
          getAllProducts(),
          getActiveStoreIds()
        ]);
        const normalizedProducts = allProducts.map(p => ({
          ...p,
          id: p.id,
          storeId: p.storeId
        }));
        setProducts(normalizedProducts);
        saveToCache(CACHE_KEY_PRODUCTS, normalizedProducts);
        setActiveStoreIds(storeIds);
        saveToCache(CACHE_KEY_STORE_IDS, storeIds);
      } catch (error) {
        console.error("Erro ao recarregar produtos:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  };

// Dentro de ProductContext.jsx
const activeProducts = products.filter(product => {
  if (activeStoreIds.length === 0) return true; // fallback: mostra tudo
  return activeStoreIds.includes(product.storeId);
});

  return (
    <ProductContext.Provider
      value={{
        products,
        activeProducts,
        loading,
        addProduct,
        deleteProduct,
        refreshProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProducts must be used within a ProductProvider");
  return context;
};