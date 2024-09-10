import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { LocationType } from "../types";

export interface GlobalState {
  location: LocationType | null;
  audience : string;
}

const initialState: GlobalState = {
  location: null,
  audience: "topups-sandbox",
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<LocationType | null>) => {
      state.location = action.payload;
  },
  setAudience: (state, action: PayloadAction<string>) => {
    state.audience = action.payload;
  },
},
});

export const {
  setLocation,
  setAudience,
} = appSlice.actions;

export default appSlice.reducer;
