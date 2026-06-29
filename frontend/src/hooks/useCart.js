import { useCart as useCartContext } from "../context/CartContext";
import { useCallback, useMemo } from "react";

export const useCart = () => {
  const context = useCartContext();

  const addItem = useCallback(
    (item) => {
      if (!item.id || !item.name) {
        throw new Error("Item must have id and name");
      }
      context.addToCart(item);
    },
    [context],
  );

  const updateQuantity = useCallback(
    (id, quantity) => {
      if (quantity < 1) {
        context.removeFromCart(id);
      } else {
        context.updateItemQuantity(id, quantity);
      }
    },
    [context],
  );

  const removeItem = useCallback(
    (id) => {
      context.removeFromCart(id);
    },
    [context],
  );

  const isEmpty = useMemo(() => context.cart.length === 0, [context.cart]);

  const hasItem = useCallback(
    (id) => context.cart.some((item) => item.id === id),
    [context.cart],
  );

  const getItem = useCallback(
    (id) => context.cart.find((item) => item.id === id),
    [context.cart],
  );

  return {
    cart: context.cart,
    totalItems: context.totalItems,
    totalPrice: context.totalPrice,
    isEmpty,
    addItem,
    updateQuantity,
    removeItem,
    hasItem,
    getItem,
    clearCart: context.clearCart,
  };
};
