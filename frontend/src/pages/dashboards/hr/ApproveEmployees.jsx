import { useState, useEffect } from "react";
import { getPendingEmployees, approveEmployee } from "../../../api";
import { UserCheck, Clock, CheckCircle, AlertCircle } from "lucide-react";

function initials(name) {
  if (!name) return "NA";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const AVATAR_COLORS = [
  "bg-indigo-100 text-indigo-700",
  "bg-green-100 text-green-700",
  "bg-yellow-100 text-yellow-700",
  "bg-red-100 text-red-700",
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
];

export default function ApproveEmployees() {
  const [pendingEmployees, setPendingEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchPendingEmployees();
  }, []);

  const fetchPendingEmployees = async () => {
    try {
      const res = await getPendingEmployees();
      setPendingEmployees(res.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load pending employees");
      setLoading(false);
    }
  };

  const handleApprove = async (employeeId, employeeName) => {
    if (!confirm(`Approve ${employeeName}'s account?`)) return;

    setProcessing(employeeId);
    setError("");
    setMessage("");

    try {
      await approveEmployee(employeeId);
      setMessage(`${employeeName} has been approved successfully!`);
      
      // Remove from pending list
      setPendingEmployees(prev => prev.filter(emp => emp.id !== employeeId));
      
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to approve employee");
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading pending approvals...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
            <UserCheck className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Approve Employees
            </h1>
            <p className="text-gray-600 mt-1">
              Review and approve new employee registrations
            </p>
          </div>
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
          <AlertCircle size={20} />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Pending Count Badge */}
      {pendingEmployees.length > 0 && (
        <div className="mb-6 inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-300 px-4 py-2 rounded-xl">
          <Clock className="w-5 h-5 text-yellow-600" />
          <span className="font-semibold text-yellow-800">
            {pendingEmployees.length} {pendingEmployees.length === 1 ? 'employee' : 'employees'} awaiting approval
          </span>
        </div>
      )}

      {/* Pending Employees List */}
      {pendingEmployees.length === 0 ? (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-12 text-center border border-gray-100">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mx-auto flex items-center justify-center mb-4">
            <UserCheck className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg font-medium">No pending approvals</p>
          <p className="text-gray-400 text-sm mt-2">All employees have been reviewed</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pendingEmployees.map((employee, idx) => {
            const colorClass = AVATAR_COLORS[idx % AVATAR_COLORS.length];
            
            return (
              <div
                key={employee.id}
                className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 p-6"
              >
                {/* Employee Info */}
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`h-16 w-16 rounded-2xl flex items-center justify-center font-bold text-lg ${colorClass} shadow-md`}
                  >
                    {initials(employee.full_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-lg truncate">
                      {employee.full_name}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">{employee.email}</p>
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                      <Clock className="w-3 h-3" />
                      Pending
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Role:</span>
                    <span className="font-medium text-gray-800 capitalize">{employee.role}</span>
                  </div>
                  {employee.department && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Department:</span>
                      <span className="font-medium text-gray-800">{employee.department}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Registered:</span>
                    <span className="font-medium text-gray-800">
                      {new Date(employee.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Approve Button */}
                <button
                  onClick={() => handleApprove(employee.id, employee.full_name)}
                  disabled={processing === employee.id}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {processing === employee.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Approving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Approve Employee</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
