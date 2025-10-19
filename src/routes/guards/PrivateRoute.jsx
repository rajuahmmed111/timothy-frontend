import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
  const accessToken = useSelector((s) => s?.auth?.accessToken);
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/logIn" state={{ from: location }} replace />;
  }
  return children;
};

export default PrivateRoute;
