import { useState, useEffect } from "react";
import { getEmployeeStatistics, getLeaveStatistics } from "../../../api";
import { Users, Award, CalendarCheck, TrendingUp } from "lucide-react";

export default function Overview() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_employees: 0,
    pending_leaves: 0,
    recent_reviews: 0,
    total_hr: 0
  });
  const [leaveStats, setLeaveStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [employeeRes, leaveRes] = await Promise.all([
        getEmployeeStatistics(),
        getLeaveStatistics()
      ]);
      setStats(employeeRes.data);
      setLeaveStats(leaveRes.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load statistics");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      id: 1,
      title: "Total Employees",
      value: stats.total_employees,
      icon: <Users className="text-blue-600 w-6 h-6" />,
      change: `${stats.recent_employees || 0} joined recently`,
    },
    {
      id: 2,
      title: "Pending Leave Requests",
      value: stats.pending_leaves,
      icon: <CalendarCheck className="text-yellow-600 w-6 h-6" />,
      change: leaveStats?.by_status.pending || 0 + " awaiting approval",
    },
    {
      id: 3,
      title: "Approved Leaves",
      value: leaveStats?.by_status.approved || 0,
      icon: <Award className="text-green-600 w-6 h-6" />,
      change: "This year",
    },
    {
      id: 4,
      title: "Performance Reviews",
      value: stats.recent_reviews,
      icon: <TrendingUp className="text-purple-600 w-6 h-6" />,
      change: "Last 90 days",
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">HR Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-md rounded-lg p-5 flex items-center justify-between hover:shadow-lg transition"
          >
            <div>
              <h2 className="text-gray-500 text-sm">{item.title}</h2>
              <p className="text-2xl font-semibold text-gray-800">{item.value}</p>
              <p className="text-xs text-gray-400">{item.change}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">{item.icon}</div>
          </div>
        ))}
      </div>

      {/* Leave Statistics by Type */}
      {leaveStats && leaveStats.by_type.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Leave Statistics by Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {leaveStats.by_type.map((item, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 capitalize">{item.type.replace("_", " ")}</p>
                <p className="text-xl font-bold text-blue-600">{item.total_days}</p>
                <p className="text-xs text-gray-500">{item.count} requests</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">System Statistics</h2>
        <ul className="space-y-3 text-gray-600">
          <li>👥 <strong>{stats.total_employees}</strong> active employees</li>
          <li>👔 <strong>{stats.total_hr}</strong> HR managers</li>
          <li>⏳ <strong>{stats.pending_leaves}</strong> leave requests pending approval</li>
          <li>📈 <strong>{stats.recent_reviews}</strong> performance reviews in last 90 days</li>
        </ul>
      </div>
    </div>
  );
}
