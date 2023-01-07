import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
};

export const authLoadingSlice = createSlice({
  name: "authLoadingSlice",
  initialState,
  reducers: {
    setLoading: (state, { payload }) => {
      state = {
        loading: payload,
      };
      return state;
    },
  },
});

export const setAuthLoading = (payload) =>
  authLoadingSlice.actions.setLoading(payload);
