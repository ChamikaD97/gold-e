import { configureStore } from "@reduxjs/toolkit";
import officerLineReducer from "./officerLineSlice";

import loaderReducer from "./loaderSlice";

import achievementReducer from "./achievementSlice";
import commonDataReducer from "./commonDataSlice";
import dailyLeafCountReducer from "./dailyLeafCountSlice";
const store = configureStore({
  reducer: {
    officerLine: officerLineReducer,
    loader: loaderReducer,
    achievement: achievementReducer,
    commonData: commonDataReducer,
    dailyLeafCount: dailyLeafCountReducer,
  }
});

export default store;
