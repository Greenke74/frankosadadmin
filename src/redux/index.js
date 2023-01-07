import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authLoadingSlice } from "./slices/authLoading";
import { authSlice } from "./slices/authSlice";
import { sidebarSlice } from "./slices/sidebar";

export const store = configureStore({
  reducer: combineReducers({
    auth: authSlice.reducer,
    sidebar: sidebarSlice.reducer,
    authLoading: authLoadingSlice.reducer,
  }),
});
