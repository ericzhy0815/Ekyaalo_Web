// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import casesReducer from "./casesSlice";

export const store = configureStore({
  reducer: {
    cases: casesReducer,
  },
});
