import React from "react";
import {
  Box,
  Typography,
  Paper,
  Popover,
  TextField,
  Button
} from "@mui/material";
import DateRangeIcon from '@mui/icons-material/DateRange';

const DateRangePicker = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  formatDateDisplay
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleApply = () => {
    handleClose();
    
  };

  return (
    <>
      <Paper 
        variant="outlined"
        sx={{ 
          display: "flex", 
          alignItems: "center", 
          p: 1,
          cursor: "pointer",
          '&:hover': {
            backgroundColor: '#f5f5f5'
          }
        }}
        onClick={handleClick}
      >
        <DateRangeIcon sx={{ mr: 1, color: "text.secondary" }} />
        <Typography variant="body2">
          {formatDateDisplay(startDate)} - {formatDateDisplay(endDate)}
        </Typography>
      </Paper>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ p: 2, width: 300 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            Select Date Range
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              Start Date
            </Typography>
            <TextField
              type="date"
              value={startDate}
              onChange={onStartDateChange}
              fullWidth
              size="small"
              inputProps={{ max: endDate }}
            />
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              End Date
            </Typography>
            <TextField
              type="date"
              value={endDate}
              onChange={onEndDateChange}
              fullWidth
              size="small"
              inputProps={{ min: startDate }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleClose} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button onClick={handleApply} variant="contained" color="primary">
              Apply
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default DateRangePicker;