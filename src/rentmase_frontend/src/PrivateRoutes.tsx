import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./hooks/Context";

const PrivateRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  return <div>{isAuthenticated && user ? <Outlet /> : <Navigate to="/signup" />}</div>;
};

export default PrivateRoutes;
