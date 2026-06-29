// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import {
  getCurrentUser,
  login as authLogin,
  register as authRegister,
  logout as authLogout,
  upgradeToStoreOwner as authUpgradeToStoreOwner,
  updateUserProfile,
  updateProfileImage as updateProfileImageService,
} from "../services/authService";

const AuthContext = createContext();

const compressImageAsync = (dataUrl, maxWidth, quality) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      const compressed = canvas.toDataURL("image/jpeg", quality);
      resolve(compressed);
    };
    img.src = dataUrl;
  });
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  // profileImage agora é derivado de user.profileImage via profileImageValue

  // Carregar usuário ao iniciar
  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      const userData = await getCurrentUser();
      setUser(userData);
      setIsLoading(false);
    };
    loadUser();
  }, []);

  const profileImageValue = user?.profileImage || null;

  const login = async ({ email, password }) => {
    setIsLoggingIn(true);
    try {
      const loggedUser = await authLogin({ email, password });
      setUser(loggedUser);
      return loggedUser;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const register = async ({ name, email, password, role = "client", phone }) => {
    const newUser = await authRegister({ name, email, password, role, phone });
    setUser(newUser);
    return newUser;
  };

  const upgradeToStoreOwner = async () => {
    if (!user) return null;
    const updatedUser = await authUpgradeToStoreOwner();
    setUser(updatedUser);
    return updatedUser;
  };

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await authLogout();
      setUser(null);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const updateUser = async (updates) => {
    if (!user) return null;
    const updatedUser = await updateUserProfile(updates);
    setUser(updatedUser);
    return updatedUser;
  };

  const updateProfileImage = async (imageDataUrl) => {
    if (!user?.id) return;
    try {
      let finalImage = imageDataUrl;
      const approxSize = imageDataUrl.length * 0.75;
      if (approxSize > 4 * 1024 * 1024) {
        finalImage = await compressImageAsync(imageDataUrl, 800, 0.7);
      }
      const imageUrl = await updateProfileImageService(finalImage);
      // Atualiza o usuário com a nova imagem (profileImage é derivado)
      setUser((prev) => ({ ...prev, profileImage: imageUrl }));
    } catch (err) {
      console.error("Erro ao salvar imagem:", err);
      alert("Erro ao salvar imagem. Tente uma imagem menor.");
    }
  };

  const refreshUser = async () => {
    const userData = await getCurrentUser();
    setUser(userData);
    return userData;
  };

  const isAuthenticated = Boolean(user);
  const isAdmin = user?.role === "admin";
  const isStoreOwner = Boolean(user?.canCreateStore || user?.role === "admin");
  const storeid = user?.storeId || null;

  return (
    <AuthContext.Provider
      value={{
        user,
        profileImage: profileImageValue,
        updateProfileImage,
        login,
        register,
        logout,
        updateUser,
        upgradeToStoreOwner,
        refreshUser,
        isAuthenticated,
        isLoading,
        isLoggingIn,
        isLoggingOut,
        isAdmin,
        isStoreOwner,
        storeid,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};