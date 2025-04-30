// src/pages/Cases.jsx
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setSearchTerm, selectCases, fetchCases } from "../redux/casesSlice";
import { useEffect } from "react";

function Cases() {
  const dispatch = useDispatch();
  const sortedCases = useSelector(selectCases);
  const searchTerm = useSelector((state) => state.cases.searchTerm);

  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  useEffect(() => {
    dispatch(fetchCases());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          All Cases
        </h2>

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
              sortedCases.map((caseItem) => {
                const statusCounts = { Reviewed: 0, Pending: 0, Issue: 0 };

                caseItem.issues.forEach((issue) => {
                  if (issue.status === "Issue") {
                    statusCounts.Issue++;
                  } else if (issue.status === "Reviewed") {
                    statusCounts.Reviewed++;
                  } else {
                    statusCounts.Pending++;
                  }
                });

                let statusColor = "bg-green-500";
                if (statusCounts.Issue > 0) {
                  statusColor = "bg-red-500";
                } else if (statusCounts.Pending > 0) {
                  statusColor = "bg-yellow-400";
                }

                return (
                  <Link
                    key={caseItem.id}
                    to={`/cases/${caseItem.id}`}
                    className={`flex items-stretch hover:bg-gray-50 transition-all bg-white text-gray-900`}
                  >
                    <div className={`w-2 rounded-l ${statusColor}`}></div>

                    <div className="p-4 flex justify-between items-center flex-1">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium">
                          {caseItem.patient.name} (ID: {caseItem.id})
                        </h3>
                        <p className="text-sm text-gray-600">
                          Date: {caseItem.date}
                        </p>

                        {statusCounts.Issue > 0 && (
                          <p className="mt-1 inline-block bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs font-semibold">
                            Needs Review
                          </p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        {statusCounts.Issue > 0 && (
                          <span className="text-red-600">
                            🔴 {statusCounts.Issue}
                          </span>
                        )}
                        {statusCounts.Pending > 0 && (
                          <span className="text-yellow-600">
                            🟡 {statusCounts.Pending}
                          </span>
                        )}
                        {statusCounts.Reviewed > 0 && (
                          <span className="text-green-600">
                            🟢 {statusCounts.Reviewed}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })
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
