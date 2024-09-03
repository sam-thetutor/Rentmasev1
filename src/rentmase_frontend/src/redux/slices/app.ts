import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface GlobalState {
// TODO: Define the state of the app
}

const initialState: GlobalState = {
  // TODO: Define the initial state of the app
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    // TODO: Define the reducers
  },
});

export const {
// TODO: Export the actions
} = appSlice.actions;

export default appSlice.reducer;
