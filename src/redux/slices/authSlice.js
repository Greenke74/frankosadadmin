import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  aud: "",
  role: "",
  email: "",
  phone: "",
  created_at: "",
  updated_at: "",
  last_sign_in_at: "",
};

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    login: (state, { payload }) => {
      state = payload;
      return state;
    },
    logout: (state) => {
      state = initialState;
      return state;
    },
  },
});
