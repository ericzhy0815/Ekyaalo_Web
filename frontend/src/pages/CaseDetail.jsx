import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ImageViewerDialog from "./ImageViewerDialog";
import IssuesTab from "./IssuesTab";
import ImagesTab from "./ImagesTab";
import ReportIssueDialog from "./ReportIssueDialog";
import DiagnosisDialog from "./DiagnosisDialog";
import {
  addIssue,
  fetchCases,
  updateFinalDiagnosis,
} from "../redux/casesSlice";
import { toast } from "react-toastify";

// Utility function to calculate age from birthdate
const calculateAge = (birthdate) => {
  if (!birthdate) return "Unknown";
  const birthDate = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

function CaseDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const cases = useSelector((state) => state.cases.cases);
  const caseItem = cases.find((c) => c.id === parseInt(id));
  const loading = useSelector((state) => state.cases.loading);
  const error = useSelector((state) => state.cases.error);
  const issues = caseItem?.issues || [];

  // Local state for editing diagnosis
  const [diagnosis, setDiagnosis] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const [explanation, setExplanation] = useState("");
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isDiagnosisDialogOpen, setIsDiagnosisDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("images");
  const [issueCount, setIssueCount] = useState(issues.length);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);

  // Sync local state with Redux on caseItem change
  useEffect(() => {
    if (!caseItem && !loading && !error) {
      dispatch(fetchCases());
    } else if (caseItem) {
      const finalDiagnosis = caseItem.issues[0]?.final_diagnosis || {};
      setDiagnosis(finalDiagnosis.diagnosis || "");
      setNextSteps(finalDiagnosis.next_steps || "");
      setExplanation(finalDiagnosis.explanation || "");
      setIssueCount(caseItem.issues?.length || 0);
    }
  }, [dispatch, caseItem, loading, error]);

  if (!caseItem) return <div>Case not found</div>;

  const handleDiagnosisChange = (e) => {
    const newDiagnosis = e.target.value;
    setDiagnosis(newDiagnosis);
    if (newDiagnosis) {
      setIsDiagnosisDialogOpen(true);
    }
  };

  const handleDiagnosisSubmit = async ({ nextSteps, explanation }) => {
    try {
      const diagnosisData = {
        diagnosis,
        next_steps: nextSteps,
        explanation,
      };
      await dispatch(
        updateFinalDiagnosis({
          subId: caseItem.submissionIds[0],
          diagnosisData,
        })
      ).unwrap();
      setNextSteps(nextSteps);
      setExplanation(explanation);
      setIsDiagnosisDialogOpen(false);
      toast.success(`Diagnosis "${diagnosis}" confirmed with next steps.`);
    } catch (error) {
      toast.error(`Failed to update diagnosis: ${error}`);
    }
  };

  const handleDiagnosisDialogClose = () => {
    const finalDiagnosis = caseItem.issues[0]?.final_diagnosis || {};
    setDiagnosis(finalDiagnosis.diagnosis || "");
    setNextSteps(finalDiagnosis.next_steps || "");
    setExplanation(finalDiagnosis.explanation || "");
    setIsDiagnosisDialogOpen(false);
  };

  const handleOpenIssueDialog = () => setIsReportDialogOpen(true);

  const handleReportSubmit = (report) => {
    const newIssue = {
      id: (issues.length || 0) + 1,
      title: report.title || "Untitled Issue",
      description: report.description,
      status: "Open",
      createdBy: "Dr. User",
      createdAt: new Date().toISOString(),
      comments: [
        {
          author: "Dr. User",
          text: `${report.title}\n${report.description}`,
          timestamp: new Date().toISOString(),
        },
      ],
      imageLinks: report.imageLinks,
    };
    dispatch(addIssue({ caseId: caseItem.id, issue: newIssue }));
    setIssueCount(issues.length + 1);
    setIsReportDialogOpen(false);
    toast.success(`New issue "${report.title}" opened.`);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setIsImageViewerOpen(true);
  };

  const patientAge = calculateAge(caseItem.patient.birthdate);
  const patientGender = caseItem.patient.sex || "Unknown";
  const finalDiagnosis = caseItem.issues[0]?.final_diagnosis || {};

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {caseItem.submissionIds[0]} - {caseItem.patient.name} (ID:{" "}
            {caseItem.id})
          </h2>
          <Link
            to="/cases"
            className="text-blue-600 hover:underline font-medium"
          >
            Back to Cases
          </Link>
        </div>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("images")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "images"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } transition-all`}
          >
            Images
          </button>
          <button
            onClick={() => setActiveTab("issues")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "issues"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } transition-all`}
          >
            Issues
          </button>
        </div>

        {activeTab === "images" ? (
          <>
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Patient Details
              </h3>
              <p className="text-gray-600">Name: {caseItem.patient.name}</p>
              <p className="text-gray-600">Age: {patientAge}</p>
              <p className="text-gray-600">Gender: {patientGender}</p>
              <p className="text-gray-600">Date: {caseItem.date}</p>
              <p className="text-gray-600">
                Status:{" "}
                <span
                  className={`${
                    caseItem.status === "Reviewed"
                      ? "text-green-600"
                      : caseItem.status === "Issue"
                      ? "text-red-600"
                      : "text-yellow-600"
                  } font-medium`}
                >
                  {caseItem.status === "Submitted" ? "Open" : caseItem.status}
                </span>
              </p>
            </div>

            <ImagesTab caseItem={caseItem} onImageClick={handleImageClick} />

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Final Diagnosis
              </h3>
              <select
                value={diagnosis}
                onChange={handleDiagnosisChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Diagnosis</option>
                <option value="Unable to Diagnose">Unable to Diagnose</option>
                <option value="Malign">Malign</option>
                <option value="Benign">Benign</option>
                <option value="Suspicious">Suspicious</option>
                <option value="Other">Other</option>
              </select>
              <div className="mt-2 text-sm text-gray-600">
                {finalDiagnosis.diagnosis && (
                  <p>
                    Saved Diagnosis:{" "}
                    <span
                      className={`${
                        finalDiagnosis.diagnosis === "Benign"
                          ? "text-green-600"
                          : "text-red-600"
                      } font-medium`}
                    >
                      {finalDiagnosis.diagnosis}
                    </span>
                  </p>
                )}
                {diagnosis && diagnosis !== finalDiagnosis.diagnosis && (
                  <p>
                    Pending Diagnosis:{" "}
                    <span
                      className={`${
                        diagnosis === "Benign"
                          ? "text-green-600"
                          : "text-red-600"
                      } font-medium`}
                    >
                      {diagnosis}
                    </span>
                  </p>
                )}
                {(finalDiagnosis.next_steps || nextSteps) && (
                  <p>
                    Next Steps:{" "}
                    <span className="font-medium">
                      {finalDiagnosis.next_steps || nextSteps}
                    </span>
                  </p>
                )}
                {(finalDiagnosis.explanation || explanation) && (
                  <p>
                    Explanation:{" "}
                    <span className="font-medium">
                      {finalDiagnosis.explanation || explanation}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </>
        ) : (
          <IssuesTab
            key={issueCount}
            issues={issues}
            caseId={caseItem.id}
            caseItem={caseItem}
            onOpenIssueDialog={handleOpenIssueDialog}
          />
        )}
      </div>

      {isImageViewerOpen && (
        <ImageViewerDialog
          imageUrl={selectedImageUrl}
          onClose={() => setIsImageViewerOpen(false)}
        />
      )}
      {isReportDialogOpen && (
        <ReportIssueDialog
          caseItem={caseItem}
          onClose={() => setIsReportDialogOpen(false)}
          onSubmit={handleReportSubmit}
        />
      )}
      {isDiagnosisDialogOpen && (
        <DiagnosisDialog
          isOpen={isDiagnosisDialogOpen}
          diagnosis={diagnosis}
          onClose={handleDiagnosisDialogClose}
          onSubmit={handleDiagnosisSubmit}
        />
      )}
    </div>
  );
}

export default CaseDetail;
