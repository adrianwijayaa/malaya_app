import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("adminAuth") === "true";

  if (!isAuthenticated) {
    return <Navigate to="/admin/auth" replace />; // 🟢 ubah dari /admin/login
  }

  return children;
};

export default ProtectedRoute;
