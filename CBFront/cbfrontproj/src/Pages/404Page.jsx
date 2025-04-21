import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { sidebarConfig } from '../Config/sidebarConfig';

import { Box, Typography, CircularProgress, Fade } from '@mui/material';
import { FaSadTear } from 'react-icons/fa';

const NotFoundPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, role } = useSelector((state) => state.auth);

  const [counter, setCounter] = useState(5);
  const [fadeIn, setFadeIn] = useState(false);

  const lastValidPage = sessionStorage.getItem('lastValidPage');

  const getSafeRedirectPath = () => {
    if (!token) return '/';
    if (!role || !sidebarConfig[role]) return '/';

    const allowedPaths = sidebarConfig[role].map((item) => item.path);
    if (lastValidPage && allowedPaths.includes(lastValidPage)) {
      return lastValidPage;
    }

    return sidebarConfig[role][0].path;
  };

  const redirectPath = getSafeRedirectPath();

  useEffect(() => {
    setFadeIn(true);

    const interval = setInterval(() => {
      setCounter((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      navigate(redirectPath, { replace: true });
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate, redirectPath]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      textAlign="center"
      bgcolor="#f3f4f6"
      px={2}
    >
      <Fade in={fadeIn} timeout={600}>
        <Box>
          <FaSadTear size={80} color="#6b7280" className="mb-4 animate-bounce" />

          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#374151' }}>
            Oops! Page Not Found
          </Typography>

          <Typography variant="body1" sx={{ mb: 2, color: '#6b7280' }}>
            You don't have permission to access this page or it doesn’t exist.
          </Typography>

          <Typography variant="body2" sx={{ color: '#6b7280' }}>
            Redirecting you in <span style={{ fontWeight: 'bold', color: '#3b82f6' }}>{counter}</span> seconds...
          </Typography>

          <Box mt={4} position="relative" display="inline-flex">
            <CircularProgress
              variant="determinate"
              value={(counter / 5) * 100}
              size={80}
              thickness={5}
              sx={{ color: '#3b82f6' }}
            />
            <Box
              top={0}
              left={0}
              bottom={0}
              right={0}
              position="absolute"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Typography variant="subtitle1" sx={{ color: '#374151' }}>
                {counter}s
              </Typography>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Box>
  );
};

export default NotFoundPage;
