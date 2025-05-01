import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  officerData: null,
  officerLines: null, 
  search: ''
};

const officerSlice = createSlice({
  name: "officer",
  initialState,
  reducers: {
    setOfficers(state, action) {
      state.officerData = action.payload;
    },
    setOfficerLines(state, action) {
      state.officerLines = action.payload;
    },
    setSearch(state, action) {
      state.search = action.payload;
    },
  },
});

export const { setOfficers,setOfficerLines,setSearch } = officerSlice.actions;
export default officerSlice.reducer;
