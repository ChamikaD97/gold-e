import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import engineReducer from "./engineSlice";
import failureReducer from "./failureSlice";

import tripsReducer from "./tripCardSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    eng: engineReducer,
    engFail: failureReducer,
    trips: tripsReducer,
  },
});

export default store;
