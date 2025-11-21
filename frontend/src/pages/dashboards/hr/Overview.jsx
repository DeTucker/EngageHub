import { useState, useEffect } from "react";
import { getEmployeeStatistics, getLeaveStatistics, getTaskStatistics } from "../../../api";
import { Users, Award, CalendarCheck, TrendingUp, Shield, Clock, CheckSquare, AlertCircle, BarChart3, PieChart } from "lucide-react";
import { BarChart, Bar, PieChart as RePieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from "recharts";

export default function Overview() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_employees: 0,
    pending_leaves: 0,
    recent_reviews: 0,
    total_hr: 0
  });
  const [leaveStats, setLeaveStats] = useState(null);
  const [taskStats, setTaskStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [employeeRes, leaveRes, taskRes] = await Promise.all([
        getEmployeeStatistics(),
        getLeaveStatistics(),
        getTaskStatistics()
      ]);
      setStats(employeeRes.data);
      setLeaveStats(leaveRes.data);
      setTaskStats(taskRes.data);
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

      {/* Task Statistics */}
      {taskStats && (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-indigo-600" />
            Task Management Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="group bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-xl border-2 border-indigo-100 hover:border-indigo-300 hover:shadow-lg transition-all duration-300">
              <p className="text-xs font-semibold text-gray-600 uppercase mb-2 tracking-wide">Total Tasks</p>
              <p className="text-3xl font-bold text-indigo-600 mb-1">{taskStats.total_tasks}</p>
              <p className="text-xs text-gray-500">All tasks</p>
            </div>
            <div className="group bg-gradient-to-br from-yellow-50 to-orange-50 p-5 rounded-xl border-2 border-yellow-100 hover:border-yellow-300 hover:shadow-lg transition-all duration-300">
              <p className="text-xs font-semibold text-gray-600 uppercase mb-2 tracking-wide">Pending</p>
              <p className="text-3xl font-bold text-yellow-600 mb-1">{taskStats.pending}</p>
              <p className="text-xs text-gray-500">Not started</p>
            </div>
            <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border-2 border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
              <p className="text-xs font-semibold text-gray-600 uppercase mb-2 tracking-wide">In Progress</p>
              <p className="text-3xl font-bold text-blue-600 mb-1">{taskStats.in_progress}</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
            <div className="group bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border-2 border-green-100 hover:border-green-300 hover:shadow-lg transition-all duration-300">
              <p className="text-xs font-semibold text-gray-600 uppercase mb-2 tracking-wide">Completed</p>
              <p className="text-3xl font-bold text-green-600 mb-1">{taskStats.completed}</p>
              <p className="text-xs text-gray-500">Done</p>
            </div>
            <div className="group bg-gradient-to-br from-red-50 to-rose-50 p-5 rounded-xl border-2 border-red-100 hover:border-red-300 hover:shadow-lg transition-all duration-300">
              <p className="text-xs font-semibold text-gray-600 uppercase mb-2 tracking-wide">Overdue</p>
              <p className="text-3xl font-bold text-red-600 mb-1">{taskStats.overdue}</p>
              <p className="text-xs text-gray-500">Past due</p>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      {taskStats && leaveStats && (
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Task Status Distribution Chart */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <PieChart className="w-6 h-6 text-indigo-600" />
              Task Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <RePieChart>
                <Pie
                  data={[
                    { name: 'Pending', value: taskStats.pending, color: '#f59e0b' },
                    { name: 'In Progress', value: taskStats.in_progress, color: '#3b82f6' },
                    { name: 'Completed', value: taskStats.completed, color: '#10b981' },
                    { name: 'Overdue', value: taskStats.overdue, color: '#ef4444' }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    { name: 'Pending', value: taskStats.pending, color: '#f59e0b' },
                    { name: 'In Progress', value: taskStats.in_progress, color: '#3b82f6' },
                    { name: 'Completed', value: taskStats.completed, color: '#10b981' },
                    { name: 'Overdue', value: taskStats.overdue, color: '#ef4444' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>

          {/* Leave Status Distribution Chart */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-purple-600" />
              Leave Status Overview
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { status: 'Pending', count: leaveStats.by_status.pending || 0, fill: '#f59e0b' },
                  { status: 'Approved', count: leaveStats.by_status.approved || 0, fill: '#10b981' },
                  { status: 'Rejected', count: leaveStats.by_status.rejected || 0, fill: '#ef4444' }
                ]}
              >
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" radius={[8, 8, 0, 0]}>
                  {[
                    { status: 'Pending', count: leaveStats.by_status.pending || 0, fill: '#f59e0b' },
                    { status: 'Approved', count: leaveStats.by_status.approved || 0, fill: '#10b981' },
                    { status: 'Rejected', count: leaveStats.by_status.rejected || 0, fill: '#ef4444' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Leave Types Chart */}
      {leaveStats && leaveStats.by_type.length > 0 && (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            Leave Days by Type
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={leaveStats.by_type.map(item => ({
                type: item.type.replace('_', ' ').toUpperCase(),
                days: item.total_days,
                requests: item.count
              }))}
            >
              <XAxis dataKey="type" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="days" fill="#8b5cf6" name="Total Days" radius={[8, 8, 0, 0]} />
              <Bar dataKey="requests" fill="#06b6d4" name="Requests" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
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
