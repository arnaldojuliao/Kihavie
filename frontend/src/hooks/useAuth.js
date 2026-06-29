import { useAuth as useAuthContext } from "../context/AuthContext";
import { useCallback } from "react";

export const useAuth = () => {
  const context = useAuthContext();

  const loginWithEmail = useCallback(
    async (email, password) => {
      try {
        const user = await context.login({ email, password });
        return { success: true, user };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [context],
  );

  const registerWithData = useCallback(
    async (name, email, password, role = "client") => {
      try {
        const user = await context.register({ name, email, password, role });
        return { success: true, user };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [context],
  );

  const logoutUser = useCallback(async () => {
    try {
      await context.logout();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [context]);

  return {
    user: context.user,
    isAuthenticated: context.isAuthenticated,
    isLoading: context.isLoading,
    isAdmin: context.isAdmin,
    isStoreOwner: context.isStoreOwner,
    userCount: context.userCount,
    loginWithEmail,
    registerWithData,
    logoutUser,
    upgradeToStoreOwner: context.upgradeToStoreOwner,
  };
};
