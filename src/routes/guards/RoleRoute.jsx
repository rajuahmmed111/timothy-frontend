import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RoleRoute = ({ children, allowed = [] }) => {
  const accessToken = useSelector((s) => s?.auth?.accessToken);
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/logIn" state={{ from: location }} replace />;
  }

  // Decode JWT payload without external deps
  let role = undefined;
  try {
    const base64Url = accessToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const payload = JSON.parse(jsonPayload);
    role = payload?.role;
  } catch {
    role = undefined;
  }

  if (allowed.length && !allowed.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleRoute;
