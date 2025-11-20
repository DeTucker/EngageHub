import { useState, useEffect } from "react";
import { getAllPerformanceReviews, getPerformanceStatistics, createPerformanceReview, getAllEmployees, getCurrentUser } from "../../../api";
import { TrendingUp, Award, AlertCircle, BarChart3, Plus, X } from "lucide-react";

export default function PerformanceTracking() {
  const [reviews, setReviews] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: "",
    employee_email: "",
    review_period: "",
    rating: 3.0,
    feedback: "",
    goals: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reviewsRes, statsRes, employeesRes, userRes] = await Promise.all([
        getAllPerformanceReviews(),
        getPerformanceStatistics(),
        getAllEmployees(),
        getCurrentUser(),
      ]);
      setReviews(reviewsRes.data.data || []);
      setStatistics(statsRes.data);
      setEmployees(employeesRes.data || []);
      setCurrentUser(userRes.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load performance data");
      setLoading(false);
    }
  };

  // Filter out current HR manager from employee list
  const selectableEmployees = employees.filter(
    emp => emp.email !== currentUser?.email
  );

  const getColor = (rating) => {
    if (rating >= 4.5) return "bg-green-500";
    if (rating >= 3.5) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getRatingWidth = (rating) => {
    return (rating / 5) * 100;
  };

  const handleEmployeeChange = (e) => {
    const selectedEmail = e.target.value;
    const employee = employees.find((emp) => emp.email === selectedEmail);
    if (employee) {
      setFormData({
        ...formData,
        employee_email: employee.email,
        employee_id: employee.id,
      });
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!formData.employee_id || !formData.review_period || !formData.feedback) {
      alert("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      await createPerformanceReview(formData);
      setShowModal(false);
      setFormData({
        employee_id: "",
        employee_email: "",
        review_period: "",
        rating: 3.0,
        feedback: "",
        goals: "",
      });
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to create review");
    } finally {
      setSubmitting(false);
    }
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-800">Performance Tracking</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Review
        </button>
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

      {/* New Review Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Conduct Performance Review</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee *
                </label>
                <select
                  value={formData.employee_email}
                  onChange={handleEmployeeChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select an employee</option>
                  {selectableEmployees.map((emp) => (
                    <option key={emp.email} value={emp.email}>
                      {emp.full_name} ({emp.email})
                    </option>
                  ))}
                </select>
                {selectableEmployees.length === 0 && (
                  <p className="text-xs text-gray-500 mt-1">No employees available for review</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Review Period *
                </label>
                <input
                  type="text"
                  value={formData.review_period}
                  onChange={(e) => setFormData({ ...formData, review_period: e.target.value })}
                  placeholder="e.g., Q4 2025, Annual 2025"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating (1-5) *
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-lg font-semibold text-indigo-600 w-12 text-center">
                    {formData.rating}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Feedback *
                </label>
                <textarea
                  value={formData.feedback}
                  onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                  placeholder="Provide detailed feedback on performance, strengths, areas for improvement..."
                  required
                  rows={5}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goals for Next Period
                </label>
                <textarea
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  placeholder="Set goals and objectives for the next review period..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
