// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import onboardingReducer from './slices/onboardingSlice'; 
import ec2Reducer from './slices/ec2Slice';
import rdsReducer from './slices/rdsSlice';
import asgReducer from './slices/asgSlice';
import costExplorerReducer from './slices/costExplorerSlice';



const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token', 'role', 'username']
};
const costExplorerPersistConfig = {
  key: 'costExplorer',
  storage,
  whitelist: ['selectedGroupBy', 'viewMode', 'dateRange', 'includeNegative']
};

const rootReducer = {
  auth: persistReducer(authPersistConfig, authReducer),
  users: userReducer,
  onboarding: onboardingReducer,
  ec2: ec2Reducer,
  rds: rdsReducer,
  asg: asgReducer,
  costExplorer: persistReducer(costExplorerPersistConfig, costExplorerReducer)
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