import React, { useState } from "react";

export default function ManageRewards() {
  const [rewards, setRewards] = useState([
    { id: 1, employee: "John Mwangi", reward: "Employee of the Month", date: "2025-09-28" },
    { id: 2, employee: "Sarah Otieno", reward: "Top Sales Performer", date: "2025-10-05" },
    { id: 3, employee: "Kevin Kamau", reward: "Best Team Player", date: "2025-10-20" },
  ]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Rewards</h1>

      {/* Rewards Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
            <tr>
              <th className="py-3 px-6 text-left">Employee</th>
              <th className="py-3 px-6 text-left">Reward</th>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {rewards.map((reward) => (
              <tr key={reward.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6">{reward.employee}</td>
                <td className="py-3 px-6">{reward.reward}</td>
                <td className="py-3 px-6">{reward.date}</td>
                <td className="py-3 px-6 text-center space-x-2">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                    Edit
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Reward Section */}
      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Add New Reward</h2>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Employee Name"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Reward Title"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600"
          >
            Add Reward
          </button>
        </form>
      </div>
    </div>
  );
}
