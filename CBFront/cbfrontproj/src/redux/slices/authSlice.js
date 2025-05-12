import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid Email or Password');
      }

      const data = await response.json();
      const base64Payload = data.token.split('.')[1];
      const decodedPayload = JSON.parse(atob(base64Payload));

 

      return {
        token: data.token,
        role: decodedPayload.role,
        username: decodedPayload.username,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const switchUser = createAsyncThunk(
  'auth/switchUser',
  async (targetEmail, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch('http://localhost:8080/api/auth/switch-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ targetEmail }),
      });

      if (!response.ok) throw new Error('Failed to switch user');

      const data = await response.json();
      const decoded = JSON.parse(atob(data.token.split('.')[1]));

      return {
        token: data.token,
        role: decoded.role,
        username: decoded.username,
        originalToken: auth.token,
        originalRole: auth.role,
        originalUsername: auth.username,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const switchBack = createAsyncThunk(
  'auth/switchBack',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();

    try {
      const response = await fetch('http://localhost:8080/api/auth/switch-back', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to switch back');

      return {
        token: auth.originalToken,
        role: auth.originalRole,
        username: auth.originalUsername,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchCustomerEmails = createAsyncThunk(
  'auth/fetchCustomerEmails',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();

    try {
      const response = await fetch('http://localhost:8080/api/users/customers', {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch customer emails');
      return await response.json(); // Assuming API returns a JSON array of emails
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role') || null,
    username: localStorage.getItem('username') || null,
    isLoading: false,
    error: null,

    isImpersonating: false,
  originalToken: null,
  originalRole: null,
  originalUsername: null,

  customerEmails: [],
  isFetchingCustomers: false,
  customerFetchError: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.username = null;
      state.isImpersonating = false;
      state.originalToken = null;
      state.originalRole = null;
      state.originalUsername = null;
      localStorage.clear(); 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.username = action.payload.username;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(switchUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.username = action.payload.username;
        state.originalToken = action.payload.originalToken;
        state.originalRole = action.payload.originalRole;
        state.originalUsername = action.payload.originalUsername;
        state.isImpersonating = true;
      })
      .addCase(switchBack.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.username = action.payload.username;
        state.originalToken = null;
        state.originalRole = null;
        state.originalUsername = null;
        state.isImpersonating = false;
      })
      .addCase(fetchCustomerEmails.pending, (state) => {
        state.isFetchingCustomers = true;
        state.customerFetchError = null;
      })
      .addCase(fetchCustomerEmails.fulfilled, (state, action) => {
        state.isFetchingCustomers = false;
        state.customerEmails = action.payload;
      })
      .addCase(fetchCustomerEmails.rejected, (state, action) => {
        state.isFetchingCustomers = false;
        state.customerFetchError = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export const selectAuth = (state) => state.auth;
export default authSlice.reducer;
