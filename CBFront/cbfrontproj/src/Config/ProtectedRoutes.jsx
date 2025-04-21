// import { Navigate, Outlet } from "react-router-dom";

// const ProtectedRoutes = () => {
//     const isAuthenticated = !!localStorage.getItem("token"); // Check if token exists
//     return isAuthenticated ? <Outlet /> : <Navigate to="/" />;

// };

// export default ProtectedRoutes;


// import { useSelector } from 'react-redux';
// import { Navigate, Outlet } from 'react-router-dom';

// const ProtectedRoutes = () => {
//   // Get auth state from Redux instead of localStorage
//   const { token } = useSelector((state) => state.auth);
  
  
//   return token ? <Outlet /> : <Navigate to="/" />;
// };

// export default ProtectedRoutes;

import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { sidebarConfig } from './sidebarConfig';


const ProtectedRoutes = () => {
  const { token, role } = useSelector((state) => state.auth); // Assuming you store user role in Redux
  const location = useLocation();
  
  // If not authenticated, redirect to login
  if (!token) {
    return <Navigate to="/" />;
  }
  
  // Get allowed paths for current user role
  const allowedPaths = sidebarConfig[role]?.map(item => item.path) || [];
  
  // Check if current path is allowed for user role
  const currentPath = location.pathname;
  const isPathAllowed = allowedPaths.some(path => 
    currentPath === path || currentPath.startsWith(`${path}/`)
  );
  
  // If path is not allowed, redirect to 404
  if (!isPathAllowed) {
    return <Navigate to="/404" state={{ from: location }} />;
  }
  // If authenticated and path is allowed, render child routes
  return <Outlet />;
};

export default ProtectedRoutes;