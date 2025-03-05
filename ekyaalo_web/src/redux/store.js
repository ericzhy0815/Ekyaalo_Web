import { configureStore } from "@reduxjs/toolkit";
import casesReducer from "./casesSlice";

const store = configureStore({
  reducer: {
    cases: casesReducer,
  },
});

export { store };
