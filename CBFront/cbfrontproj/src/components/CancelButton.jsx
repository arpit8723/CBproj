// src/components/CancelButton.jsx
import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { resetForm } from "../redux/slices/onboardingSlice";
import { useDispatch } from 'react-redux';  

const CancelButton = ({ sx }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(resetForm()); 

    navigate("/onboarding"); // Adjust if your onboarding start page is on a different route
  };

  return (
    <Button
      variant="outlined"
      color="primary"
      onClick={handleClick}
      sx={sx}
    >
      Cancel
    </Button>
  );
};

export default CancelButton;
