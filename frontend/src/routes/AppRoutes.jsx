import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";

const Home = lazy(() => import("../pages/Home"));
const Search = lazy(() => import("../pages/Search"));
const ProductPage = lazy(() => import("../pages/ProductPage"));
const StorePage = lazy(() => import("../pages/StorePage"));
const CartPage = lazy(() => import("../pages/CartPage"));
const CheckoutPage = lazy(() => import("../pages/CheckoutPage"));
const OrderSuccess = lazy(() => import("../pages/OrderSuccess"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const AboutPage = lazy(() => import("../pages/AboutPage"));
const ContactPage = lazy(() => import("../pages/ContactPage"));
const UserSettingsPage = lazy(() => import("../pages/UserSettingsPage"));
const DashboardHome = lazy(() => import("../pages/dashboard/DashboardHome"));
const MyProducts = lazy(() => import("../pages/dashboard/MyProducts"));
const AddProduct = lazy(() => import("../pages/dashboard/AddProduct"));
const MyOrders = lazy(() => import("../pages/dashboard/MyOrders"));
const StoreSettings = lazy(() => import("../pages/dashboard/StoreSettings"));
const AdminStoresPage = lazy(() => import("../pages/admin/AdminStoresPage"));
const AdminStoreDetailPage = lazy(() => import("../pages/admin/AdminStoreDetailPage"));
const AdminUsersPage = lazy(() => import("../pages/admin/AdminUsersPage"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-baseline justify-center">
          <span className="text-4xl font-bold text-blue-700">K</span>
          <span className="text-2xl font-bold text-blue-500">i</span>
        </div>
        <div className="flex gap-1.5">
          <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
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
    </Suspense>
  );
}

export default AppRoutes;
