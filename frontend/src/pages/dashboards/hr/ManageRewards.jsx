import { useState, useEffect } from "react";
import { getAllRewards, createReward, deleteReward, getAllEmployees } from "../../../api";
import { Award, Trash2, Plus } from "lucide-react";

const REWARD_TYPES = [
  { value: "employee_of_month", label: "Employee of the Month" },
  { value: "spot_recognition", label: "Spot Recognition" },
  { value: "milestone", label: "Milestone Achievement" },
  { value: "innovation", label: "Innovation Award" },
  { value: "teamwork", label: "Teamwork Excellence" },
  { value: "customer_service", label: "Customer Service Star" },
];

export default function ManageRewards() {
  const [rewards, setRewards] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    recipient_id: "",
    recipient_email: "",
    reward_type: "spot_recognition",
    title: "",
    description: "",
    points: 100,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rewardsRes, employeesRes] = await Promise.all([
        getAllRewards(),
        getAllEmployees(),
      ]);
      setRewards(rewardsRes.data.data || []);
      setEmployees(employeesRes.data || []);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load data");
      setLoading(false);
    }
  };

  const handleEmployeeChange = (e) => {
    const selectedEmail = e.target.value;
    const employee = employees.find((emp) => emp.email === selectedEmail);
    if (employee) {
      setFormData({
        ...formData,
        recipient_email: employee.email,
        recipient_id: employee.id,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.recipient_email || !formData.title) {
      alert("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      await createReward(formData);
      setFormData({
        recipient_id: "",
        recipient_email: "",
        reward_type: "spot_recognition",
        title: "",
        description: "",
        points: 100,
      });
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to create reward");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (rewardId) => {
    if (!confirm("Are you sure you want to delete this reward?")) return;

    try {
      await deleteReward(rewardId);
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to delete reward");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading rewards...</div>
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
        <Award className="w-8 h-8 text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-800">Manage Rewards</h1>
      </div>

      {/* Add Reward Form */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Award New Reward
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee *
              </label>
              <select
                value={formData.recipient_email}
                onChange={handleEmployeeChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select an employee</option>
                {employees.map((emp) => (
                  <option key={emp.email} value={emp.email}>
                    {emp.full_name} ({emp.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reward Type *
              </label>
              <select
                value={formData.reward_type}
                onChange={(e) => setFormData({ ...formData, reward_type: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {REWARD_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Outstanding Performance"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Points
              </label>
              <input
                type="number"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                min="0"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the achievement..."
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {submitting ? "Creating..." : "Award Reward"}
          </button>
        </form>
      </div>

      {/* Rewards Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-6 py-3 text-sm font-medium text-gray-600">Employee</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-600">Reward Type</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-600">Title</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-600">Points</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-600">Date</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rewards.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No rewards awarded yet.
                </td>
              </tr>
            ) : (
              rewards.map((reward) => (
                <tr key={reward.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {reward.recipient_name}
                      </div>
                      <div className="text-xs text-gray-500">{reward.recipient_email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {REWARD_TYPES.find((t) => t.value === reward.reward_type)?.label || reward.reward_type}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{reward.title}</div>
                      {reward.description && (
                        <div className="text-xs text-gray-500 mt-1">{reward.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-indigo-600">
                    {reward.points}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {reward.date_awarded
                      ? new Date(reward.date_awarded).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(reward.id)}
                      className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded"
                      title="Delete reward"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
