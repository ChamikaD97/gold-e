import { configureStore } from "@reduxjs/toolkit";
import officerLineReducer from "./officerLineSlice";

import loaderReducer from "./loaderSlice";

import achievementReducer from "./achievementSlice";
import commonDataReducer from "./commonDataSlice";
const store = configureStore({
  reducer: {
    officerLine: officerLineReducer,
    loader: loaderReducer,
    achievement: achievementReducer,
    commonData: commonDataReducer,
  }
});

export default store;
