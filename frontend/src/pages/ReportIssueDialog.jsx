import { useState, useRef } from "react";
import axios from "axios";

const API_BASE_URL = "https://ekyaalo-backend-70t6.onrender.com";

function ReportIssueDialog({ caseItem, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState([]); // Store indices as IDs
  const [showImageDropdown, setShowImageDropdown] = useState(false);
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);

  const allImages = caseItem.issues.flatMap((issue) =>
    issue.images.flatMap((slide, slideIndex) =>
      slide.imagelist.map((pair, pairIndex) => ({
        id: `${slideIndex + 1} - ${pairIndex + 1}`,
        url: pair.first.image,
        tag: pair.first.type,
      }))
    )
  );

  const handleImageToggle = (imageId) => {
    setSelectedImages((prev) =>
      prev.includes(imageId)
        ? prev.filter((id) => id !== imageId)
        : [...prev, imageId]
    );
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);
    if (value.endsWith("#")) {
      setShowImageDropdown(true);
    } else if (showImageDropdown && !value.endsWith("#")) {
      setShowImageDropdown(false);
    }
  };

  const handleImageSelect = (imageId) => {
    const textarea = textareaRef.current;
    const cursorPos = textarea.selectionStart;
    const textBefore = description.substring(0, cursorPos - 1); // Remove the '#'
    const textAfter = description.substring(cursorPos);
    const newText = `${textBefore}#${imageId}${textAfter}`;
    setDescription(newText);
    setShowImageDropdown(false);
    setSelectedImages((prev) =>
      prev.includes(imageId) ? prev : [...prev, imageId]
    );
    textarea.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Extract image IDs from description (e.g., #0-0, #0-1)
    const imageIdMatches = description.match(/#(\d+-\d+)/g) || [];
    const descriptionImageIds = imageIdMatches.map((match) =>
      match.replace("#", "")
    );
    const allSelectedImages = [
      ...new Set([...selectedImages, ...descriptionImageIds]),
    ].filter((id) => allImages.some((img) => img.id === id));

    const report = {
      id: Date.now(), // Temporary ID; backend should assign a unique one
      status: "Open",
      createdBy: "Dr. User", // Replace with actual user data if available
      createdAt: new Date().toISOString(),
      title: title || "Untitled Issue",
      description: description,
      imageLinks: allSelectedImages
        .map((id) => allImages.find((img) => img.id === id)?.url || "")
        .filter(Boolean),
      comments: [],
    };

    try {
      const subId = caseItem.submissionIds[0];
      const response = await axios.post(
        `${API_BASE_URL}/submission/${subId}/issues`,
        report,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      onSubmit(response.data);
      setTitle("");
      setDescription("");
      setSelectedImages([]);
      setShowImageDropdown(false);
      onClose();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to report issue";
      setError(errorMessage);
      console.error("Error reporting issue:", err);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">Report an Issue</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter issue title..."
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              ref={textareaRef}
              value={description}
              onChange={handleDescriptionChange}
              required
              placeholder="Describe the issue... (type # to reference images)"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[100px]"
            />
            {showImageDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                {allImages.map((image) => (
                  <div
                    key={image.id}
                    onClick={() => handleImageSelect(image.id)}
                    className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    #{image.id} - {image.tag}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Image Links */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link Images (Optional)
            </label>
            <div className="space-y-2">
              {allImages.map((image) => (
                <div key={image.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`image-${image.id}`}
                    checked={selectedImages.includes(image.id)}
                    onChange={() => handleImageToggle(image.id)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`image-${image.id}`}
                    className="text-sm text-gray-600"
                  >
                    Image {image.id} ({image.tag})
                  </label>
                </div>
              ))}
            </div>
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
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all"
            >
              Open Issue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReportIssueDialog;
