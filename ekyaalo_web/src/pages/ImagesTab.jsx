import { useState } from "react";

function ImagesTab({ caseItem, onImageClick }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comments, setComments] = useState(
    caseItem.images.map((img) => img.comments)
  );
  const [subcommentText, setSubcommentText] = useState({});

  const handleNextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % caseItem.images.length);
  const handlePrevImage = () =>
    setCurrentImageIndex((prev) =>
      prev === 0 ? caseItem.images.length - 1 : prev - 1
    );
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

  return (
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
            onClick={() => onImageClick(caseItem.images[currentImageIndex].url)}
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

      {/* Comments */}
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
                            • {new Date(subcomment.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-700">
                          {subcomment.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
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
        <form onSubmit={handleCommentSubmit} className="mt-4 flex space-x-2">
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
  );
}

export default ImagesTab;
