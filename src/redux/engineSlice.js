import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  engineData: null,
  enginesClasses:null,search:''
};

const enginesSlice = createSlice({
  name: "eng",
  initialState,
  reducers: {
    engines(state, action) {
      state.engineData= action.payload;
    },
    enginesClasses(state, action) {
      state.enginesClasses= action.payload;
    },
    setSearch(state, action) {
      state.search= action.payload;
    },
  },
});

export const { engines,enginesClasses,setSearch } = enginesSlice.actions;
export default enginesSlice.reducer;
