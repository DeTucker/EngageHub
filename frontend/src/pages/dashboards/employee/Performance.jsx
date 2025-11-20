import { useState, useEffect } from "react";
import { getMyPerformanceReviews } from "../../../api";
import { BarChart3, TrendingUp, Target, Award, Star } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading performance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 p-5 rounded-xl shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  const averageRating = performanceData.length > 0
    ? (performanceData.reduce((a, b) => a + (b.rating || 0), 0) / performanceData.length).toFixed(1)
    : "N/A";

  // Extract goals from reviews (goals is a simple string, not an array)
  const goalsText = performanceData
    .filter(review => review.goals && review.goals.trim())
    .map(review => ({
      text: review.goals,
      period: review.review_period,
      date: review.review_date
    }));

  return (
    <div>
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <BarChart3 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Performance Overview
            </h1>
            <p className="text-gray-600 mt-1">
              Review your performance ratings, manager feedback, and goals
            </p>
          </div>
        </div>
      </header>

      {/* Summary Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="group bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-white" />
            <h3 className="text-sm text-indigo-100 font-medium">Average Rating</h3>
          </div>
          <p className="text-5xl font-bold text-white mb-1">{averageRating}</p>
          <p className="text-xs text-indigo-200">Out of 5.0</p>
        </div>

        <div className="group bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-white" />
            <h3 className="text-sm text-green-100 font-medium">Total Reviews</h3>
          </div>
          <p className="text-5xl font-bold text-white mb-1">{performanceData.length}</p>
          <p className="text-xs text-green-200">Completed</p>
        </div>

        <div className="group bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-white" />
            <h3 className="text-sm text-yellow-100 font-medium">Goals Set</h3>
          </div>
          <p className="text-5xl font-bold text-white mb-1">{goalsText.length}</p>
          <p className="text-xs text-yellow-200">From reviews</p>
        </div>
      </div>

      {/* Performance Records */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-purple-600" />
          Performance Reviews
        </h2>
        {performanceData.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <BarChart3 className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">No performance reviews yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Period</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Rating</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Feedback</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Reviewer</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {performanceData.map((record, idx) => (
                  <tr key={record.id} className={`border-b border-gray-100 hover:bg-indigo-50/50 transition ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="px-6 py-4 font-medium text-gray-800">{record.review_period}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                        <Star className="w-4 h-4" />
                        {record.rating.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 max-w-md truncate">{record.feedback || "No feedback"}</td>
                    <td className="px-6 py-4 text-gray-700">{record.reviewer_name || "N/A"}</td>
                    <td className="px-6 py-4 text-gray-600">
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
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Target className="w-6 h-6 text-orange-600" />
          Performance Goals
        </h2>
        {goalsText.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <Target className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">No goals assigned yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {goalsText.map((goal, idx) => (
              <div
                key={idx}
                className="group p-6 border-2 border-indigo-100 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 hover:border-indigo-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 bg-white px-3 py-1 rounded-full shadow-sm">
                    <Target className="w-4 h-4" />
                    {goal.period}
                  </span>
                  <span className="text-xs text-gray-500">{new Date(goal.date).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-800 whitespace-pre-line leading-relaxed">{goal.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
