import React from "react";

export default function PerformanceTracking() {
  const employees = [
    { id: 1, name: "John Mwangi", department: "Sales", score: 92 },
    { id: 2, name: "Sarah Otieno", department: "Marketing", score: 85 },
    { id: 3, name: "Kevin Kamau", department: "Logistics", score: 78 },
    { id: 4, name: "Linda Achieng", department: "HR", score: 88 },
  ];

  const getColor = (score) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 75) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Performance Tracking</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-sm text-gray-500">Average Score</h2>
          <p className="text-2xl font-semibold text-gray-800">85.7%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-sm text-gray-500">Top Performer</h2>
          <p className="text-lg font-semibold text-gray-800">John Mwangi (92%)</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-sm text-gray-500">Low Performer</h2>
          <p className="text-lg font-semibold text-gray-800">Kevin Kamau (78%)</p>
        </div>
      </div>

      {/* Performance Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Employee Performance</h2>
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
            <tr>
              <th className="py-3 px-6 text-left">Employee</th>
              <th className="py-3 px-6 text-left">Department</th>
              <th className="py-3 px-6 text-left">Score</th>
              <th className="py-3 px-6 text-left">Progress</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {employees.map((emp) => (
              <tr key={emp.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6">{emp.name}</td>
                <td className="py-3 px-6">{emp.department}</td>
                <td className="py-3 px-6">{emp.score}%</td>
                <td className="py-3 px-6">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`${getColor(emp.score)} h-3 rounded-full`}
                      style={{ width: `${emp.score}%` }}
                    ></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
