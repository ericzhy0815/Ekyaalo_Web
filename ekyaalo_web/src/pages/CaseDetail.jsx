import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReportIssueDialog from "./ReportIssueDialog";
import ImageViewerDialog from "./ImageViewerDialog"; // New dialog component
import cases from "../data/cases";

function CaseDetail() {
  const { id } = useParams();
  const caseItem = cases.find((c) => c.id === parseInt(id));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comments, setComments] = useState(
    caseItem.images.map((img) => img.comments)
  );
  const [diagnosis, setDiagnosis] = useState(caseItem.diagnosis);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [subcommentText, setSubcommentText] = useState({});

  if (!caseItem) return <div>Case not found</div>;

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % caseItem.images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? caseItem.images.length - 1 : prev - 1
    );
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    const commentText = e.target.comment.value;
    if (commentText) {
      const newComment = {
        pathologist: "Dr. User",
        text: commentText,
        timestamp: new Date().toISOString(),
        subcomments: [],
      };
      setComments((prev) =>
        prev.map((imgComments, idx) =>
          idx === currentImageIndex ? [...imgComments, newComment] : imgComments
        )
      );
      e.target.reset();
    }
  };

  const handleSubcommentSubmit = (e, commentIdx) => {
    e.preventDefault();
    const subcomment = subcommentText[commentIdx];
    if (subcomment) {
      const newSubcomment = {
        pathologist: "Dr. User",
        text: subcomment,
        timestamp: new Date().toISOString(),
      };
      setComments((prev) =>
        prev.map((imgComments, idx) =>
          idx === currentImageIndex
            ? imgComments.map((comment, i) =>
                i === commentIdx
                  ? {
                      ...comment,
                      subcomments: [
                        ...(comment.subcomments || []),
                        newSubcomment,
                      ],
                    }
                  : comment
              )
            : imgComments
        )
      );
      setSubcommentText((prev) => ({ ...prev, [commentIdx]: "" }));
    }
  };

  const handleDiagnosisChange = (e) => {
    setDiagnosis(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {caseItem.title}
          </h2>
          <div className="space-x-4">
            <button
              onClick={() => setIsReportDialogOpen(true)}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Report Issue
            </button>
            <Link
              to="/cases"
              className="text-blue-600 hover:underline font-medium"
            >
              Back to Cases
            </Link>
          </div>
        </div>

        {/* Patient Details */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Patient Details
          </h3>
          <p className="text-gray-600">Name: {caseItem.patient.name}</p>
          <p className="text-gray-600">Age: {caseItem.patient.age}</p>
          <p className="text-gray-600">Gender: {caseItem.patient.gender}</p>
          <p className="text-gray-600">Date: {caseItem.date}</p>
          <p className="text-gray-600">
            Status:{" "}
            <span
              className={`${
                caseItem.status === "Open"
                  ? "text-green-600"
                  : caseItem.status === "Closed"
                  ? "text-red-600"
                  : "text-yellow-600"
              } font-medium`}
            >
              {caseItem.status}
            </span>
          </p>
        </div>

        {/* Image Carousel */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Images</h3>
          <div className="relative">
            <div className="flex justify-center items-center">
              <button
                onClick={handlePrevImage}
                className="absolute left-0 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-all"
              >
                ‹
              </button>
              <div
                className="flex flex-col items-center cursor-pointer"
                onClick={() => setIsImageViewerOpen(true)}
              >
                <img
                  src={caseItem.images[currentImageIndex].url}
                  alt={`Image ${currentImageIndex + 1}`}
                  className="w-96 h-96 object-cover rounded-lg shadow-md"
                />
                <p className="mt-2 text-sm font-medium">
                  Tag:{" "}
                  <span
                    className={`${
                      caseItem.images[currentImageIndex].tag === "Benign"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {caseItem.images[currentImageIndex].tag}
                  </span>
                </p>
              </div>
              <button
                onClick={handleNextImage}
                className="absolute right-0 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-all"
              >
                ›
              </button>
            </div>
            <p className="text-center mt-2 text-gray-600">
              Image {currentImageIndex + 1} of {caseItem.images.length}
            </p>
          </div>

          {/* Reddit-Style Comments with Subcomments */}
          <div className="mt-6">
            <h4 className="text-lg font-medium text-gray-700 mb-4">Comments</h4>
            {comments[currentImageIndex].length > 0 ? (
              <div className="space-y-4">
                {comments[currentImageIndex].map((comment, idx) => (
                  <div
                    key={idx}
                    className="border-l-4 border-gray-300 pl-4 py-2 bg-gray-50 rounded-r-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-gray-800">
                          {comment.pathologist}
                        </span>
                        <span className="text-xs text-gray-500">
                          • {new Date(comment.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <button className="hover:text-blue-600">▲</button>
                        <span className="text-xs">0</span>
                        <button className="hover:text-red-600">▼</button>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-700">{comment.text}</p>
                    {/* Subcomments */}
                    {comment.subcomments && comment.subcomments.length > 0 && (
                      <div className="ml-4 mt-2 space-y-2">
                        {comment.subcomments.map((subcomment, subIdx) => (
                          <div
                            key={subIdx}
                            className="border-l-2 border-gray-200 pl-3 py-1 bg-gray-100 rounded-r-md"
                          >
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-semibold text-gray-800">
                                {subcomment.pathologist}
                              </span>
                              <span className="text-xs text-gray-500">
                                •{" "}
                                {new Date(
                                  subcomment.timestamp
                                ).toLocaleString()}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-gray-700">
                              {subcomment.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Subcomment Form */}
                    <form
                      onSubmit={(e) => handleSubcommentSubmit(e, idx)}
                      className="mt-2 flex space-x-2"
                    >
                      <input
                        type="text"
                        value={subcommentText[idx] || ""}
                        onChange={(e) =>
                          setSubcommentText((prev) => ({
                            ...prev,
                            [idx]: e.target.value,
                          }))
                        }
                        placeholder="Reply..."
                        className="flex-1 p-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        type="submit"
                        className="px-2 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
                      >
                        Reply
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-4">No comments yet.</p>
            )}
            <form
              onSubmit={handleCommentSubmit}
              className="mt-4 flex space-x-2"
            >
              <input
                type="text"
                name="comment"
                placeholder="Add a comment..."
                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
              >
                Post
              </button>
            </form>
          </div>
        </div>

        {/* Final Diagnosis */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Final Diagnosis
          </h3>
          <select
            value={diagnosis || ""}
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
          {diagnosis && (
            <p className="mt-2 text-sm text-gray-600">
              Current Diagnosis:{" "}
              <span
                className={`${
                  diagnosis === "Benign" ? "text-green-600" : "text-red-600"
                } font-medium`}
              >
                {diagnosis}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Dialogs */}
      {isReportDialogOpen && (
        <ReportIssueDialog
          caseItem={caseItem}
          onClose={() => setIsReportDialogOpen(false)}
        />
      )}
      {isImageViewerOpen && (
        <ImageViewerDialog
          imageUrl={caseItem.images[currentImageIndex].url}
          onClose={() => setIsImageViewerOpen(false)}
        />
      )}
    </div>
  );
}

export default CaseDetail;
