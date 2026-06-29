import { createContext, useContext, useState, useEffect } from "react";
import { getAllProducts, createProduct, deleteProductById } from "../services/productService";
import { getActiveStoreIds } from "../services/storeService";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStoreIds, setActiveStoreIds] = useState([]);

  useEffect(() => {
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
        setActiveStoreIds(storeIds);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Adicionar produto via API
  const addProduct = async (productData) => {
    try {
      const newProduct = await createProduct(productData);
      const normalized = { ...newProduct, id: newProduct.id, storeId: newProduct.storeId };
      setProducts(prev => [normalized, ...prev]);
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
        setActiveStoreIds(storeIds);
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