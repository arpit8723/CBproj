// components/SessionTimeoutDialog.js
import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  Button,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';

// Custom styled components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    padding: 0,
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
    width: '400px',
    maxWidth: '90vw',
  },
  '& .MuiBackdrop-root': {
    backdropFilter: 'blur(8px)',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  }
}));

const DialogHeader = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(2, 3),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const DialogIconContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  padding: theme.spacing(3, 0, 1, 0),
}));

const SessionDialogBox = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleTimeout = () => {
      setOpen(true);
      localStorage.removeItem('token'); // Optional
    };
    
    window.addEventListener('session-timeout', handleTimeout);
    return () => window.removeEventListener('session-timeout', handleTimeout);
  }, []);
  
  const handleRedirect = () => {
    setOpen(false);
    navigate('/');
  };
  
  const handleClose = () => {
    setOpen(false);
    navigate('/');
  };
  
  return (
    <StyledDialog 
      open={open} 
      onClose={handleClose}
      aria-labelledby="session-timeout-dialog-title"
    >
      <DialogHeader>
        <Typography variant="h6" id="session-timeout-dialog-title">
          Session Expired
        </Typography>
        <IconButton 
          edge="end" 
          color="inherit" 
          onClick={handleClose} 
          aria-label="close"
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogHeader>
      
      <DialogIconContainer>
        <AccessTimeIcon color="primary" sx={{ fontSize: 64 }} />
      </DialogIconContainer>
      
      <DialogContent sx={{ px: 3, py: 2 }}>
        <Typography variant="body1" align="center" paragraph>
          Your session has timed out due to inactivity.
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary">
          Please log in again to continue working.
        </Typography>
      </DialogContent>
      
      <Box sx={{ p: 3, pt: 0, display: 'flex', justifyContent: 'center' }}>
        <Button 
          onClick={handleRedirect} 
          variant="contained" 
          color="primary"
          size="large"
          sx={{ 
            borderRadius: 28,
            px: 4,
            textTransform: 'none',
            fontSize: '1rem'
          }}
        >
          Login 
        </Button>
      </Box>
    </StyledDialog>
  );
};

export default SessionDialogBox;