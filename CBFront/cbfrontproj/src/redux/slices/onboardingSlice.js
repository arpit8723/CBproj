// onboardingSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for submitting the onboarding data
export const submitOnboardingData = createAsyncThunk(
  'onboarding/submit',
  async (formConfig, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;  // Assuming token is stored in auth slice
      console.log('Token:', token);
      console.log('Form config:', JSON.stringify(formConfig, null, 2));

      const response = await fetch('http://localhost:8080/api/accounts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formConfig),
      });

      console.log("🚀 RESPONSE STATUS:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ BACKEND ERROR RESPONSE:", errorData);
        return rejectWithValue(errorData || 'Something went wrong');
      }

      const data = await response.json();
      console.log("✅ SUCCESSFUL RESPONSE:", data);
      return data;
    } catch (error) {
      console.error("💥 NETWORK OR OTHER ERROR:", error);
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState: {
    formConfig: {
      arn: '',
      accountNumber: '',
      accountName: '',
      region: '',
    },
    status: 'idle',
    error: null,
  },
  reducers: {
    updateFormField: (state, action) => {
      const { field, value } = action.payload;
      state.formConfig[field] = value; // Update the specific form field
    },
    resetForm: (state) => {
      // Reset formConfig to initial values
      state.formConfig = {
        arn: '',
        accountNumber: '',
        accountName: '',
        region: '',
      };
    },
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(submitOnboardingData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(submitOnboardingData.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(submitOnboardingData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { updateFormField, resetForm } = onboardingSlice.actions;
export default onboardingSlice.reducer;
