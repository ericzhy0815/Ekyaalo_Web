import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import casesReducer from "./casesSlice";

const loadPersistedState = () => {
  const persistedState = localStorage.getItem("authState");
  return persistedState ? JSON.parse(persistedState) : undefined;
};

const persistedAuthState = loadPersistedState();

const store = configureStore({
  reducer: {
    auth: authReducer,
    cases: casesReducer,
  },
  preloadedState: {
    auth: persistedAuthState,
  },
});

store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem("authState", JSON.stringify(state.auth));
});

export { store };
