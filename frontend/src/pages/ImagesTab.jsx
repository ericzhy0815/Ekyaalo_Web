import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSubmissionImages,
  updateFinalDiagnosis,
} from "../redux/casesSlice";
import DiagnosisDialog from "./DiagnosisDialog";
import { toast } from "react-toastify";

function ImagesTab({ caseItem, onImageClick }) {
  const dispatch = useDispatch();
  const submissionIds = caseItem.submissionIds || [];
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(
    submissionIds[0]
  );

  const submissionDetails = caseItem.issues.find(
    (issue) => issue.sub_id === Number(selectedSubmissionId)
  );

  const [diagnosis, setDiagnosis] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const [explanation, setExplanation] = useState("");
  const [isDiagnosisDialogOpen, setIsDiagnosisDialogOpen] = useState(false);

  useEffect(() => {
    if (submissionDetails?.final_diagnosis) {
      setDiagnosis(submissionDetails.final_diagnosis.diagnosis || "");
      setNextSteps(submissionDetails.final_diagnosis.next_steps || "");
      setExplanation(submissionDetails.final_diagnosis.explanation || "");
    } else {
      setDiagnosis("");
      setNextSteps("");
      setExplanation("");
    }
  }, [selectedSubmissionId, submissionDetails]);

  const imagesBySubmission = useSelector(
    (state) => state.cases.imagesBySubmission
  );
  const images = imagesBySubmission[selectedSubmissionId] || [];

  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedSubmissionId) {
      dispatch(fetchSubmissionImages(selectedSubmissionId));
    }
  }, [dispatch, selectedSubmissionId]);

  useEffect(() => {
    setSelectedSlideIndex(0);
    setSelectedImageIndex(0);
  }, [images]);

  useEffect(() => {
    const fetchImages = async () => {
      if (!selectedSubmissionId) return;
      try {
        setIsLoading(true);
        await dispatch(fetchSubmissionImages(selectedSubmissionId)).unwrap();
      } catch (error) {
        toast.error("Failed to load images." + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [dispatch, selectedSubmissionId]);

  const handlePrevImage = () => {
    const slide = images[selectedSlideIndex];
    const list = slide?.imagelist || [];
    setSelectedImageIndex((prev) => (prev - 1 + list.length) % list.length);
  };

  const handleNextImage = () => {
    const slide = images[selectedSlideIndex];
    const list = slide?.imagelist || [];
    setSelectedImageIndex((prev) => (prev + 1) % list.length);
  };

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
          subId: selectedSubmissionId,
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
    if (submissionDetails?.final_diagnosis) {
      setDiagnosis(submissionDetails.final_diagnosis.diagnosis || "");
      setNextSteps(submissionDetails.final_diagnosis.next_steps || "");
      setExplanation(submissionDetails.final_diagnosis.explanation || "");
    }
    setIsDiagnosisDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="mb-8 text-center text-gray-500">
        <p>Loading submissions...</p>
      </div>
    );
  }

  if (!images.length) {
    return (
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Images</h3>
        <p className="text-gray-600">
          No images available for this submission.
        </p>
      </div>
    );
  }

  const currentSlide = images[selectedSlideIndex];
  const currentImage = currentSlide.imagelist[selectedImageIndex].first;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Submissions</h3>
        <select
          value={selectedSubmissionId}
          onChange={(e) => {
            setSelectedSubmissionId(Number(e.target.value));
            setSelectedSlideIndex(0);
            setSelectedImageIndex(0);
          }}
          className="border rounded p-2 text-sm"
        >
          {[...caseItem.issues]
            .sort((a, b) => {
              const aHasDiagnosis = !!a.final_diagnosis;
              const bHasDiagnosis = !!b.final_diagnosis;
              return aHasDiagnosis - bHasDiagnosis;
            })
            .map((issue) => {
              const status = issue.status || "Pending";
              let dot = "⚪";
              if (issue.status === "Issue") {
                dot = "🔴";
              } else if (status === "Reviewed") {
                dot = "🟢";
              } else {
                dot = "🟡";
              }

              return (
                <option key={issue.sub_id} value={issue.sub_id}>
                  {dot} Submission {issue.sub_id} – {status}
                </option>
              );
            })}
        </select>
      </div>

      {submissionDetails && (
        <div className="bg-gray-100 p-4 rounded mb-4 text-sm text-gray-700">
          <p>
            <strong>Date:</strong> {submissionDetails.date_biopsy}
          </p>
          <p>
            <strong>Specimen:</strong> {submissionDetails.specimen}
          </p>
          <p>
            <strong>Stain:</strong> {submissionDetails.stain}
          </p>
          <p>
            <strong>Symptoms:</strong> {submissionDetails.symptoms}
          </p>
          <p>
            <strong>Procedure:</strong> {submissionDetails.procedure}
          </p>
        </div>
      )}

      <div className="mb-4">
        <label className="mr-2 text-sm">Slide:</label>
        <select
          value={selectedSlideIndex}
          onChange={(e) => {
            setSelectedSlideIndex(Number(e.target.value));
            setSelectedImageIndex(0);
          }}
          className="border rounded p-2 text-sm"
        >
          {images.map((slide, idx) => (
            <option key={idx} value={idx}>
              Slide {idx + 1}
            </option>
          ))}
        </select>
      </div>

      <div className="relative">
        <div className="flex justify-center items-center">
          <button
            onClick={handlePrevImage}
            className="absolute left-0 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700"
          >
            ‹
          </button>
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() =>
              onImageClick(`data:image/jpeg;base64,${currentImage.url}`)
            }
          >
            <img
              src={`data:image/jpeg;base64,${currentImage.url}`}
              alt={`Slide ${selectedSlideIndex + 1} - Image ${
                selectedImageIndex + 1
              }`}
              className="w-96 h-96 object-cover rounded-lg shadow-md"
            />
            <p className="mt-2 text-sm font-medium">
              Tag:{" "}
              <span
                className={
                  currentImage.type === "Positive"
                    ? "text-red-600"
                    : "text-green-600"
                }
              >
                {currentImage.type}
              </span>
            </p>
          </div>
          <button
            onClick={handleNextImage}
            className="absolute right-0 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700"
          >
            ›
          </button>
        </div>
        <p className="text-center mt-2 text-gray-600 text-sm">
          Image {selectedImageIndex + 1} of {currentSlide.imagelist.length}{" "}
          (Slide {selectedSlideIndex + 1})
        </p>
      </div>

      <div className="mt-8">
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
          <option value="Malign">Malignant</option>
          <option value="Benign">Benign</option>
          <option value="Suspicious">Suspicious</option>
          <option value="Other">Other</option>
        </select>
        <div className="mt-2 text-sm text-gray-600">
          {submissionDetails?.final_diagnosis?.diagnosis && (
            <p>
              Saved Diagnosis:{" "}
              <span
                className={`${
                  submissionDetails.final_diagnosis.diagnosis === "Benign"
                    ? "text-green-600"
                    : "text-red-600"
                } font-medium`}
              >
                {submissionDetails.final_diagnosis.diagnosis}
              </span>
            </p>
          )}
          {diagnosis &&
            diagnosis !== submissionDetails?.final_diagnosis?.diagnosis && (
              <p>
                Pending Diagnosis:{" "}
                <span
                  className={`${
                    diagnosis === "Benign" ? "text-green-600" : "text-red-600"
                  } font-medium`}
                >
                  {diagnosis}
                </span>
              </p>
            )}
          {(submissionDetails?.final_diagnosis?.next_steps || nextSteps) && (
            <p>
              Next Steps:{" "}
              <span className="font-medium">
                {submissionDetails?.final_diagnosis?.next_steps || nextSteps}
              </span>
            </p>
          )}
          {(submissionDetails?.final_diagnosis?.explanation || explanation) && (
            <p>
              Explanation:{" "}
              <span className="font-medium">
                {submissionDetails?.final_diagnosis?.explanation || explanation}
              </span>
            </p>
          )}
        </div>
      </div>

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

export default ImagesTab;
