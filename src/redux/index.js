import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./slices/authSlice";

export const store = configureStore({
    reducer: combineReducers({
        auth: authSlice.reducer
    })
})

export const actionTypes = {
    login: 'LOGIN',
    logout: 'LOGOUT'
}