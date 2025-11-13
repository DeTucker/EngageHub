import { useState, useEffect } from "react";

export default function Performance() {
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState([]);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setPerformanceData([
        {
          id: 1,
          period: "Q1 2025",
          rating: 4.5,
          feedback: "Excellent teamwork and timely delivery.",
          evaluator: "HR Manager",
        },
        {
          id: 2,
          period: "Q4 2024",
          rating: 4.2,
          feedback: "Strong leadership and problem-solving.",
          evaluator: "Supervisor",
        },
        {
          id: 3,
          period: "Q3 2024",
          rating: 3.8,
          feedback: "Good performance but needs better time management.",
          evaluator: "Team Lead",
        },
      ]);

      setGoals([
        { id: 1, goal: "Improve communication with team", status: "In Progress" },
        { id: 2, goal: "Complete leadership training", status: "Completed" },
        { id: 3, goal: "Increase sales conversions by 10%", status: "Pending" },
      ]);

      setLoading(false);
    }, 800);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">📊 Performance Overview</h1>
      <p className="text-gray-600 mb-6">
        Review your performance ratings, manager feedback, and goals.
      </p>

      {loading ? (
        <p>Loading performance data...</p>
      ) : (
        <>
          {/* Summary Section */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white shadow rounded-lg p-4 text-center">
              <h3 className="text-sm text-gray-500">Average Rating</h3>
              <p className="text-3xl font-bold text-indigo-600">
                {(
                  performanceData.reduce((a, b) => a + b.rating, 0) /
                  performanceData.length
                ).toFixed(1)}
              </p>
            </div>

            <div className="bg-white shadow rounded-lg p-4 text-center">
              <h3 className="text-sm text-gray-500">Completed Goals</h3>
              <p className="text-3xl font-bold text-green-600">
                {goals.filter((g) => g.status === "Completed").length}
              </p>
            </div>

            <div className="bg-white shadow rounded-lg p-4 text-center">
              <h3 className="text-sm text-gray-500">Pending Goals</h3>
              <p className="text-3xl font-bold text-yellow-500">
                {goals.filter((g) => g.status !== "Completed").length}
              </p>
            </div>
          </div>

          {/* Performance Records */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Performance Reviews</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border">Period</th>
                    <th className="px-4 py-2 border">Rating</th>
                    <th className="px-4 py-2 border">Feedback</th>
                    <th className="px-4 py-2 border">Evaluator</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceData.map((record) => (
                    <tr key={record.id} className="text-center">
                      <td className="px-4 py-2 border">{record.period}</td>
                      <td className="px-4 py-2 border font-semibold text-indigo-600">
                        {record.rating}
                      </td>
                      <td className="px-4 py-2 border">{record.feedback}</td>
                      <td className="px-4 py-2 border">{record.evaluator}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Goals Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Performance Goals</h2>
            <ul className="space-y-3">
              {goals.map((goal) => (
                <li
                  key={goal.id}
                  className={`p-4 border rounded-lg flex justify-between items-center ${
                    goal.status === "Completed"
                      ? "bg-green-50 border-green-300"
                      : goal.status === "In Progress"
                      ? "bg-yellow-50 border-yellow-300"
                      : "bg-gray-50 border-gray-300"
                  }`}
                >
                  <span>{goal.goal}</span>
                  <span
                    className={`text-sm font-medium ${
                      goal.status === "Completed"
                        ? "text-green-700"
                        : goal.status === "In Progress"
                        ? "text-yellow-700"
                        : "text-gray-500"
                    }`}
                  >
                    {goal.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
