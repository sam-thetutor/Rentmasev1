import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { LocationType } from "../types";

export interface GlobalState {
  location: LocationType | null;
}

const initialState: GlobalState = {
  location: null,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<LocationType | null>) => {
      state.location = action.payload;
  },
},
});

export const {
  setLocation,
} = appSlice.actions;

export default appSlice.reducer;
