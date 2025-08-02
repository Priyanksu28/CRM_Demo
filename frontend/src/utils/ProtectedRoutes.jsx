import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ProtectedRoutes = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const user = useSelector((state) => state.auth.user);

  if (!token) {
    return <Navigate to="/" />;
  }

  // if (requiredRole && user?.role !== requiredRole) {
  //   toast.info("This is protected route");
  //   return <Navigate to="/" />;
  // }

  return children;
};

export default ProtectedRoutes;
