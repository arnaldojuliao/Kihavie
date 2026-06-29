import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Search from "../pages/Search";
import ProductPage from "../pages/ProductPage";
import StorePage from "../pages/StorePage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import OrderSuccess from "../pages/OrderSuccess";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import UserSettingsPage from "../pages/UserSettingsPage";
import DashboardHome from "../pages/dashboard/DashboardHome";
import MyProducts from "../pages/dashboard/MyProducts";
import AddProduct from "../pages/dashboard/AddProduct";
import MyOrders from "../pages/dashboard/MyOrders";
import StoreSettings from "../pages/dashboard/StoreSettings";
import AdminStoresPage from "../pages/admin/AdminStoresPage";
import AdminStoreDetailPage from "../pages/admin/AdminStoreDetailPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/store/:storeId" element={<StorePage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <UserSettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredRole="storeOwner">
            <DashboardHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/stores"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminStoresPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminUsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/store/:storeId"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminStoreDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/products"
        element={
          <ProtectedRoute requiredRole="storeOwner">
            <MyProducts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/add-product"
        element={
          <ProtectedRoute requiredRole="storeOwner">
            <AddProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/orders"
        element={
          <ProtectedRoute requiredRole="storeOwner">
            <MyOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/settings"
        element={
          <ProtectedRoute requiredRole="storeOwner">
            <StoreSettings />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
