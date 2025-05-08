import { configureStore } from "@reduxjs/toolkit";
import officerLineReducer from "./officerLineSlice";

import loaderReducer from "./loaderSlice";

import achievementReducer from "./achievementSlice";
const store = configureStore({
  reducer: {
    officerLine: officerLineReducer,
    loader: loaderReducer,
    achievement: achievementReducer,
  }
});

export default store;
