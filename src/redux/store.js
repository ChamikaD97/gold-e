import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import officerSlice from "./officerSlice";




const store = configureStore({
  reducer: {
    auth: authReducer,
    officer: officerSlice,
    //engFail: failureReducer,
    //trips: tripsReducer,
  },
});

export default store;
