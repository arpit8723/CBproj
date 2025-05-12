import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customFetch } from '../../Config/CustomFetch';

export const fetchAsgData = createAsyncThunk(
    'asg/fetchAsgData',
    async (accountId, { getState, rejectWithValue }) => {
      const token = getState().auth.token;
      try {
        const res = await customFetch(`http://localhost:8080/aws/asg/${accountId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch ASG data');
        return await res.json();
      } catch (err) {
        return rejectWithValue(err.message);
      }
    }
  );

  const asgSlice = createSlice({
    name: 'asg',
    initialState: {
      selectedAccountId: null,
      asgData: [],
      loading: false,
      error: null,
      hasFetched: false,
    },
    reducers: {
      setSelectedAccount: (state, action) => {
        state.selectedAccountId = action.payload;
      },
      clearAsgData: (state) => {
        state.asgData = [];
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
        .addCase(fetchAsgData.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchAsgData.fulfilled, (state, action) => {
          state.loading = false;
          state.asgData = action.payload;
          state.hasFetched = true;
        })
        .addCase(fetchAsgData.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
          state.asgData = [];
          state.hasFetched = true;
        });
    },
  });
  
  export const { setSelectedAccount, clearAsgData, setHasFetched } = asgSlice.actions;
  export default asgSlice.reducer;
  