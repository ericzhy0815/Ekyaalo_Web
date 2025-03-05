import { useState } from "react";

function DiagnosisDialog({ isOpen, diagnosis, onClose, onSubmit }) {
  const [nextSteps, setNextSteps] = useState("");
  const [explanation, setExplanation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nextSteps.trim()) {
      alert("Next Steps are required."); // Basic validation
      return;
    }
    onSubmit({ nextSteps, explanation });
    setNextSteps(""); // Reset fields after submission
    setExplanation("");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            Final Diagnosis: {diagnosis}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Next Steps */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Next Steps (Required)
            </label>
            <textarea
              value={nextSteps}
              onChange={(e) => setNextSteps(e.target.value)}
              required
              placeholder="Enter next steps..."
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[80px]"
            />
          </div>

          {/* Explanation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Explanation (Optional)
            </label>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Provide an explanation (optional)..."
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[80px]"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
            >
              Confirm Diagnosis
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DiagnosisDialog;
