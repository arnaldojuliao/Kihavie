// context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

const getStorageKey = (userId) => {
  return userId ? `cart_user_${userId}` : "cart_guest";
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  // Carregar/mesclar carrinho quando o usuário mudar (login/logout)
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const userId = user?.id || null;
    const userKey = getStorageKey(userId);
    const guestKey = getStorageKey(null);

    const guestCartRaw = localStorage.getItem(guestKey);
    const userCartRaw = localStorage.getItem(userKey);

    if (userId && guestCartRaw) {
      // Usuário logou e havia carrinho de visitante
      const guestCart = JSON.parse(guestCartRaw);
      const userCart = userCartRaw ? JSON.parse(userCartRaw) : [];

      // Mescla: soma quantidades de itens com mesmo id
      const merged = [...userCart];
      guestCart.forEach((guestItem) => {
        const existingIndex = merged.findIndex(
          (item) => item.id === guestItem.id,
        );
        if (existingIndex !== -1) {
          merged[existingIndex].quantity += guestItem.quantity;
        } else {
          merged.push(guestItem);
        }
      });
      localStorage.removeItem(guestKey);
      setCart(merged);
    } else {
      // Sem mesclagem: carrega apenas o carrinho do usuário atual ou visitante
      const raw = userId ? userCartRaw : guestCartRaw;
      let loadedCart = [];
      if (raw) {
        try {
          loadedCart = JSON.parse(raw);
          // Validação básica: garante que é um array
          if (!Array.isArray(loadedCart)) loadedCart = [];
        } catch (e) {
          console.error("Erro ao fazer parse do carrinho salvo:", e);
          // Dados corrompidos: remove a chave do localStorage
          localStorage.removeItem(userId ? userKey : guestKey);
          loadedCart = [];
        }
      }
      setCart(loadedCart);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [user]);

  // Salvar carrinho sempre que ele mudar
  useEffect(() => {
    const userId = user?.id || null;
    const key = getStorageKey(userId);
    try {
      if (cart.length > 0) {
        localStorage.setItem(key, JSON.stringify(cart));
      } else {
        localStorage.removeItem(key);
      }
    } catch (error) {
      if (error.name === "QuotaExceededError") {
        console.error(
          "Carrinho muito grande para salvar. Limite do localStorage excedido.",
        );
        alert(
          "Seu carrinho está muito cheio ou contém imagens pesadas. Remova alguns itens ou limpe o cache.",
        );
        // Opcional: limpar o carrinho ou remover o item mais pesado
      } else {
        console.error("Erro ao salvar carrinho:", error);
      }
    }
  }, [cart, user]);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((product) => product.id === item.id);
      if (existingItem) {
        return prevCart.map((product) =>
          product.id === item.id
            ? {
                ...product,
                quantity: (product.quantity ?? 1) + (item.quantity ?? 1),
              }
            : product,
        );
      }
      return [...prevCart, { ...item, quantity: item.quantity ?? 1 }];
    });
  };

  const updateItemQuantity = (id, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item,
      ),
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + (item.quantity ?? 1), 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1),
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateItemQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
