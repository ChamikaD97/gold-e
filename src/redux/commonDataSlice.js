import { createSlice } from "@reduxjs/toolkit";
import { notification } from "antd";

const initialState = {
  notificationDate: 2,
  leafRound: 6,
  monthMap: {
    "01": "January", "02": "February", "03": "March", "04": "April",
    "05": "May", "06": "June", "07": "July", "08": "August",
    "09": "September", "10": "October", "11": "November", "12": "December"
  }

};

const commonDataSlice = createSlice({
  name: "commonData",
  initialState,
  reducers: {
    setNotificationDate: (state, action) => {
      state.tomorrow = action.payload; // Array of supplier objects
    },
    setLeafRound: (state, action) => {
      state.range6Days = action.payload; // Object with 6 days as keys
    },
    clearMarkers: (state) => {
      state.notificationDate = 2; // Reset to default value
      state.leafRound = 6; // Reset to default value
      state.monthMap = {
        "01": "January", "02": "February", "03": "March", "04": "April",
        "05": "May", "06": "June", "07": "July", "08": "August",
        "09": "September", "10": "October", "11": "November", "12": "December"
      };
    }
  }
});

export const { setTomorrowMarkers, setRange6DaysMarkers, clearMarkers } = commonDataSlice.actions;
export default commonDataSlice.reducer;
