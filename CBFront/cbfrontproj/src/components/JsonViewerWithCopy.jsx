import React, { useState } from 'react';
import { Paper, Button, Snackbar, Alert } from '@mui/material';
import { FiCopy } from 'react-icons/fi';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const JsonViewerWithCopy = ({ jsonText }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonText);
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <>
      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          mt: 1,
          p: 2,
          fontFamily: 'source-code-pro, monospace',
          fontSize: 13,
          bgcolor: '#f5f5f5',
          position: 'relative',
          height: 300,
          overflowY: 'auto',
          color: 'primary.main',
        }}
      >
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{jsonText}</pre>
        <Button
          onClick={handleCopy}
          variant="text"
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            minWidth: 'auto',
          }}
          aria-label="Copy JSON"
        >
          <FiCopy />
        </Button>
      </Paper>

      <Snackbar
        open={copied}
        autoHideDuration={3000}
        onClose={() => setCopied(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: 12, mr: 2 }}
      >
        <Alert
          onClose={() => setCopied(false)}
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

export default JsonViewerWithCopy;
