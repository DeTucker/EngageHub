import { useState, useEffect } from "react";

export default function Leave() {
  const [loading, setLoading] = useState(true);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [form, setForm] = useState({
    start_date: "",
    end_date: "",
    reason: "",
    type: "annual",
  });
  const [message, setMessage] = useState("");

  // Simulate fetching leave requests
  useEffect(() => {
    setTimeout(() => {
      setLeaveRequests([
        {
          id: 1,
          start_date: "2025-09-10",
          end_date: "2025-09-12",
          reason: "Family event",
          type: "Casual Leave",
          status: "Approved",
        },
        {
          id: 2,
          start_date: "2025-08-02",
          end_date: "2025-08-03",
          reason: "Medical leave",
          type: "Sick Leave",
          status: "Pending",
        },
      ]);
      setLoading(false);
    }, 700);
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle leave submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    if (!form.start_date || !form.end_date || !form.reason) {
      setMessage("⚠️ Please fill in all fields.");
      return;
    }

    // Simulate submitting leave
    const newLeave = {
      id: leaveRequests.length + 1,
      ...form,
      status: "Pending",
    };

    setLeaveRequests((prev) => [...prev, newLeave]);
    setMessage("✅ Leave request submitted successfully!");

    setForm({
      start_date: "",
      end_date: "",
      reason: "",
      type: "annual",
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">🗓️ Leave Management</h1>
      <p className="text-gray-600 mb-6">
        Submit new leave requests and view your leave history.
      </p>

      {/* Form Section */}
      <div className="bg-white shadow p-6 rounded-lg mb-8">
        <h2 className="text-lg font-semibold mb-4">Request Leave</h2>

        {message && (
          <p
            className={`mb-4 p-3 rounded text-sm ${
              message.startsWith("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Leave Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="annual">Annual Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="casual">Casual Leave</option>
              <option value="maternity">Maternity Leave</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Reason</label>
            <input
              type="text"
              name="reason"
              value={form.reason}
              onChange={handleChange}
              placeholder="Brief reason"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>

      {/* Leave History Table */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Leave History</h2>

        {loading ? (
          <p>Loading leave records...</p>
        ) : leaveRequests.length === 0 ? (
          <p className="text-gray-500">No leave requests yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Type</th>
                  <th className="px-4 py-2 border">Start</th>
                  <th className="px-4 py-2 border">End</th>
                  <th className="px-4 py-2 border">Reason</th>
                  <th className="px-4 py-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((leave) => (
                  <tr key={leave.id} className="text-center">
                    <td className="px-4 py-2 border capitalize">
                      {leave.type}
                    </td>
                    <td className="px-4 py-2 border">{leave.start_date}</td>
                    <td className="px-4 py-2 border">{leave.end_date}</td>
                    <td className="px-4 py-2 border">{leave.reason}</td>
                    <td
                      className={`px-4 py-2 border font-semibold ${
                        leave.status === "Approved"
                          ? "text-green-600"
                          : leave.status === "Rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {leave.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
