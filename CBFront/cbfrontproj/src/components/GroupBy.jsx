import { useState } from "react";
import {
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
  CircularProgress
} from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'; // Icon for 'More'

function GroupBy({ 
  columns = [],  
  loading = false, 
  selectedGroupBy = "", 
  onGroupBySelect 
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMoreClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoreClose = () => {
    setAnchorEl(null);
  };
  const formatLabel = (text) =>
    text.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const firstSeven = columns.slice(0, 7);
  const remaining = columns.slice(7);

  return (
    <Box sx={{ 
      display: "flex", 
      alignItems: "center", 
      flexWrap: "wrap", 
      gap: 1, 
      flex: 1
    }}>
      <Typography 
        variant="body2" 
        sx={{ fontWeight: 600, mr: 1 }}
      >
        Group By:
      </Typography>

      {loading ? (
        <CircularProgress size={20} />
      ) : (
        <>
          {firstSeven.map((col) => (
            <Button 
              key={col} 
              variant={selectedGroupBy === col ? "contained" : "outlined"} 
              size="small"
              onClick={() => onGroupBySelect(col)}
              sx={{ 
                textTransform: "none", 
                minWidth: "auto",
                padding: "4px 12px",
                fontSize: "0.75rem",
                borderRadius: 2
              }}
            >
              {formatLabel(col)}
            </Button>
          ))}

          {remaining.length > 0 && (
            <>
              <Button
                variant="outlined"
                size="small"
                onClick={handleMoreClick}
                endIcon={<ArrowDropDownIcon />}
                sx={{ 
                  textTransform: "none", 
                  padding: "4px 12px",
                  fontSize: "0.75rem",
                  borderRadius: 2
                }}
              >
                More
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMoreClose}
                MenuListProps={{ dense: true }}
              >
                {remaining.map((col) => (
                  <MenuItem 
                    key={col} 
                    onClick={() => {
                      onGroupBySelect(col);
                      handleMoreClose();
                    }}
                    selected={selectedGroupBy === col}
                  >
                    {formatLabel(col)}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
        </>
      )}
    </Box>
  );
}

export default GroupBy;
