// src/redux/slices/costExplorerSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customFetch } from '../../Config/CustomFetch';

// Async thunk to fetch accounts
export const fetchAccounts = createAsyncThunk(
  'costExplorer/fetchAccounts',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await customFetch('http://localhost:8080/api/accounts/get', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch columns
export const fetchColumns = createAsyncThunk(
  'costExplorer/fetchColumns',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await customFetch("http://localhost:8080/api/costexplorer/columns", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.columns || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch distinct values for filtering
export const fetchDistinctValues = createAsyncThunk(
  'costExplorer/fetchDistinctValues',
  async (column, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await customFetch(`http://localhost:8080/distinct-values?field=${column}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      return { column, values: Array.isArray(data) ? data : [] };
    } catch (error) {
      return rejectWithValue({ column, error: error.message });
    }
  }
);

// Async thunk to fetch cost data
export const fetchCostData = createAsyncThunk(
  'costExplorer/fetchCostData',
  async ({ accountNumber, groupBy, startDate, endDate, filters }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      
      const requestBody = {
        groupBy,
        filters,
        startDate,
        endDate
      };
      
      const response = await customFetch(`http://localhost:8080/getcost/${accountNumber}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const costExplorerSlice = createSlice({
  name: 'costExplorer',
  initialState: {
    accounts: [],
    selectedAccount: null,
    columns: [],
    loading: {
      accounts: false,
      columns: false,
      distinctValues: false,
      costData: false
    },
    error: {
      accounts: null,
      columns: null,
      distinctValues: null,
      costData: null
    },
    filters: {
      selectedFilters: {},
      columnValues: {},
      selectedValues: {}
    },
    dateRange: {
      startDate: "2024-11-01",
      endDate: "2025-04-30"
    },
    selectedGroupBy: "Services",
    costData: [],
    months: [],
    viewMode: "bar",
    includeNegative: false
  },
  reducers: {
    setSelectedAccount: (state, action) => {
      state.selectedAccount = action.payload;
    },
    setSelectedGroupBy: (state, action) => {
      state.selectedGroupBy = action.payload;
    },
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    },
    toggleFilter: (state, action) => {
      const column = action.payload;
      state.filters.selectedFilters[column] = !state.filters.selectedFilters[column];
      
      // Initialize selected values for this column if not already set
      if (!state.filters.selectedValues[column]) {
        state.filters.selectedValues[column] = {};
      }
    },
    toggleValueSelection: (state, action) => {
      const { column, value } = action.payload;
      if (!state.filters.selectedValues[column]) {
        state.filters.selectedValues[column] = {};
      }
      state.filters.selectedValues[column][value] = !state.filters.selectedValues[column][value];
    },
    selectAllValues: (state, action) => {
      const { column, selectAll } = action.payload;
      
      if (state.filters.columnValues[column]) {
        const newValues = {};
        state.filters.columnValues[column].forEach(value => {
          newValues[value] = selectAll;
        });
        state.filters.selectedValues[column] = newValues;
      }
    },
    resetFilters: (state) => {
      // Reset column selection
      const resetFilters = {};
      state.columns.forEach(col => {
        resetFilters[col] = false;
      });
      state.filters.selectedFilters = resetFilters;
      
      // Reset selected values
      state.filters.selectedValues = {};
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Handle fetchAccounts
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.loading.accounts = true;
        state.error.accounts = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading.accounts = false;
        state.accounts = Array.isArray(action.payload) ? action.payload : [];
        // Set first account as selected if none is selected yet
        if (state.accounts.length > 0 && !state.selectedAccount) {
          state.selectedAccount = state.accounts[0];
        }
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading.accounts = false;
        state.error.accounts = action.payload;
      })
      
      // Handle fetchColumns
      .addCase(fetchColumns.pending, (state) => {
        state.loading.columns = true;
        state.error.columns = null;
      })
      .addCase(fetchColumns.fulfilled, (state, action) => {
        state.loading.columns = false;
        state.columns = action.payload;
        
        // Initialize filter state
        const initialFilters = {};
        action.payload.forEach(col => {
          initialFilters[col] = false;
        });
        state.filters.selectedFilters = initialFilters;
      })
      .addCase(fetchColumns.rejected, (state, action) => {
        state.loading.columns = false;
        state.error.columns = action.payload;
      })
      
      // Handle fetchDistinctValues
      .addCase(fetchDistinctValues.pending, (state) => {
        state.loading.distinctValues = true;
        state.error.distinctValues = null;
      })
      .addCase(fetchDistinctValues.fulfilled, (state, action) => {
        state.loading.distinctValues = false;
        const { column, values } = action.payload;
        state.filters.columnValues = {
          ...state.filters.columnValues,
          [column]: values
        };
        
        // Initialize selected values for this column if not already set
        if (!state.filters.selectedValues[column]) {
          state.filters.selectedValues[column] = {};
        }
      })
      .addCase(fetchDistinctValues.rejected, (state, action) => {
        state.loading.distinctValues = false;
        state.error.distinctValues = action.payload.error;
      })
      
      // Handle fetchCostData
      .addCase(fetchCostData.pending, (state) => {
        state.loading.costData = true;
        state.error.costData = null;
      })
      .addCase(fetchCostData.fulfilled, (state, action) => {
        state.loading.costData = false;
        
        // Process data for table display
        const data = action.payload;
        if (Array.isArray(data)) {
          // Extract unique months
          const uniqueMonths = [...new Set(data.map(item => item.month))].sort();
          state.months = uniqueMonths;
          
          // Group data by the selected groupBy value
          const groupByMap = new Map();
          
          data.forEach(item => {
            const groupByValue = item[state.selectedGroupBy] !== null ? item[state.selectedGroupBy] : 'Unclassified';
            
            if (!groupByMap.has(groupByValue)) {
              groupByMap.set(groupByValue, {
                [state.selectedGroupBy]: groupByValue,
              });
            }
            
            // Add cost for each month
            const monthKey = item.month;
            groupByMap.get(groupByValue)[monthKey] = item.cost;
          });
          
          // Calculate totals and create processed data array
          const processedData = Array.from(groupByMap.values()).map(item => {
            const rowTotal = uniqueMonths.reduce((sum, month) => sum + (item[month] || 0), 0);
            return {
              ...item,
              total: rowTotal
            };
          });
          
          // Sort by total cost descending
          processedData.sort((a, b) => b.total - a.total);
          
          state.costData = processedData;
        }
      })
      .addCase(fetchCostData.rejected, (state, action) => {
        state.loading.costData = false;
        state.error.costData = action.payload;
      });
  }
});

export const { 
  setSelectedAccount, 
  setSelectedGroupBy, 
  setDateRange, 
  toggleFilter, 
  toggleValueSelection, 
  selectAllValues, 
  resetFilters, 
  setViewMode, 
} = costExplorerSlice.actions;

export default costExplorerSlice.reducer;