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
  const { token, role } = useSelector((state) => state.auth); 
  const location = useLocation();
  

  if (!token) {
    return <Navigate to="/" />;
  }
  

  const allowedPaths = sidebarConfig[role]?.map(item => item.path) || [];
  

  const currentPath = location.pathname;
  const isPathAllowed = allowedPaths.some(path => 
    currentPath === path || currentPath.startsWith(`${path}/`)
  );
  
 
  if (!isPathAllowed) {
    return <Navigate to="/404" state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;