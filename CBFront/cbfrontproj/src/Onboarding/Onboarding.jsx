import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { FiArrowRight, FiSettings } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom'; 

const Onboarding = () => {
  const navigate = useNavigate(); 

  const handleNext = () => {
    navigate('/onboarding/Process'); 
  };

  return (
    <Box
      sx={{
        height: '84vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: 6,
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        gutterBottom
        textAlign="center"
        mb={4}
      >
        Get started with cloud account onboarding process
      </Typography>

      <Card
        sx={{
          width: 300,
          textAlign: 'center',
          borderRadius: 4,
          boxShadow: 3,
          paddingY: 4,
        }}
      >
        <CardContent>
          <Box
            sx={{
              backgroundColor: '#eef2ff',
              width: 70,
              height: 70,
              borderRadius: '50%',
              margin: '0 auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <FiSettings size={36} color="#6366f1" />
          </Box>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Manual
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Follow step-by-step instructions
          </Typography>
        </CardContent>

        <Button
          onClick={handleNext}
          sx={{
            mt: 3,
            borderRadius: '50%',
            minWidth: 48,
            height: 48,
            backgroundColor: '#eef2ff',
            color: '#6366f1',
            '&:hover': {
              backgroundColor: '#e0e7ff',
            },
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FiArrowRight size={20} />
        </Button>
      </Card>
    </Box>
  );
};

export default Onboarding;
