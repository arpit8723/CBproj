// src/redux/slices/ec2Slice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customFetch } from '../../Config/CustomFetch';

export const fetchEc2Data = createAsyncThunk(
  'ec2/fetchEc2Data',
  async (accountId, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const res = await customFetch(`http://localhost:8080/aws/ec2/${accountId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch EC2 data');
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const ec2Slice = createSlice({
  name: 'ec2',
  initialState: {
    selectedAccountId: null,
    ec2Data: [],
    loading: false,
    error: null,
    hasFetched: false, // Track if we've attempted to fetch
  },
  reducers: {
    setSelectedAccount: (state, action) => {
      state.selectedAccountId = action.payload;
    },
    clearEc2Data: (state) => {
      state.ec2Data = [];
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
      .addCase(fetchEc2Data.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEc2Data.fulfilled, (state, action) => {
        state.loading = false;
        state.ec2Data = action.payload;
        state.hasFetched = true;
      })
      .addCase(fetchEc2Data.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.ec2Data = []; // 💥 Clear stale data
        state.hasFetched = true;
      });
  },
});

export const { setSelectedAccount, clearEc2Data, setHasFetched } = ec2Slice.actions;
export default ec2Slice.reducer;