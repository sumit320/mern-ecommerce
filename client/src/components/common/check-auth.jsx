import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  const redirectBasedOnRole = (role) =>
    role === "admin" ? "/admin/dashboard" : "/shop/home";

  // Not authenticated → go to login
  if (!isAuthenticated || !user) {
    if (
      !location.pathname.includes("/login") &&
      !location.pathname.includes("/register")
    ) {
      return <Navigate to="/auth/login" replace />;
    }
  }

  // Authenticated at root → redirect based on role
  if (location.pathname === "/") {
    return <Navigate to={redirectBasedOnRole(user?.role)} replace />;
  }

  // Authenticated trying to access login/register → redirect to dashboard/home
  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    return <Navigate to={redirectBasedOnRole(user.role)} replace />;
  }

  // Role-based access control
  if (isAuthenticated) {
    if (user?.role !== "admin" && location.pathname.startsWith("/admin")) {
      return <Navigate to="/unauth-page" replace />;
    }
    if (user?.role === "admin" && location.pathname.startsWith("/shop")) {
      return <Navigate to={redirectBasedOnRole(user.role)} replace />;
    }
  }

  // Otherwise, allowed — render the children
  return <>{children}</>;
}

export default CheckAuth;
