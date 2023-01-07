import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
};

export const sidebarSlice = createSlice({
  name: "sidebarSlice",
  initialState,
  reducers: {
    open: (state) => {
      state = {
        open: true
      };
      return state;
    },
    close: (state) => {
      state = {
        open: false
      };
      return state;
    },
  },
});
