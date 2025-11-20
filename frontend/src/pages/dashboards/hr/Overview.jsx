import { useState, useEffect } from "react";
import { getEmployeeStatistics, getLeaveStatistics } from "../../../api";
import { Users, Award, CalendarCheck, TrendingUp, Shield, Clock } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 p-5 rounded-xl shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      id: 1,
      title: "Total Employees",
      value: stats.total_employees,
      icon: <Users className="text-blue-600 w-7 h-7" />,
      change: `${stats.recent_employees || 0} joined recently`,
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      id: 2,
      title: "Pending Leave Requests",
      value: stats.pending_leaves,
      icon: <CalendarCheck className="text-yellow-600 w-7 h-7" />,
      change: leaveStats?.by_status.pending || 0 + " awaiting approval",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      id: 3,
      title: "Approved Leaves",
      value: leaveStats?.by_status.approved || 0,
      icon: <Award className="text-green-600 w-7 h-7" />,
      change: "This year",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      id: 4,
      title: "Performance Reviews",
      value: stats.recent_reviews,
      icon: <TrendingUp className="text-purple-600 w-7 h-7" />,
      change: "Last 90 days",
      gradient: "from-purple-500 to-indigo-600"
    },
  ];

  return (
    <div>
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              HR Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor company metrics and employee activities
            </p>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((item) => (
          <div
            key={item.id}
            className="group bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-2xl rounded-2xl p-6 flex items-start justify-between transition-all duration-300 hover:-translate-y-1 border border-gray-100"
          >
            <div className="flex-1">
              <h2 className="text-gray-600 text-sm font-medium mb-2">{item.title}</h2>
              <p className="text-4xl font-bold text-gray-800 mb-1">{item.value}</p>
              <p className="text-xs text-gray-500">{item.change}</p>
            </div>
            <div className={`p-3 bg-gradient-to-br ${item.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Leave Statistics by Type */}
      {leaveStats && leaveStats.by_type.length > 0 && (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-purple-600" />
            Leave Statistics by Type
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {leaveStats.by_type.map((item, index) => (
              <div key={index} className="group bg-gradient-to-br from-purple-50 to-indigo-50 p-5 rounded-xl border-2 border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all duration-300">
                <p className="text-xs font-semibold text-gray-600 uppercase mb-2 tracking-wide">{item.type.replace("_", " ")}</p>
                <p className="text-3xl font-bold text-purple-600 mb-1">{item.total_days}</p>
                <p className="text-xs text-gray-500">{item.count} requests</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-purple-600" />
          System Statistics
        </h2>
        <div className="grid gap-4">
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.total_employees}</p>
              <p className="text-sm text-gray-600">Active employees</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.total_hr}</p>
              <p className="text-sm text-gray-600">HR managers</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.pending_leaves}</p>
              <p className="text-sm text-gray-600">Leave requests pending approval</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.recent_reviews}</p>
              <p className="text-sm text-gray-600">Performance reviews in last 90 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
