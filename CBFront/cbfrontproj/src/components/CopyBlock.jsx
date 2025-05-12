// components/CopyBlock.jsx
import React, { useState } from "react";
import { Box, Typography, Snackbar, Alert, IconButton, Paper } from "@mui/material";
import { FiCopy } from "react-icons/fi";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const CopyBlock = ({ value, fontSize = 14 }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setOpenSnackbar(true);
  };


  return (
    <>
      <Paper
        variant="outlined"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        sx={{
          px: 3,
          py:1,
          ml:3,
          display: "inline-flex",
          alignItems: "center",
          borderRadius: "6px",
          backgroundColor: "#fff",
          borderColor: "#1976d2",
          boxShadow: "none",
          gap: 1,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontFamily: "source-code-pro, monospace",
            fontSize,
            color: "#1976d2",
          }}
        >
          {value}
        </Typography>
        <Box
          sx={{
            backgroundColor: hovered ? "#115293" : "#e3f2fd",
            borderRadius: "1px",
            p: "3px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background-color 0.2s ease-in-out",
            cursor: "pointer",
          }}
          onClick={handleCopy}
        >
          <FiCopy size={16} color={hovered ? "#fff" : "#1976d2"} />
        </Box>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: 12, mr: 2 }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          icon={<CheckCircleIcon fontSize="inherit" />}
          sx={{ width: '100%' }}
        >
         Data Copied
        </Alert>
      </Snackbar>
    </>
  );
};

export default CopyBlock;
