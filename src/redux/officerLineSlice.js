// src/redux/slices/officerLineSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  officerLineMap: {
    Ajith: ["MT", "PH", "PW (PRIVATE)", "PP(PRIVATE)", "GO", "UG", "MP", "BM", "TP", "UP"],
    Chamod: ["NG(PRIVATE)", "S(PRIVATE)", "DR"],
    Udara: ["J", "T", "SELF-2", "TK", "HA", "D"],
    Gamini: ["SELF", "DG", "ML", "MV"],
    Udayanga: ["BA", "BK", "K", "PT", "PK", "A", "KM", "N", "DM"]
  },
  allLines: 
    [
      "MT", "PH", "PW (PRIVATE)", "PP(PRIVATE)", "GO", "UG", "MP", "BM", "TP", "UP",
      "NG(PRIVATE)", "S(PRIVATE)", "DR",
      "J", "T", "SELF-2", "TK", "HA", "D",
      "SELF", "DG", "ML", "MV",
      "BA", "BK", "K", "PT", "PK", "A", "KM", "N", "DM"
    ]

  
};

const officerLineSlice = createSlice({
  name: "officerLine",
  initialState,
  reducers: {
    setOfficerLineMap: (state, action) => {
      state.officerLineMap = action.payload;
    },
    setAllLines: (state, action) => {
      state.allLines = action.payload;
    }
  }
});

export const { setOfficerLineMap } = officerLineSlice.actions;
export default officerLineSlice.reducer;
