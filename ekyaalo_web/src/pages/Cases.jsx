// src/pages/Cases.jsx
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toggleReviewed, setSearchTerm } from "../redux/casesSlice";
import { selectCases } from "../redux/casesSlice";

function Cases() {
  const dispatch = useDispatch();
  const sortedCases = useSelector(selectCases);
  const searchTerm = useSelector((state) => state.cases.searchTerm);

  const handleToggleReviewed = (id) => {
    dispatch(toggleReviewed(id));
  };

  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          All Cases
        </h2>
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by patient name or ID..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            {sortedCases.length > 0 ? (
              sortedCases.map((caseItem) => (
                <Link
                  key={caseItem.id}
                  to={`/cases/${caseItem.id}`}
                  className={`p-4 flex justify-between items-center hover:bg-gray-50 transition-all ${
                    caseItem.reviewed
                      ? "bg-gray-100 text-gray-500"
                      : "bg-white text-gray-900"
                  }`}
                >
                  <div className="flex-1">
                    <h3
                      className={`text-lg font-medium ${
                        caseItem.reviewed ? "line-through" : ""
                      }`}
                    >
                      {caseItem.title} - {caseItem.patient.name} (ID:{" "}
                      {caseItem.id})
                    </h3>
                    <p className="text-sm">Date: {caseItem.date}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        caseItem.status === "Open"
                          ? "bg-green-100 text-green-800"
                          : caseItem.status === "Closed"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      } ${caseItem.reviewed ? "opacity-50" : ""}`}
                    >
                      {caseItem.status}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleToggleReviewed(caseItem.id);
                      }}
                      className="text-sm px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
                    >
                      {caseItem.reviewed ? "Unmark" : "Mark Reviewed"}
                    </button>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No cases found matching your search.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cases;
