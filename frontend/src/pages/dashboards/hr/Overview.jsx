import React from "react";
import { Users, Award, CalendarCheck, TrendingUp } from "lucide-react";

export default function Overview() {
  const stats = [
    {
      id: 1,
      title: "Total Employees",
      value: 48,
      icon: <Users className="text-blue-600 w-6 h-6" />,
      change: "+5 this month",
    },
    {
      id: 2,
      title: "Pending Leave Requests",
      value: 3,
      icon: <CalendarCheck className="text-yellow-600 w-6 h-6" />,
      change: "2 awaiting approval",
    },
    {
      id: 3,
      title: "Rewards Issued",
      value: 12,
      icon: <Award className="text-green-600 w-6 h-6" />,
      change: "+2 this week",
    },
    {
      id: 4,
      title: "Performance Score Avg",
      value: "88%",
      icon: <TrendingUp className="text-purple-600 w-6 h-6" />,
      change: "Up 4% from last month",
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">HR Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((item) => (
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

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Recent HR Activities</h2>
        <ul className="space-y-3 text-gray-600">
          <li>✅ <strong>Mary Wanjiku</strong> approved 2 leave requests</li>
          <li>🏆 <strong>John Mwangi</strong> received "Employee of the Month"</li>
          <li>🗓️ <strong>Sarah Otieno</strong> applied for annual leave (Pending)</li>
          <li>📈 <strong>Performance reviews</strong> scheduled for next week</li>
        </ul>
      </div>
    </div>
  );
}
