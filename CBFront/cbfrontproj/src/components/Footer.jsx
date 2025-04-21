import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 1,
        px: 2,
        bgcolor: 'grey.100',
        borderTop: '1px solid #e0e0e0',
        mt: 'auto',
        width: '100%',
      }}
    >
      <Box
        sx={{
          maxWidth: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.875rem',
        }}
      >
        <Typography variant="body2" noWrap>
          Have Questions?{' '}
          <Link
            href="mailto:support@cloudbalance.com"
            underline="hover"
            color="primary"
          >
            Talk to our team
          </Link>
        </Typography>

        <Typography variant="body2" color="text.secondary" noWrap>
          CloudBalance 2025 | All Rights Reserved
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
