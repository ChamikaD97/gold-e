import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tripCardData: null,
};

const tripCardSlice = createSlice({
  name: "trips",
  initialState,
  reducers: {
    setTripCardData(state, action) {
      state.tripCardData= action.payload;
    },

  },
});

export const {setTripCardData } = tripCardSlice.actions;
export default tripCardSlice.reducer;
