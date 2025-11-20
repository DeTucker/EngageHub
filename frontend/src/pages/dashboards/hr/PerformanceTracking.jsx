import { useState, useEffect } from "react";
import { getAllPerformanceReviews, getPerformanceStatistics } from "../../../api";
import { TrendingUp, Award, AlertCircle, BarChart3 } from "lucide-react";

export default function PerformanceTracking() {
  const [reviews, setReviews] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reviewsRes, statsRes] = await Promise.all([
        getAllPerformanceReviews(),
        getPerformanceStatistics(),
      ]);
      setReviews(reviewsRes.data.data || []);
      setStatistics(statsRes.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load performance data");
      setLoading(false);
    }
  };

  const getColor = (rating) => {
    if (rating >= 4.5) return "bg-green-500";
    if (rating >= 3.5) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getRatingWidth = (rating) => {
    return (rating / 5) * 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading performance data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-8 h-8 text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-800">Performance Tracking</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm text-gray-500">Average Rating</h2>
          </div>
          <p className="text-2xl font-semibold text-gray-800">
            {statistics?.average_rating || 0} / 5.0
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Based on {statistics?.total_reviews || 0} reviews
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-green-600" />
            <h2 className="text-sm text-gray-500">Top Performer</h2>
          </div>
          {statistics?.top_performers && statistics.top_performers.length > 0 ? (
            <>
              <p className="text-lg font-semibold text-gray-800">
                {statistics.top_performers[0].name}
              </p>
              <p className="text-sm text-gray-600">
                {statistics.top_performers[0].average_rating} / 5.0
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-500">No data available</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <h2 className="text-sm text-gray-500">High Performers</h2>
          </div>
          <p className="text-2xl font-semibold text-gray-800">
            {statistics?.top_performers?.length || 0}
          </p>
          <p className="text-xs text-gray-500 mt-1">Rating ≥ 4.5</p>
        </div>
      </div>

      {/* Performance Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-700">Recent Performance Reviews</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-3 text-sm font-medium text-gray-600">Employee</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600">Period</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600">Rating</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600">Progress</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600">Reviewer</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600">Review Date</th>
              </tr>
            </thead>
            <tbody>
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No performance reviews available.
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {review.employee_name}
                        </div>
                        <div className="text-xs text-gray-500">{review.employee_email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {review.review_period}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-900">
                        {review.rating} / 5.0
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`${getColor(review.rating)} h-3 rounded-full transition-all`}
                          style={{ width: `${getRatingWidth(review.rating)}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {review.reviewer_name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {review.review_date
                        ? new Date(review.review_date).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Performers Section */}
      {statistics?.top_performers && statistics.top_performers.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Top Performers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statistics.top_performers.map((performer) => (
              <div
                key={performer.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{performer.name}</h3>
                    <p className="text-sm text-gray-500">{performer.department || "N/A"}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      {performer.average_rating}
                    </div>
                    <div className="text-xs text-gray-500">/ 5.0</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
