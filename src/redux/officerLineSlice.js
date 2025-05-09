// src/redux/slices/officerLineSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  officerLineMap: {
    Ajith: ["MT", "PH", "PW", "PP", "GO", "UG", "MP", "BM", "TP", "UP" , "C-13","PH2"],
    Chamod: ["NG", "S", "DR"],
    Udara: ["J", "T", "SLF", "TK", "HA", "D"],
    Gamini: ["SELF", "DG", "ML", "MV"],
    Udayanga: ["BA", "BK", "K", "PT", "PK", "A", "KM", "N", "DM","PT2"],
    Malinduwa:["M"]
  },
  allLines: 
    [
      "MT", "PH", "PW ", "PP", "GO", "UG", "MP", "BM", "TP", "UP","C-13","SLF","PT2",
      "NG", "S", "DR",
      "J", "T",  "TK", "HA", "D",
      "SELF", "DG", "ML", "MV",
      "BA", "BK", "K", "PT", "PK", "A", "KM", "N", "DM","M"
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
