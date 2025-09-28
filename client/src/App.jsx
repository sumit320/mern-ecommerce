import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./store/auth-slice";

import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";

import AdminLayout from "./components/admin/layout";
import AdminDashboard from "./pages/auth/admin/dashboard";
import AdminProducts from "./pages/auth/admin/products";
import AdminOrders from "./pages/auth/admin/orders";
import AdminFeatures from "./pages/auth/admin/features";

import ShoppingLayout from "./components/shopping/layout";
import ShoppingHome from "./pages/shopping/home.jsx";
import ShoppingListing from "./pages/shopping/listing";
import ShoppingCheckout from "./pages/shopping/checkout";
import ShoppingAccount from "./pages/shopping/account";

import NotFound from "./pages/not-found";
import UnauthPage from "./pages/unauth-page";
import CheckAuth from "./components/common/check-auth";
import { Skeleton } from "@/components/ui/skeleton";
import PaypalReturnPage from "./pages/shopping/paypal-return";
import PaymentSuccessPage from "./pages/shopping/payment-success";
import SearchProducts from "./pages/shopping/search";

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Skeleton className="w-[800px] h-[600px] bg-black" />
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden bg-white dark:bg-gray-950">
      <Routes>
        {/* Root redirect based on role */}
        <Route
          path="/"
          element={
            isLoading ? (
              <Skeleton className="w-[800px] h-[600px] bg-black" />
            ) : isAuthenticated ? (
              <Navigate
                to={user?.role === "admin" ? "/admin/dashboard" : "/shop/home"}
                replace
              />
            ) : (
              <Navigate to="/auth/login" replace />
            )
          }
        />

        {/* Auth routes */}
        <Route
          path="/auth/*"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
          <Route path="*" element={<Navigate to="login" replace />} />
        </Route>

        {/* Admin routes */}
        <Route
          path="/admin/*"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Shop routes */}
        <Route
          path="/shop/*"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="paypal-return" element={<PaypalReturnPage />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="search" element={<SearchProducts />} />
          <Route path="*" element={<Navigate to="home" replace />} />
        </Route>

        {/* Unauthorized page */}
        <Route path="/unauth-page" element={<UnauthPage />} />

        {/* Fallback 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
