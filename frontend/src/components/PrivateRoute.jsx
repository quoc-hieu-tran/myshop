// src/components/PrivateRoute.jsx
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
const PrivateRoute = () => {
  // Expecting state.auth.userInfo to be set when logged in
  const { userInfo } = useSelector((state) => state.auth);
  // If logged in → render the nested route (Outlet). Otherwise → jump to /login.
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
