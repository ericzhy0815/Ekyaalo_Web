import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "https://ekyaalo-backend-70t6.onrender.com";

export const fetchCases = createAsyncThunk(
  "cases/fetchCases",
  async (_, { rejectWithValue }) => {
    try {
      const submissionsResponse = await axios.get(`${API_BASE_URL}/submission`);
      const submissions = submissionsResponse.data;

      const uniquePatientIds = [
        ...new Set(submissions.map((submission) => submission.patient_id)),
      ];

      const patientPromises = uniquePatientIds.map((patientId) =>
        axios.get(`${API_BASE_URL}/patient/${patientId}`)
      );
      const patientResponses = await Promise.all(patientPromises);
      const patients = patientResponses.map((response) => response.data);

      const patientMap = patients.reduce((acc, patient) => {
        acc[patient.id] = patient;
        return acc;
      }, {});

      const casesByPatient = submissions.reduce((acc, submission) => {
        const patientId = submission.patient_id;
        const patient = patientMap[patientId] || {
          fname: "Unknown",
          lname: "",
          birthdate: null,
          sex: null,
        };

        if (!acc[patientId]) {
          acc[patientId] = {
            id: patientId,
            submissionIds: [submission.sub_id],
            patient: {
              name: `${patient.fname || "Unknown"} ${
                patient.lname || ""
              }`.trim(),
              birthdate: patient.birthdate,
              sex: patient.sex,
            },
            date:
              submission.date_biopsy ||
              submission.time_added ||
              new Date().toISOString(),
            reviewed: submission.status === "Reviewed",
            specimen: submission.specimen || "N/A",
            status: submission.status || "Pending",
            issues: [],
          };
        } else {
          acc[patientId].submissionIds.push(submission.sub_id);
        }

        acc[patientId].issues.push({
          sub_id: submission.sub_id,
          date_biopsy: submission.date_biopsy,
          specimen: submission.specimen,
          stain: submission.stain,
          images: submission.assoc_images,
          symptoms: submission.symptoms,
          clinical_history: submission.patient_clinical_history,
          procedure: submission.procedure_performed,
          diagnosis: submission.differential_diagnosis,
          final_diagnosis: submission.final_diagnosis || null, // Store final_diagnosis
          location: submission.samples_location,
          status: submission.status,
          time_added: submission.time_added,
          operator_id: submission.operator_id,
          hc_id: submission.hc_id,
          req_phys_id: submission.req_phys_id,
        });

        return acc;
      }, {});

      const cases = Object.values(casesByPatient);
      return cases;
    } catch (error) {
      console.error("Error fetching cases:", error);
      if (error.response?.status === 401) {
        return rejectWithValue("Session expired. Please sign in again.");
      }
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch cases"
      );
    }
  }
);

export const updateCaseReviewed = createAsyncThunk(
  "cases/updateCaseReviewed",
  async ({ caseId, reviewed }, { rejectWithValue }) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/submission/${caseId}`,
        { status: reviewed ? "Reviewed" : "Pending" },
        {
          withCredentials: true,
        }
      );

      return { caseId, reviewed };
    } catch (error) {
      console.error("Error updating case reviewed status:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update case status"
      );
    }
  }
);

// New thunk to update final diagnosis
export const updateFinalDiagnosis = createAsyncThunk(
  "cases/updateFinalDiagnosis",
  async ({ subId, diagnosisData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/submission/${subId}/diagnosis`,
        diagnosisData,
        { withCredentials: true }
      );
      return { subId, final_diagnosis: response.data.final_diagnosis };
    } catch (error) {
      console.error("Error updating final diagnosis:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update final diagnosis"
      );
    }
  }
);

const casesSlice = createSlice({
  name: "cases",
  initialState: {
    cases: [],
    searchTerm: "",
    loading: false,
    error: null,
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchCases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCases.fulfilled, (state, action) => {
        state.loading = false;
        state.cases = action.payload;
      })
      .addCase(fetchCases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCaseReviewed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCaseReviewed.fulfilled, (state, action) => {
        state.loading = false;
        const { caseId, reviewed } = action.payload;
        state.cases = state.cases.map((c) =>
          c.id === caseId
            ? { ...c, reviewed, status: reviewed ? "Reviewed" : "Pending" }
            : c
        );
      })
      .addCase(updateCaseReviewed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateFinalDiagnosis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFinalDiagnosis.fulfilled, (state, action) => {
        state.loading = false;
        const { subId, final_diagnosis } = action.payload;
        state.cases = state.cases.map((c) => ({
          ...c,
          issues: c.issues.map((issue) =>
            issue.sub_id === subId ? { ...issue, final_diagnosis } : issue
          ),
        }));
      })
      .addCase(updateFinalDiagnosis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { toggleReviewed, setSearchTerm, addIssue } = casesSlice.actions;

export const selectCases = createSelector(
  (state) => state.cases.cases,
  (state) => state.cases.searchTerm,
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
        return new Date(a.date) - new Date(b.date);
      }
      return a.reviewed ? 1 : -1;
    });
  }
);

export default casesSlice.reducer;
