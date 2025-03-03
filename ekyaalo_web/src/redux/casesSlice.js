// src/redux/casesSlice.js
import { createSlice } from "@reduxjs/toolkit";
import initialCases from "../data/cases"; // Import initial data

const casesSlice = createSlice({
  name: "cases",
  initialState: {
    cases: initialCases,
    searchTerm: "",
  },
  reducers: {
    toggleReviewed: (state, action) => {
      const id = action.payload;
      state.cases = state.cases.map((c) =>
        c.id === id ? { ...c, reviewed: !c.reviewed } : c
      );
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
});

export const { toggleReviewed, setSearchTerm } = casesSlice.actions;

// Selectors
export const selectCases = (state) => {
  const filteredCases = state.cases.cases.filter((caseItem) => {
    const searchLower = state.cases.searchTerm.toLowerCase();
    return (
      caseItem.patient.name.toLowerCase().includes(searchLower) ||
      caseItem.id.toString().includes(searchLower)
    );
  });

  return filteredCases.sort((a, b) => {
    if (a.reviewed === b.reviewed) {
      return new Date(a.date) - new Date(b.date); // Oldest first
    }
    return a.reviewed ? 1 : -1; // Reviewed at bottom
  });
};

export default casesSlice.reducer;
