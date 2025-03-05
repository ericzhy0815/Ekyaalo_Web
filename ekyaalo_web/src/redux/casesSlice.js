import { createSlice, createSelector } from "@reduxjs/toolkit";
import initialCases from "../data/cases";

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
    addIssue: (state, action) => {
      const { caseId, issue } = action.payload;
      state.cases = state.cases.map((c) =>
        c.id === caseId ? { ...c, issues: [...(c.issues || []), issue] } : c
      );
      console.log("addIssue - Updated cases with new issue for case", caseId);
    },
  },
});

export const { toggleReviewed, setSearchTerm, addIssue } = casesSlice.actions;

// Memoized selector
export const selectCases = createSelector(
  (state) => state.cases.cases, // Input selector 1: Raw cases array
  (state) => state.cases.searchTerm, // Input selector 2: Search term
  (cases, searchTerm) => {
    const filteredCases = cases.filter((caseItem) => {
      const searchLower = searchTerm.toLowerCase();
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
  }
);

export default casesSlice.reducer;
