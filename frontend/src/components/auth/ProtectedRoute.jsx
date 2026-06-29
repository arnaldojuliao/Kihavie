import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState, useRef, useTransition } from "react";

function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user, isLoading, refreshUser } = useAuth();
  const [freshUser, setFreshUser] = useState(null);
  const [isPending, startTransition] = useTransition();
  const checkedRef = useRef(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated && requiredRole && !checkedRef.current) {
      // Verificar se o utilizador tem o role necessário; se não, tentar re-sincronizar
      const hasRequiredRole =
        requiredRole === "admin"
          ? user?.role === "admin"
          : requiredRole === "storeOwner"
            ? user?.role === "admin" || user?.canCreateStore
            : true;

      if (!hasRequiredRole && refreshUser) {
        checkedRef.current = true;
        refreshUser().then((updatedUser) => {
          startTransition(() => {
            setFreshUser(updatedUser);
          });
        });
      }
    }
  }, [isLoading, isAuthenticated, user, requiredRole, refreshUser]);

  if (isLoading || isPending) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const currentUser = freshUser || user;

  if (requiredRole === "admin" && currentUser?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  const canCreateStore = currentUser?.canCreateStore ?? false;

  if (
    requiredRole === "storeOwner" &&
    currentUser?.role !== "admin" &&
    !canCreateStore
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
