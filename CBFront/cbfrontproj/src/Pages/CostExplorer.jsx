// import { useEffect, useState, useRef } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   Card,
//   CardContent,
//   Typography,
//   Box,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   CircularProgress,
//   Button,
// } from "@mui/material";
// import FileDownloadIcon from "@mui/icons-material/FileDownload";
// import * as XLSX from "xlsx";

// // Import Components
// import GroupBy from "../components/GroupBy";
// import DateRangePicker from "../components/DateRangePicker";
// import FilterDialog from "../components/FilterDialog";
// import ViewModeSelector from "../components/ViewModeSelector";
// import AccountDropdown from "../components/AccountDropdown";
// import CostChart from "../components/CostChart";

// // Import Redux actions and selectors
// import {
//   fetchAccounts,
//   fetchColumns,
//   fetchDistinctValues,
//   fetchCostData,
//   setSelectedAccount,
//   setSelectedGroupBy,
//   setDateRange,
//   toggleFilter,
//   toggleValueSelection,
//   selectAllValues,
//   resetFilters,
//   setViewMode,
// } from "../redux/slices/costExplorerSlice";

// function CostExplorer() {
//   const dispatch = useDispatch();
  
//   // Select data from Redux store
//   const token = useSelector((state) => state.auth.token);
//   const {
//     accounts,
//     selectedAccount,
//     columns,
//     loading,
//     filters,
//     dateRange,
//     selectedGroupBy,
//     costData,
//     months,
//     viewMode,
//     includeNegative
//   } = useSelector((state) => state.costExplorer);
  
//   const [filterOpen, setFilterOpen] = useState(false);
  
  
//   // Add refs to track initialization and prevent redundant API calls
//   const initialFetchDone = useRef(false);
//   const accountSelectHandled = useRef(false);
//   const dateChangeHandled = useRef(false);

//   const handleViewModeChange = (event, newMode) => {
//     if (newMode !== null) {
//       dispatch(setViewMode(newMode));
//     }
//   };

//   const handleResetFilters = () => {
//     dispatch(resetFilters());
//   };

//   const handleFilterChange = (col) => {
//     dispatch(toggleFilter(col));
    
//     const isNowSelected = !filters.selectedFilters[col];
//     if (isNowSelected && (!filters.columnValues[col] || filters.columnValues[col].length === 0)) {
//       dispatch(fetchDistinctValues(col));
//     }
//   };

//   const handleValueSelection = (column, value) => {
//     dispatch(toggleValueSelection({ column, value }));
//   };

//   const handleSelectAllValues = (column, selectAll) => {
//     dispatch(selectAllValues({ column, selectAll }));
//   };

//   const handleAccountSelect = (accountNumber) => {

//     const account = accounts.find(acc => acc.accountNumber === accountNumber);
//     if (account) {
//       accountSelectHandled.current = true; 
//       dispatch(setSelectedAccount(account));
//       fetchCostDataWithFilters(accountNumber);
//     }
//   };

//   const handleGroupBySelect = (column) => {
//     dispatch(setSelectedGroupBy(column));
//     if (selectedAccount) {
//       fetchCostDataWithFilters(selectedAccount.accountNumber, column);
//     }
//   };

//   const handleStartDateChange = (e) => {
//     dateChangeHandled.current = true; 
//     dispatch(setDateRange({
//       ...dateRange,
//       startDate: e.target.value
//     }));
//   };

//   const handleEndDateChange = (e) => {
//     dateChangeHandled.current = true; 
//     dispatch(setDateRange({
//       ...dateRange,
//       endDate: e.target.value
//     }));
//   };

//   const getActiveFilters = () => {
//     const activeFilters = [];
    
//     Object.entries(filters.selectedFilters).forEach(([column, isSelected]) => {
//       if (isSelected && filters.selectedValues[column]) {
//         const selected = Object.entries(filters.selectedValues[column])
//           .filter(([_, isValueSelected]) => isValueSelected)
//           .map(([value]) => value);
        
//         if (selected.length > 0) {
//           const quotedValues = selected.map(value => `'${value}'`).join(', ');
//           activeFilters.push(`${column} IN (${quotedValues})`);
//         }
//       }
//     });
    
//     return activeFilters;
//   };

//   const fetchCostDataWithFilters = (accountNumber, groupBy = selectedGroupBy) => {
//     if (!accountNumber) return;
    
//     dispatch(fetchCostData({
//       accountNumber,
//       groupBy,
//       startDate: dateRange.startDate,
//       endDate: dateRange.endDate,
//       filters: getActiveFilters()
//     }));
//   };
  
//   const formatCurrency = (value) => {
//     if (value === undefined || value === null) return '$0.00';
//     return `$${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
//   };

//   const formatMonth = (monthStr) => {
//     if (!monthStr) return '';
    
//     try {
//       const [year, month] = monthStr.split('-');
//       const monthNames = [
//         'January', 'February', 'March', 'April', 'May', 'June',
//         'July', 'August', 'September', 'October', 'November', 'December'
//       ];
//       const monthIndex = parseInt(month, 10) - 1;
//       return `${monthNames[monthIndex]} ${year}`;
//     } catch (error) {
//       console.error("Error formatting month:", error);
//       return monthStr;
//     }
//   };

//   const formatDateDisplay = (dateStr) => {
//     if (!dateStr) return '';
    
//     try {
//       const [year, month, day] = dateStr.split('-');
//       const monthNames = [
//         'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
//         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
//       ];
//       const monthIndex = parseInt(month, 10) - 1;
//       return `${day}-${monthNames[monthIndex]}-${year}`;
//     } catch (error) {
//       console.error("Error formatting date:", error);
//       return dateStr;
//     }
//   };

//   // Function to export table data to Excel
//   const exportToExcel = () => {
//     // Create a new workbook
//     const wb = XLSX.utils.book_new();
    
//     // Prepare the data for the worksheet
//     const wsData = [];
    
//     // Add header row
//     const headerRow = [selectedGroupBy, ...months.map(month => formatMonth(month)), "Total"];
//     wsData.push(headerRow);
    
//     // Add data rows
//     costData.forEach(row => {
//       const dataRow = [
//         row[selectedGroupBy],
//         ...months.map(month => row[month] || 0),
//         row.total || 0
//       ];
//       wsData.push(dataRow);
//     });
    
//     // Add totals row
//     const totalRow = [
//       "Total",
//       ...months.map(month => costData.reduce((sum, row) => sum + (row[month] || 0), 0)),
//       costData.reduce((sum, row) => sum + (row.total || 0), 0)
//     ];
//     wsData.push(totalRow);
    
//     // Create worksheet from data
//     const ws = XLSX.utils.aoa_to_sheet(wsData);
    
//     // Add worksheet to workbook
//     XLSX.utils.book_append_sheet(wb, ws, "Cost Data");
    
//     // Generate filename with current date
//     const dateStr = new Date().toISOString().split('T')[0];
//     const filename = `CostExplorer_${selectedGroupBy}_${dateStr}.xlsx`;
    
//     // Write and download the workbook
//     XLSX.writeFile(wb, filename);
//   };

//   // Initial data fetching
//   useEffect(() => {
//     if (token && !initialFetchDone.current) {
//       initialFetchDone.current = true;
//       dispatch(fetchAccounts());
//       dispatch(fetchColumns());
//     }
//   }, [token, dispatch]);

  
//   useEffect(() => {
    
//     if (selectedAccount && token && !accountSelectHandled.current) {
//       accountSelectHandled.current = true;
//       fetchCostDataWithFilters(selectedAccount.accountNumber);
//     }
    
    
//     return () => {
//       if (accountSelectHandled.current) {
//         accountSelectHandled.current = false;
//       }
//     };
//   }, [selectedAccount]);

//   // Handle date range changes
//   useEffect(() => {
//     // Only fetch when date changes and we have an account and it's not already handled
//     if (selectedAccount && token && dateChangeHandled.current) {
//       dateChangeHandled.current = false;
//       fetchCostDataWithFilters(selectedAccount.accountNumber);
//     }
//   }, [dateRange.startDate, dateRange.endDate]);

//   return (
//     <div className="cost-explorer-container" style={{ 
//       position: 'relative',
//       transition: 'padding-right 0.3s ease',
//       paddingRight: filterOpen ? '300px' : '0',
//       width: '100%',
//       height: '100%'
//     }}>
//       <div style={{ padding: "16px 20px" }}>
//         {/* Header Section */}
//         <Box sx={{ 
//           display: "flex",
//           justifyContent: "space-between", 
//           alignItems: "center",
//           mb: 2
//         }}>
//           <Box>
//             <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>Cost Explorer</Typography>
//             <Typography variant="body2" color="textSecondary">
//               How to always be aware of cost changes and history.
//             </Typography>
//           </Box>
          
//           <AccountDropdown
//             selectedAccountId={selectedAccount?.accountNumber}
//             onSelect={handleAccountSelect}
//             sx={{ bgcolor: '#ffffff' }}
//           />
//         </Box>

//         {/* Main Content Card */}
//         <Card sx={{ 
//           borderRadius: '12px', 
//           boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
//           overflow: 'visible',
//           mt: 1
//         }}>
//           <CardContent sx={{ p: 2 }}>
//             {/* Group By Controls Row */}
//             <Box sx={{ mb: 2 }}>
//               <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//                 <GroupBy 
//                   columns={columns}
//                   loading={loading.columns}
//                   selectedGroupBy={selectedGroupBy}
//                   onGroupBySelect={handleGroupBySelect}
//                 />
//               </Box>
//             </Box>

//             {/* Controls Section */}
//             <Box sx={{ 
//               display: 'flex', 
//               justifyContent: 'space-between', 
//               alignItems: 'center', 
//               mb: 2 
//             }}>
//               {/* Date Range Picker */}
//               <DateRangePicker
//                 startDate={dateRange.startDate}
//                 endDate={dateRange.endDate}
//                 onStartDateChange={handleStartDateChange}
//                 onEndDateChange={handleEndDateChange}
//                 formatDateDisplay={formatDateDisplay}
//               />
              
//               {/* Right side controls */}
//               <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//                 <ViewModeSelector viewMode={viewMode} onChange={handleViewModeChange} />
                
//                 <Box 
//                   onClick={() => setFilterOpen(!filterOpen)}
//                   sx={{ 
//                     cursor: 'pointer',
//                     bgcolor: filterOpen ? '#1565c0' : '#1976d2',
//                     color: 'white',
//                     px: 2,
//                     py: 1,
//                     borderRadius: 1,
//                     '&:hover': {
//                       bgcolor: '#1565c0',
//                     }
//                   }}
//                 >
//                   <Typography variant="button">Filters</Typography>
//                 </Box>
//               </Box>
//             </Box>

//             {/* Data Display */}
//             {loading.costData ? (
//               <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 3 }}>
//                 <CircularProgress />
//               </Box>
//             ) : (
//               <>
//                 {costData.length > 0 ? (
//                   <>
//                     {/* Chart View */}
//                     <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
//                       <CostChart
//                         costData={costData}
//                         months={months}
//                         viewMode={viewMode}
//                         selectedGroupBy={selectedGroupBy}
//                         dateRange={dateRange}
//                         includeNegative={includeNegative}
//                       />
//                     </Paper>

//                     <Box sx={{ 
//                       display: 'flex',
//                       justifyContent: 'space-between',
//                       alignItems: 'center',
//                       bgcolor: '#e3f2fd', 
//                       p: 1, 
//                       borderRadius: '0 0 4px 4px',
//                       border: '1px solid #bbdefb',
//                       borderTop: 0,
//                       mb: 2
//                     }}>
//                       <Typography variant="body2">
//                         We are showing up top 1000 records by cost.
//                       </Typography>
                      
//                       {/* Export to Excel Button */}
//                       <Button
//                         variant="contained"
//                         color="primary"
//                         size="small"
//                         startIcon={<FileDownloadIcon />}
//                         onClick={exportToExcel}
//                         sx={{ 
//                           textTransform: 'none',
//                           boxShadow: 'none',
//                           '&:hover': {
//                             boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
//                           }
//                         }}
//                       >
//                         Export to Excel
//                       </Button>
//                     </Box>

//                     {/* Table View */}
//                     <Box sx={{ position: 'relative' }}>
//                       <TableContainer component={Paper} variant="outlined">
//                         <Table sx={{ minWidth: 650 }} size="small">
//                           <TableHead>
//                             <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
//                               <TableCell sx={{ fontWeight: 'bold' }}>{selectedGroupBy}</TableCell>
//                               {months.map((month) => (
//                                 <TableCell key={month} align="right" sx={{ fontWeight: 'bold' }}>
//                                   {formatMonth(month)}
//                                 </TableCell>
//                               ))}
//                               <TableCell align="right" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
//                                 Total
//                               </TableCell>
//                             </TableRow>
//                           </TableHead>
//                           <TableBody>
//                             {costData.map((row, index) => (
//                               <TableRow key={index} hover>
//                                 <TableCell component="th" scope="row">
//                                   {row[selectedGroupBy]}
//                                 </TableCell>
//                                 {months.map((month) => (
//                                   <TableCell key={month} align="right">
//                                     {formatCurrency(row[month])}
//                                   </TableCell>
//                                 ))}
//                                 <TableCell align="right" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
//                                   {formatCurrency(row.total)}
//                                 </TableCell>
//                               </TableRow>
//                             ))}
                            
//                             <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
//                               <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
//                               {months.map((month) => {
//                                 const monthTotal = costData.reduce((sum, row) => sum + (row[month] || 0), 0);
//                                 return (
//                                   <TableCell key={`total-${month}`} align="right" sx={{ fontWeight: 'bold' }}>
//                                     {formatCurrency(monthTotal)}
//                                   </TableCell>
//                                 );
//                               })}
//                               <TableCell align="right" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
//                                 {formatCurrency(costData.reduce((sum, row) => sum + (row.total || 0), 0))}
//                               </TableCell>
//                             </TableRow>
//                           </TableBody>
//                         </Table>
//                       </TableContainer>
//                     </Box>
//                   </>
//                 ) : (
//                   <Box sx={{ 
//                     display: 'flex', 
//                     flexDirection: 'column',
//                     alignItems: 'center', 
//                     justifyContent: 'center',
//                     py: 8,
//                     px: 4,
//                     textAlign: 'center',
//                     bgcolor: '#f9f9f9',
//                     borderRadius: 1,
//                     border: '1px dashed #ccc'
//                   }}>
//                     <Typography variant="h6" color="textSecondary" gutterBottom>
//                       No data available
//                     </Typography>
//                     <Typography variant="body2" color="textSecondary">
//                       No cost data found matching your current filters and date range. Try adjusting your search criteria.
//                     </Typography>
//                   </Box>
//                 )}
//               </>
//             )}
//           </CardContent>
//         </Card>
//       </div>
      
//       {/* Filter Dialog Component */}
//       <FilterDialog
//         open={filterOpen}
//         onClose={setFilterOpen}
//         columns={columns}
//         selectedFilters={filters.selectedFilters}
//         columnValues={filters.columnValues}
//         selectedValues={filters.selectedValues}
//         onFilterChange={handleFilterChange}
//         onValueSelection={handleValueSelection}
//         onSelectAllValues={handleSelectAllValues}
//         onResetFilters={handleResetFilters}
//         onApplyFilters={() => {
//           if (selectedAccount) {
//             fetchCostDataWithFilters(selectedAccount.accountNumber);
//           }
//         }}
        
//       />
//     </div>
//   );
// }

// export default CostExplorer;
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import * as XLSX from "xlsx";

// Import Components
import GroupBy from "../components/GroupBy";
import DateRangePicker from "../components/DateRangePicker";
import FilterDialog from "../components/FilterDialog";
import ViewModeSelector from "../components/ViewModeSelector";
import AccountDropdown from "../components/AccountDropdown";
import CostChart from "../components/CostChart";

// Import Redux actions and selectors
import {
  fetchAccounts,
  fetchColumns,
  fetchDistinctValues,
  fetchCostData,
  setSelectedAccount,
  setSelectedGroupBy,
  setDateRange,
  toggleFilter,
  toggleValueSelection,
  selectAllValues,
  resetFilters,
  setViewMode,
} from "../redux/slices/costExplorerSlice";

function CostExplorer() {
  const dispatch = useDispatch();
  
  // Select data from Redux store
  const token = useSelector((state) => state.auth.token);
  const username = useSelector((state) => state.auth.username); // Add username to detect user changes
  const {
    accounts,
    selectedAccount,
    columns,
    loading,
    filters,
    dateRange,
    selectedGroupBy,
    costData,
    months,
    viewMode,
    includeNegative
  } = useSelector((state) => state.costExplorer);
  
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Add refs to track initialization and prevent redundant API calls
  const initialFetchDone = useRef(false);
  const accountSelectHandled = useRef(false);
  const dateChangeHandled = useRef(false);
  const currentUsername = useRef(username);

  // Track user changes to reset data when switching users
  useEffect(() => {
    // If username changes (user switched), reset account selection state
    if (currentUsername.current !== username) {
      currentUsername.current = username;
      accountSelectHandled.current = false;
      initialFetchDone.current = false;
      
      // Re-fetch accounts for the new user
      dispatch(fetchAccounts());
      dispatch(fetchColumns());
    }
  }, [username, dispatch]);

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      dispatch(setViewMode(newMode));
    }
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  const handleFilterChange = (col) => {
    dispatch(toggleFilter(col));
    
    const isNowSelected = !filters.selectedFilters[col];
    if (isNowSelected && (!filters.columnValues[col] || filters.columnValues[col].length === 0)) {
      dispatch(fetchDistinctValues(col));
    }
  };

  const handleValueSelection = (column, value) => {
    dispatch(toggleValueSelection({ column, value }));
  };

  const handleSelectAllValues = (column, selectAll) => {
    dispatch(selectAllValues({ column, selectAll }));
  };

  const handleAccountSelect = (accountNumber) => {
    if (!accountNumber) {
      // Clear cost data if no account is selected
      dispatch(setSelectedAccount(null));
      return;
    }

    const account = accounts.find(acc => acc.accountNumber === accountNumber);
    if (account) {
      accountSelectHandled.current = true; 
      dispatch(setSelectedAccount(account));
      fetchCostDataWithFilters(accountNumber);
    }
  };

  const handleGroupBySelect = (column) => {
    dispatch(setSelectedGroupBy(column));
    if (selectedAccount) {
      fetchCostDataWithFilters(selectedAccount.accountNumber, column);
    }
  };

  const handleStartDateChange = (e) => {
    dateChangeHandled.current = true; 
    dispatch(setDateRange({
      ...dateRange,
      startDate: e.target.value
    }));
  };

  const handleEndDateChange = (e) => {
    dateChangeHandled.current = true; 
    dispatch(setDateRange({
      ...dateRange,
      endDate: e.target.value
    }));
  };

  const getActiveFilters = () => {
    const activeFilters = [];
    
    Object.entries(filters.selectedFilters).forEach(([column, isSelected]) => {
      if (isSelected && filters.selectedValues[column]) {
        const selected = Object.entries(filters.selectedValues[column])
          .filter(([_, isValueSelected]) => isValueSelected)
          .map(([value]) => value);
        
        if (selected.length > 0) {
          const quotedValues = selected.map(value => `'${value}'`).join(', ');
          activeFilters.push(`${column} IN (${quotedValues})`);
        }
      }
    });
    
    return activeFilters;
  };

  const fetchCostDataWithFilters = (accountNumber, groupBy = selectedGroupBy) => {
    if (!accountNumber) return;
    
    dispatch(fetchCostData({
      accountNumber,
      groupBy,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      filters: getActiveFilters()
    }));
  };
  
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return '$0.00';
    return `$${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  const formatMonth = (monthStr) => {
    if (!monthStr) return '';
    
    try {
      const [year, month] = monthStr.split('-');
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const monthIndex = parseInt(month, 10) - 1;
      return `${monthNames[monthIndex]} ${year}`;
    } catch (error) {
      console.error("Error formatting month:", error);
      return monthStr;
    }
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    
    try {
      const [year, month, day] = dateStr.split('-');
      const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      const monthIndex = parseInt(month, 10) - 1;
      return `${day}-${monthNames[monthIndex]}-${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateStr;
    }
  };

  // Function to export table data to Excel
  const exportToExcel = () => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Prepare the data for the worksheet
    const wsData = [];
    
    // Add header row
    const headerRow = [selectedGroupBy, ...months.map(month => formatMonth(month)), "Total"];
    wsData.push(headerRow);
    
    // Add data rows
    costData.forEach(row => {
      const dataRow = [
        row[selectedGroupBy],
        ...months.map(month => row[month] || 0),
        row.total || 0
      ];
      wsData.push(dataRow);
    });
    
    // Add totals row
    const totalRow = [
      "Total",
      ...months.map(month => costData.reduce((sum, row) => sum + (row[month] || 0), 0)),
      costData.reduce((sum, row) => sum + (row.total || 0), 0)
    ];
    wsData.push(totalRow);
    
    // Create worksheet from data
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Cost Data");
    
    // Generate filename with current date
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `CostExplorer_${selectedGroupBy}_${dateStr}.xlsx`;
    
    // Write and download the workbook
    XLSX.writeFile(wb, filename);
  };

  // Initial data fetching
  useEffect(() => {
    if (token && !initialFetchDone.current) {
      initialFetchDone.current = true;
      dispatch(fetchAccounts());
      dispatch(fetchColumns());
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (selectedAccount && token && !accountSelectHandled.current) {
      accountSelectHandled.current = true;
      fetchCostDataWithFilters(selectedAccount.accountNumber);
    }
    
    return () => {
      if (accountSelectHandled.current) {
        accountSelectHandled.current = false;
      }
    };
  }, [selectedAccount]);

  // Handle date range changes
  useEffect(() => {
    // Only fetch when date changes and we have an account and it's not already handled
    if (selectedAccount && token && dateChangeHandled.current) {
      dateChangeHandled.current = false;
      fetchCostDataWithFilters(selectedAccount.accountNumber);
    }
  }, [dateRange.startDate, dateRange.endDate]);

  return (
    <div className="cost-explorer-container" style={{ 
      position: 'relative',
      transition: 'padding-right 0.3s ease',
      paddingRight: filterOpen ? '300px' : '0',
      width: '100%',
      height: '100%'
    }}>
      <div style={{ padding: "16px 20px" }}>
        {/* Header Section */}
        <Box sx={{ 
          display: "flex",
          justifyContent: "space-between", 
          alignItems: "center",
          mb: 2
        }}>
          <Box>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>Cost Explorer</Typography>
            <Typography variant="body2" color="textSecondary">
              How to always be aware of cost changes and history.
            </Typography>
          </Box>
          
          <AccountDropdown
            selectedAccountId={selectedAccount?.accountNumber}
            onSelect={handleAccountSelect}
            sx={{ bgcolor: '#ffffff' }}
          />
        </Box>

        {/* Main Content Card */}
        <Card sx={{ 
          borderRadius: '12px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          overflow: 'visible',
          mt: 1
        }}>
          <CardContent sx={{ p: 2 }}>
            {/* Group By Controls Row */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <GroupBy 
                  columns={columns}
                  loading={loading.columns}
                  selectedGroupBy={selectedGroupBy}
                  onGroupBySelect={handleGroupBySelect}
                />
              </Box>
            </Box>

            {/* Controls Section */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 2 
            }}>
              {/* Date Range Picker */}
              <DateRangePicker
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                onStartDateChange={handleStartDateChange}
                onEndDateChange={handleEndDateChange}
                formatDateDisplay={formatDateDisplay}
              />
              
              {/* Right side controls */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <ViewModeSelector viewMode={viewMode} onChange={handleViewModeChange} />
                
                <Box 
                  onClick={() => setFilterOpen(!filterOpen)}
                  sx={{ 
                    cursor: 'pointer',
                    bgcolor: filterOpen ? '#1565c0' : '#1976d2',
                    color: 'white',
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    '&:hover': {
                      bgcolor: '#1565c0',
                    }
                  }}
                >
                  <Typography variant="button">Filters</Typography>
                </Box>
              </Box>
            </Box>

            {/* Data Display */}
            {loading.costData ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {costData.length > 0 && selectedAccount ? (
                  <>
                    {/* Chart View */}
                    <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                      <CostChart
                        costData={costData}
                        months={months}
                        viewMode={viewMode}
                        selectedGroupBy={selectedGroupBy}
                        dateRange={dateRange}
                        includeNegative={includeNegative}
                      />
                    </Paper>

                    <Box sx={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      bgcolor: '#e3f2fd', 
                      p: 1, 
                      borderRadius: '0 0 4px 4px',
                      border: '1px solid #bbdefb',
                      borderTop: 0,
                      mb: 2
                    }}>
                      <Typography variant="body2">
                        We are showing up top 1000 records by cost.
                      </Typography>
                      
                      {/* Export to Excel Button */}
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<FileDownloadIcon />}
                        onClick={exportToExcel}
                        sx={{ 
                          textTransform: 'none',
                          boxShadow: 'none',
                          '&:hover': {
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                          }
                        }}
                      >
                        Export to Excel
                      </Button>
                    </Box>

                    {/* Table View */}
                    <Box sx={{ position: 'relative' }}>
                      <TableContainer component={Paper} variant="outlined">
                        <Table sx={{ minWidth: 650 }} size="small">
                          <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                              <TableCell sx={{ fontWeight: 'bold' }}>{selectedGroupBy}</TableCell>
                              {months.map((month) => (
                                <TableCell key={month} align="right" sx={{ fontWeight: 'bold' }}>
                                  {formatMonth(month)}
                                </TableCell>
                              ))}
                              <TableCell align="right" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                Total
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {costData.map((row, index) => (
                              <TableRow key={index} hover>
                                <TableCell component="th" scope="row">
                                  {row[selectedGroupBy]}
                                </TableCell>
                                {months.map((month) => (
                                  <TableCell key={month} align="right">
                                    {formatCurrency(row[month])}
                                  </TableCell>
                                ))}
                                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                  {formatCurrency(row.total)}
                                </TableCell>
                              </TableRow>
                            ))}
                            
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                              <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                              {months.map((month) => {
                                const monthTotal = costData.reduce((sum, row) => sum + (row[month] || 0), 0);
                                return (
                                  <TableCell key={`total-${month}`} align="right" sx={{ fontWeight: 'bold' }}>
                                    {formatCurrency(monthTotal)}
                                  </TableCell>
                                );
                              })}
                              <TableCell align="right" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                {formatCurrency(costData.reduce((sum, row) => sum + (row.total || 0), 0))}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    justifyContent: 'center',
                    py: 8,
                    px: 4,
                    textAlign: 'center',
                    bgcolor: '#f9f9f9',
                    borderRadius: 1,
                    border: '1px dashed #ccc'
                  }}>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      No data available
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {!selectedAccount ? 
                        "No account selected. Please select an account to view cost data." : 
                        "No cost data found matching your current filters and date range. Try adjusting your search criteria."}
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Filter Dialog Component */}
      <FilterDialog
        open={filterOpen}
        onClose={setFilterOpen}
        columns={columns}
        selectedFilters={filters.selectedFilters}
        columnValues={filters.columnValues}
        selectedValues={filters.selectedValues}
        onFilterChange={handleFilterChange}
        onValueSelection={handleValueSelection}
        onSelectAllValues={handleSelectAllValues}
        onResetFilters={handleResetFilters}
        onApplyFilters={() => {
          if (selectedAccount) {
            fetchCostDataWithFilters(selectedAccount.accountNumber);
          }
        }}
      />
    </div>
  );
}

export default CostExplorer;