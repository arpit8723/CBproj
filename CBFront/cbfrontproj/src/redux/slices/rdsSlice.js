// src/redux/slices/rdsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customFetch } from '../../Config/CustomFetch';

export const fetchRdsData = createAsyncThunk(
  'rds/fetchRdsData',
  async (accountId, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const res = await customFetch(`http://localhost:8080/aws/rds/${accountId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch RDS data');
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const rdsSlice = createSlice({
  name: 'rds',
  initialState: {
    selectedAccountId: null,
    rdsData: [],
    loading: false,
    error: null,
    hasFetched: false,
  },
  reducers: {
    setSelectedAccount: (state, action) => {
      state.selectedAccountId = action.payload;
    },
    clearRdsData: (state) => {
      state.rdsData = [];
      state.loading = false;
      state.error = null;
      state.hasFetched = false;
    },
    setHasFetched: (state, action) => {
      state.hasFetched = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRdsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRdsData.fulfilled, (state, action) => {
        state.loading = false;
        state.rdsData = action.payload;
        state.hasFetched = true;
      })
      .addCase(fetchRdsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.rdsData = [];
        state.hasFetched = true;
      });
  },
});

export const { setSelectedAccount, clearRdsData, setHasFetched } = rdsSlice.actions;
export default rdsSlice.reducer;
