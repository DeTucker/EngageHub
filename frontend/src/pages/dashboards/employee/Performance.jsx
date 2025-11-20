import { useState, useEffect } from "react";
import { getMyPerformanceReviews } from "../../../api";

export default function Performance() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [performanceData, setPerformanceData] = useState([]);

  useEffect(() => {
    fetchPerformance();
  }, []);

  const fetchPerformance = async () => {
    try {
      const res = await getMyPerformanceReviews();
      setPerformanceData(res.data.data || []);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load performance data");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading performance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  const averageRating = performanceData.length > 0
    ? (performanceData.reduce((a, b) => a + (b.rating || 0), 0) / performanceData.length).toFixed(1)
    : "N/A";

  // Extract all goals from reviews
  const allGoals = performanceData.flatMap(review => review.goals || []);
  const completedGoals = allGoals.filter(g => g.status?.toLowerCase() === "completed").length;
  const pendingGoals = allGoals.length - completedGoals;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">📊 Performance Overview</h1>
      <p className="text-gray-600 mb-6">
        Review your performance ratings, manager feedback, and goals.
      </p>
      {/* Summary Section */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-sm text-gray-500">Average Rating</h3>
          <p className="text-3xl font-bold text-indigo-600">{averageRating}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-sm text-gray-500">Completed Goals</h3>
          <p className="text-3xl font-bold text-green-600">{completedGoals}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-sm text-gray-500">Pending Goals</h3>
          <p className="text-3xl font-bold text-yellow-500">{pendingGoals}</p>
        </div>
      </div>

      {/* Performance Records */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Performance Reviews</h2>
        {performanceData.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No performance reviews yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Period</th>
                  <th className="px-4 py-2 border">Rating</th>
                  <th className="px-4 py-2 border">Feedback</th>
                  <th className="px-4 py-2 border">Reviewer</th>
                  <th className="px-4 py-2 border">Date</th>
                </tr>
              </thead>
              <tbody>
                {performanceData.map((record) => (
                  <tr key={record.id} className="text-center">
                    <td className="px-4 py-2 border">{record.review_period}</td>
                    <td className="px-4 py-2 border font-semibold text-indigo-600">
                      {record.rating.toFixed(1)}
                    </td>
                    <td className="px-4 py-2 border text-left">{record.feedback || "No feedback"}</td>
                    <td className="px-4 py-2 border">{record.reviewer_name || "N/A"}</td>
                    <td className="px-4 py-2 border">
                      {new Date(record.review_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Goals Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Performance Goals</h2>
        {allGoals.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No goals assigned yet.</p>
        ) : (
          <ul className="space-y-3">
            {allGoals.map((goal, idx) => (
              <li
                key={idx}
                className={`p-4 border rounded-lg flex justify-between items-center ${
                  goal.status?.toLowerCase() === "completed"
                    ? "bg-green-50 border-green-300"
                    : goal.status?.toLowerCase() === "in progress"
                    ? "bg-yellow-50 border-yellow-300"
                    : "bg-gray-50 border-gray-300"
                }`}
              >
                <span>{goal.description || goal.goal || "Goal description"}</span>
                <span
                  className={`text-sm font-medium capitalize ${
                    goal.status?.toLowerCase() === "completed"
                      ? "text-green-700"
                      : goal.status?.toLowerCase() === "in progress"
                      ? "text-yellow-700"
                      : "text-gray-500"
                  }`}
                >
                  {goal.status || "Pending"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
