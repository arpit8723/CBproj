import React, { useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Button,
  Checkbox,
  FormGroup,
  FormControlLabel,
  CircularProgress,
  IconButton,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const FilterDialog = ({
  open,
  onClose,
  columns,
  selectedFilters,
  columnValues,
  selectedValues,
  onFilterChange,
  onValueSelection,
  onSelectAllValues,
  onResetFilters,
  onApplyFilters,
}) => {
  if (!open) return null;

  const [expandedColumn, setExpandedColumn] = useState(null);
  const [searchTerms, setSearchTerms] = useState({});
  
  const formatLabel = (text) =>
    text.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const handleFilterChange = (col) => {
    onFilterChange(col);
    if (!selectedFilters[col]) {
      setExpandedColumn(col);
    }
  };

  const handleSearchChange = (col, value) => {
    setSearchTerms(prev => ({
      ...prev,
      [col]: value
    }));
  };

  const clearSearch = (col) => {
    setSearchTerms(prev => ({
      ...prev,
      [col]: ''
    }));
  };

  const getFilteredValues = (col) => {
    if (!columnValues[col]) return [];
    if (!searchTerms[col]) return columnValues[col];
    
    const searchTerm = searchTerms[col].toLowerCase();
    return columnValues[col].filter(value => 
      String(value).toLowerCase().includes(searchTerm)
    );
  };

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        right: 10,
        top: 260,
        width: '300px',
        height: '60vh',
        zIndex: 1100,
        overflowY: 'auto',
        backgroundColor: '#ffffff',
        borderLeft: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Filters</Typography>
        <IconButton onClick={() => onClose(false)} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider />
      
      <Box sx={{ flex: '1 1 auto', overflowY: 'auto', p: 2 }}>
        {/* Columns as accordions */}
        {columns.map((col) => (
          <Accordion 
            key={col} 
            expanded={selectedFilters[col] && expandedColumn === col}
            onChange={() => {
              if (selectedFilters[col]) {
                setExpandedColumn(expandedColumn === col ? null : col);
              } else {
                handleFilterChange(col);
              }
            }}
            disableGutters
            sx={{ 
              mb: 1, 
              '&:before': { display: 'none' }, 
              boxShadow: 'none',
              border: '1px solid #e0e0e0',
              borderRadius: 1
            }}
          >
            <AccordionSummary
              expandIcon={selectedFilters[col] ? <ExpandMoreIcon /> : null}
              aria-controls={`${col}-content`}
              id={`${col}-header`}
              sx={{ minHeight: '48px' }}
            >
              <FormControlLabel
                onClick={(e) => {
                  e.stopPropagation();
                  handleFilterChange(col);
                }}
                control={
                  <Checkbox
                    checked={selectedFilters[col] || false}
                    size="small"
                  />
                }
                label={<Typography variant="body2">{formatLabel(col)}</Typography>}
                sx={{ m: 0, width: '100%' }}
              />
            </AccordionSummary>
            
            {selectedFilters[col] && (
              <AccordionDetails sx={{ pt: 0, pb: 2 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  gap: 1, 
                  mb: 1 
                }}>
                  <Button 
                    size="small" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectAllValues(col, true);
                    }}
                    sx={{ fontSize: '0.75rem' }}
                  >
                    Select All
                  </Button>
                  <Button 
                    size="small" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectAllValues(col, false);
                    }}
                    sx={{ fontSize: '0.75rem' }}
                  >
                    Clear
                  </Button>
                </Box>
                
                {!columnValues[col] ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : columnValues[col].length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {/* Search input field */}
                    <TextField
                      size="small"
                      placeholder="Search values"
                      variant="outlined"
                      fullWidth
                      value={searchTerms[col] || ''}
                      onChange={(e) => handleSearchChange(col, e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                          </InputAdornment>
                        ),
                        endAdornment: searchTerms[col] ? (
                          <InputAdornment position="end">
                            <IconButton 
                              size="small" 
                              onClick={() => clearSearch(col)}
                              edge="end"
                            >
                              <ClearIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ) : null,
                        sx: { fontSize: '0.875rem' }
                      }}
                    />
                    
                    <Box sx={{ 
                      maxHeight: '200px', 
                      overflowY: 'auto', 
                      border: '1px solid #e0e0e0', 
                      borderRadius: 1, 
                      p: 1 
                    }}>
                      <FormGroup>
                        {getFilteredValues(col).length > 0 ? (
                          getFilteredValues(col).map((value) => (
                            <FormControlLabel
                              key={`${col}-${value}`}
                              control={
                                <Checkbox
                                  size="small"
                                  checked={selectedValues[col]?.[value] || false}
                                  onChange={() => onValueSelection(col, value)}
                                />
                              }
                              label={<Typography variant="body2">{value}</Typography>}
                            />
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
                            No matching values
                          </Typography>
                        )}
                      </FormGroup>
                    </Box>
                    
                    {/* Show count of filtered/total items */}
                    {searchTerms[col] && (
                      <Typography variant="caption" color="text.secondary">
                        Showing {getFilteredValues(col).length} of {columnValues[col].length} items
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No values available
                  </Typography>
                )}
              </AccordionDetails>
            )}
          </Accordion>
        ))}
      </Box>
      
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid #e0e0e0', 
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <Button 
          onClick={onResetFilters} 
          color="inherit"
          variant="outlined"
          size="small"
        >
          Reset All
        </Button>
        <Button 
          onClick={() => {
            onApplyFilters();
            onClose(false);
          }} 
          color="primary" 
          variant="contained"
          size="small"
        >
          Apply Filters
        </Button>
      </Box>
    </Paper>
  );
};

export default FilterDialog;