// PageTracker.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { sidebarConfig } from '../Config/sidebarConfig';


const PageTracker = () => {
  const location = useLocation();
  const { role } = useSelector((state) => state.auth);
  
  useEffect(() => {
    // Only track allowed pages
    if (role && sidebarConfig[role]) {
      const allowedPaths = sidebarConfig[role].map(item => item.path);
      if (allowedPaths.includes(location.pathname)) {
        sessionStorage.setItem('lastValidPage', location.pathname);
      }
    }
  }, [location.pathname, role]);
  
  return null; // This component doesn't render anything
};

export default PageTracker;