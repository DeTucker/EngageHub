import { useState, useEffect } from "react";
import { submitLeaveRequest, getMyLeaves, getLeaveBalance } from "../../../api";
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Plus } from "lucide-react";

export default function Leave() {
  const [leaves, setLeaves] = useState([]);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    leave_type: "vacation",
    start_date: "",
    end_date: "",
    reason: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [leavesRes, balanceRes] = await Promise.all([
        getMyLeaves(),
        getLeaveBalance()
      ]);
      setLeaves(leavesRes.data);
      setBalance(balanceRes.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load data");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    
    try {
      await submitLeaveRequest(formData);
      setMessage("Leave request submitted successfully!");
      setShowForm(false);
      setFormData({
        leave_type: "vacation",
        start_date: "",
        end_date: "",
        reason: ""
      });
      fetchData(); // Refresh data
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to submit request");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="text-green-600" size={20} />;
      case "rejected":
        return <XCircle className="text-red-600" size={20} />;
      case "pending":
        return <Clock className="text-yellow-600" size={20} />;
      default:
        return <AlertCircle className="text-gray-600" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading leaves...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Leave Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Request time off and track your leave history
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-medium">Request Leave</span>
            </button>
          </div>
        </header>

        {/* Messages */}
        {message && (
          <div className="mb-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 rounded-xl shadow-lg flex items-center gap-2">
            <CheckCircle size={20} />
            <span className="font-medium">{message}</span>
          </div>
        )}
        {error && (
          <div className="mb-6 p-5 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-700 rounded-xl shadow-lg flex items-center gap-2">
            <XCircle size={20} />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Leave Request Form */}
        {showForm && (
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Plus className="w-6 h-6 text-blue-600" />
              Submit Leave Request
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Leave Type
                  </label>
                  <select
                    value={formData.leave_type}
                    onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                    required
                  >
                    <option value="vacation">Vacation</option>
                    <option value="sick">Sick Leave</option>
                    <option value="personal">Personal</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="maternity">Maternity</option>
                    <option value="paternity">Paternity</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Reason
                  </label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                    rows="3"
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 font-medium"
                >
                  Submit Request
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Leave Balance */}
        {balance && (
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-blue-600" />
              Leave Balance
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(balance).map(([type, data]) => (
                <div key={type} className="group bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border-2 border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-2 tracking-wide">{type.replace("_", " ")}</p>
                  <p className="text-3xl font-bold text-blue-600 mb-1">
                    {typeof data.remaining === 'number' ? data.remaining : '∞'}
                  </p>
                  <p className="text-xs text-gray-500">
                    of {typeof data.total === 'number' ? data.total : '∞'} days
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leave History */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            Leave History
          </h2>
          {leaves.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">No leave requests found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {leaves.map((leave) => (
                <div
                  key={leave.id}
                  className="group border-2 border-gray-100 rounded-xl p-6 hover:border-blue-200 hover:shadow-lg transition-all duration-300 bg-white"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {getStatusIcon(leave.status)}
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(leave.status)}`}>
                          {leave.status}
                        </span>
                        <span className="text-sm font-semibold text-gray-700 capitalize bg-gray-100 px-3 py-1 rounded-full">
                          {leave.leave_type.replace("_", " ")}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3 bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-blue-600" />
                          <span className="font-medium">{new Date(leave.start_date).toLocaleDateString()}</span>
                        </div>
                        <span className="text-blue-600">→</span>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-blue-600" />
                          <span className="font-medium">{new Date(leave.end_date).toLocaleDateString()}</span>
                        </div>
                        <span className="font-bold text-blue-600">({leave.days_count} days)</span>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-3">
                        <span className="font-semibold text-gray-800">Reason:</span> {leave.reason}
                      </p>
                      
                      {leave.reviewer_comment && (
                        <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                          <span className="font-semibold text-gray-800">Reviewer Comment:</span> {leave.reviewer_comment}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
