// src/redux/slices/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const res = await fetch('http://localhost:8080/api/users/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to fetch users');

      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (payload, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const res = await fetch('http://localhost:8080/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }

      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    isLoading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      });
  }
});

export const updateUserThunk = createAsyncThunk(
    'users/update',
    async ({ userId, data, token }, thunkAPI) => {
      try {
        const response = await fetch(`http://localhost:8080/api/users/update/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });
  
        if (!response.ok) {
          const errorText = await response.text(); // Handle error body safely
          throw new Error(errorText || 'Failed to update user');
        }
  
        // Try to parse as JSON, fallback to text
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return await response.json();
        } else {
          return { message: await response.text() }; // just return message string
        }
      } catch (err) {
        return thunkAPI.rejectWithValue(err.message || 'Unknown error');
      }
    }
  );
  
  

export const selectUsers = (state) => state.users;
export default userSlice.reducer;
