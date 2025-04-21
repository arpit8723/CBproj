// src/redux/rootReducer.js
import { combineReducers } from "redux";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import onboardingReducer from './slices/onboardingSlice'; 

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  onboarding: onboardingReducer,
});

export default rootReducer;
