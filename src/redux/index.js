import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./slices/authSlice";

export const store = configureStore({
    reducer: combineReducers({
        authSlice: authSlice.reducer
    })
})

export const actionTypes = {
    updateAuth: 'UPDATEAUTH',
    logout: 'LOGOUT'
}