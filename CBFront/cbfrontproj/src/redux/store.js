// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import onboardingReducer from './slices/onboardingSlice'; 


const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token', 'role', 'username']
};

const rootReducer = {
  auth: persistReducer(authPersistConfig, authReducer),
  users: userReducer,
  onboarding: onboardingReducer
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    })
});

export const persistor = persistStore(store);