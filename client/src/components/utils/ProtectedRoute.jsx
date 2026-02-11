import { Navigate } from "react-router-dom";
import { useAdmin } from "./adminContext";

const ProtectedRoute = ({ children }) => {
  const { adminUid } = useAdmin();

  if (!adminUid) {
    return <Navigate to="/login-admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
