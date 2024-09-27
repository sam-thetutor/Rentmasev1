import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { LocationType } from "../types";
import { CountryData } from "../../pages/airtime/types";

export interface GlobalState {
  location: LocationType | null;
  audience: string;
  countries: CountryData[] | null;
}

const initialState: GlobalState = {
  location: null,
  audience: "topups-sandbox",
  countries: null,
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
    setCountries: (state, action: PayloadAction<CountryData[]>) => {
      state.countries = action.payload;
    },
  },
});

export const { setLocation, setAudience , setCountries } = appSlice.actions;

export default appSlice.reducer;
