import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const API_BASE_URL = "https://ekyaalo-backend-70t6.onrender.com";

function IssuesTab({ caseItem, onOpenIssueDialog }) {
  const [issues, setIssues] = useState([]);
  const [issueComments, setIssueComments] = useState({});
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const user = useSelector((state) => state.auth.user || "User");
  const userLastName = user.lname || "User";
  const userFirstName = user.fname || "User";

  useEffect(() => {
    const fetchIssues = async () => {
      if (!caseItem || !caseItem.submissionIds || !caseItem.submissionIds[0]) {
        setError("Invalid case data");
        return;
      }
      setLoading(true);
      try {
        const subId = caseItem.submissionIds[0];
        const response = await axios.get(
          `${API_BASE_URL}/submission/${subId}/issues`
        );
        setIssues(response.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch issues");
        console.error("Error fetching issues:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, [caseItem]);

  const handleIssueCommentSubmit = async (e, issueId) => {
    e.preventDefault();
    const commentText = issueComments[issueId];
    if (commentText) {
      const newComment = {
        author: userLastName
          ? "Dr. " + userFirstName + " " + userLastName
          : "Dr. User", // Replace with actual user data if available
        text: commentText,
        timestamp: new Date().toISOString(),
      };
      try {
        const subId = caseItem.submissionIds[0];
        await axios.post(
          `${API_BASE_URL}/submission/${subId}/issues/${issueId}/comments`,
          newComment
        );
        setIssues((prev) =>
          prev.map((issue) =>
            issue.id === issueId
              ? { ...issue, comments: [...(issue.comments || []), newComment] }
              : issue
          )
        );
        setIssueComments((prev) => ({ ...prev, [issueId]: "" }));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to add comment");
        console.error("Error submitting comment:", err);
      }
    }
  };

  const handleToggleIssueStatus = async (issueId) => {
    const issue = issues.find((i) => i.id === issueId);
    if (!issue) {
      setError("Issue not found");
      return;
    }
    const newStatus = issue.status === "Open" ? "Closed" : "Open";
    setLoading(true);
    try {
      const subId = caseItem.submissionIds[0];
      await axios.patch(
        `${API_BASE_URL}/submission/${subId}/issues/${issueId}/status`,
        newStatus, // Send plain string as body
        {
          headers: {
            "Content-Type": "text/plain", // Set content type to text/plain
          },
        }
      );
      setIssues((prev) =>
        prev.map((issue) =>
          issue.id === issueId ? { ...issue, status: newStatus } : issue
        )
      );
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update status";
      setError(errorMessage);
      console.error("Error toggling issue status:", err, err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const sortedIssues = [...issues].sort((a, b) => {
    if (a.status === "Open" && b.status === "Closed") return -1;
    if (a.status === "Closed" && b.status === "Open") return 1;
    return 0;
  });

  const filteredIssues = sortedIssues.filter((issue) => {
    if (filter === "All") return true;
    return issue.status === filter;
  });

  if (loading) return <div>Loading issues...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Issues</h3>
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onOpenIssueDialog}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all"
        >
          Report Issue
        </button>
        <div className="flex space-x-4">
          <span
            onClick={() => setFilter("All")}
            className={`text-sm cursor-pointer ${
              filter === "All"
                ? "text-blue-600 underline"
                : "text-gray-600 hover:text-blue-500 hover:underline"
            }`}
          >
            All
          </span>
          <span
            onClick={() => setFilter("Open")}
            className={`text-sm cursor-pointer ${
              filter === "Open"
                ? "text-blue-600 underline"
                : "text-gray-600 hover:text-blue-500 hover:underline"
            }`}
          >
            Open
          </span>
          <span
            onClick={() => setFilter("Closed")}
            className={`text-sm cursor-pointer ${
              filter === "Closed"
                ? "text-blue-600 underline"
                : "text-gray-600 hover:text-blue-500 hover:underline"
            }`}
          >
            Closed
          </span>
        </div>
      </div>
      {filteredIssues.length > 0 ? (
        <div className="space-y-6">
          {filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className={`p-4 rounded-lg ${
                issue.status === "Open"
                  ? "bg-gray-100"
                  : "bg-gray-200 opacity-75"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${
                      issue.status === "Open" ? "bg-green-500" : "bg-gray-400"
                    }`}
                  ></span>
                  <h4
                    className={`text-lg font-medium ${
                      issue.status === "Open"
                        ? "text-gray-800"
                        : "text-gray-600"
                    }`}
                  >
                    {issue.title} #{issue.id}
                  </h4>
                </div>
                <button
                  onClick={() => handleToggleIssueStatus(issue.id)}
                  className={`px-3 py-1 text-sm rounded-md text-white ${
                    issue.status === "Open"
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-red-500 hover:bg-red-600"
                  } transition-all`}
                >
                  {issue.status === "Open" ? "Close Issue" : "Reopen Issue"}
                </button>
              </div>
              <p
                className={`text-sm ${
                  issue.status === "Open" ? "text-gray-600" : "text-gray-500"
                }`}
              >
                {issue.status} by {issue.createdBy} on{" "}
                {new Date(issue.createdAt).toLocaleString()}
              </p>
              {issue.description && (
                <p
                  className={`mt-2 text-sm ${
                    issue.status === "Open" ? "text-gray-700" : "text-gray-500"
                  }`}
                >
                  {issue.description}
                </p>
              )}
              {issue.imageLinks && issue.imageLinks.length > 0 && (
                <div className="mt-2">
                  <p
                    className={`text-sm ${
                      issue.status === "Open"
                        ? "text-gray-600"
                        : "text-gray-500"
                    }`}
                  >
                    Linked Images:
                  </p>
                  <div className="flex space-x-2">
                    {issue.imageLinks.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`Linked image ${idx + 1}`}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-4">
                {issue.comments && issue.comments.length > 0 ? (
                  <div className="space-y-3">
                    {issue.comments.map((comment, idx) => (
                      <div
                        key={idx}
                        className={`border-l-4 border-gray-300 pl-4 py-2 rounded-r-md ${
                          issue.status === "Open" ? "bg-white" : "bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-sm font-semibold ${
                              issue.status === "Open"
                                ? "text-gray-800"
                                : "text-gray-600"
                            }`}
                          >
                            {comment.author}
                          </span>
                          <span
                            className={`text-xs ${
                              issue.status === "Open"
                                ? "text-gray-500"
                                : "text-gray-400"
                            }`}
                          >
                            • {new Date(comment.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p
                          className={`mt-1 text-sm ${
                            issue.status === "Open"
                              ? "text-gray-700"
                              : "text-gray-500"
                          }`}
                        >
                          {comment.text}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p
                    className={`text-sm ${
                      issue.status === "Open"
                        ? "text-gray-500"
                        : "text-gray-400"
                    }`}
                  >
                    No comments yet.
                  </p>
                )}
                <form
                  onSubmit={(e) => handleIssueCommentSubmit(e, issue.id)}
                  className="mt-4 flex space-x-2"
                >
                  <input
                    type="text"
                    value={issueComments[issue.id] || ""}
                    onChange={(e) =>
                      setIssueComments((prev) => ({
                        ...prev,
                        [issue.id]: e.target.value,
                      }))
                    }
                    placeholder="Add a comment..."
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
                  >
                    Comment
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No issues match the selected filter.</p>
      )}
    </div>
  );
}

export default IssuesTab;
