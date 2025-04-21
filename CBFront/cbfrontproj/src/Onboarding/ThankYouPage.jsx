import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Button 
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Link as RouterLink } from 'react-router-dom';

const ThankYouPage = () => {
  return (
    <Container 
      maxWidth="md" 
      disableGutters
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        overflow: 'hidden' 
      }}
    >
      <Paper 
        elevation={0} 
        sx={{ 
          width: '100%', 
          py: 5, 
          textAlign: 'center', 
          transform: 'translateY(-140px)' // move card a bit up
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Box 
            sx={{ 
              bgcolor: 'rgba(76, 175, 80, 0.1)', 
              borderRadius: '50%', 
              p: 1.5, 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center' 
            }}
          >
            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 40 }} />
          </Box>
        </Box>
        
        <Typography variant="h5" component="h1" fontWeight="500" gutterBottom>
          Thank You For CUR Access!
        </Typography>
        
        <Typography variant="body1" sx={{ mt: 2 }}>
          If you have additional accounts to onboard, please click {' '}
          <RouterLink to="/onboarding" style={{ textDecoration: 'underline', color: '#1976d2' }}>
            Onboard
          </RouterLink> to proceed.
        </Typography>
        
        <Paper 
          variant="outlined" 
          sx={{ 
            bgcolor: 'rgba(25, 118, 210, 0.05)', 
            p: 3, 
            mt: 3, 
            mx: 'auto', 
            maxWidth: '80%',
            borderRadius: 1,
            borderColor: 'rgba(25, 118, 210, 0.2)' 
          }}
        >
          <Typography variant="body1">
            Alternatively, you can begin onboarding your accounts on Tuner to receive usage-based recommendations.
          </Typography>
          <Button 
            variant="text" 
            color="primary"
            sx={{ mt: 1 }}
            component={RouterLink}
            to="/onboarding"
          >
            Start Onboarding on Tuner
          </Button>
        </Paper>
      </Paper>
    </Container>
  );
};

export default ThankYouPage;
