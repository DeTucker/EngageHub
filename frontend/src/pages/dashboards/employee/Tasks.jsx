import { useState, useEffect } from "react";
import { getMyTasks, updateTask } from "../../../api";
import { 
  CheckSquare, Clock, AlertCircle, CheckCircle, 
  Flag, Calendar, User, FileText, Loader
} from "lucide-react";

const PRIORITY_COLORS = {
  low: "bg-gray-100 text-gray-700 border-gray-300",
  medium: "bg-blue-100 text-blue-700 border-blue-300",
  high: "bg-orange-100 text-orange-700 border-orange-300",
  urgent: "bg-red-100 text-red-700 border-red-300"
};

const STATUS_CONFIG = {
  pending: { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100", label: "Pending" },
  in_progress: { icon: Loader, color: "text-blue-600", bg: "bg-blue-100", label: "In Progress" },
  completed: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100", label: "Completed" },
  overdue: { icon: AlertCircle, color: "text-red-600", bg: "bg-red-100", label: "Overdue" }
};

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);
  const [reportText, setReportText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [filterStatus]);

  const fetchTasks = async () => {
    try {
      const statusFilter = filterStatus === "all" ? null : filterStatus;
      const res = await getMyTasks(statusFilter);
      setTasks(res.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load tasks");
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    setError("");
    setMessage("");

    try {
      await updateTask(taskId, { status: newStatus });
      setMessage("Task status updated successfully!");
      fetchTasks();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update task");
    }
  };

  const handleSubmitReport = async () => {
    if (!reportText.trim()) {
      setError("Please enter a completion report");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await updateTask(selectedTask.id, {
        status: "completed",
        completion_report: reportText
      });
      setMessage("Task marked as completed with report!");
      setSelectedTask(null);
      setReportText("");
      fetchTasks();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };

  const isOverdue = (dueDate, status) => {
    return status !== "completed" && new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading tasks...</p>
        </div>
      </div>
    );
  }

  const filteredTasks = tasks;
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === "pending").length,
    in_progress: tasks.filter(t => t.status === "in_progress").length,
    completed: tasks.filter(t => t.status === "completed").length,
    overdue: tasks.filter(t => t.status === "overdue").length
  };

  return (
    <div>
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <CheckSquare className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              My Tasks
            </h1>
            <p className="text-gray-600 mt-1">
              View and manage your assigned tasks
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

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 shadow-lg border border-gray-100">
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Total</p>
          <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 shadow-lg border border-yellow-100">
          <p className="text-xs text-yellow-700 uppercase font-semibold mb-1">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 shadow-lg border border-blue-100">
          <p className="text-xs text-blue-700 uppercase font-semibold mb-1">In Progress</p>
          <p className="text-3xl font-bold text-blue-600">{stats.in_progress}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 shadow-lg border border-green-100">
          <p className="text-xs text-green-700 uppercase font-semibold mb-1">Completed</p>
          <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 shadow-lg border border-red-100">
          <p className="text-xs text-red-700 uppercase font-semibold mb-1">Overdue</p>
          <p className="text-3xl font-bold text-red-600">{stats.overdue}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6 flex items-center gap-3">
        <label className="text-sm font-semibold text-gray-700">Filter:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition"
        >
          <option value="all">All Tasks</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-12 text-center border border-gray-100">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mx-auto flex items-center justify-center mb-4">
            <CheckSquare className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg font-medium">No tasks found</p>
          <p className="text-gray-400 text-sm mt-2">Tasks assigned to you will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => {
            const StatusIcon = STATUS_CONFIG[task.status].icon;
            const overdueFlag = isOverdue(task.due_date, task.status);
            
            return (
              <div
                key={task.id}
                className={`group bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 p-6 ${
                  overdueFlag ? 'border-red-300' : 'border-gray-100'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{task.title}</h3>
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Status Badge */}
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${STATUS_CONFIG[task.status].bg} ${STATUS_CONFIG[task.status].color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {STATUS_CONFIG[task.status].label}
                      </span>
                      
                      {/* Priority Badge */}
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border-2 ${PRIORITY_COLORS[task.priority]}`}>
                        <Flag className="w-3 h-3" />
                        {task.priority.toUpperCase()}
                      </span>
                      
                      {/* Category */}
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                        {task.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-4 leading-relaxed">{task.description}</p>

                {/* Task Info */}
                <div className="grid md:grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <span className="font-medium">Due:</span>
                    <span className={overdueFlag ? 'text-red-600 font-bold' : ''}>
                      {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="w-4 h-4 text-indigo-600" />
                    <span className="font-medium">Assigned by:</span>
                    <span>{task.assigned_by_name}</span>
                  </div>
                </div>

                {/* Completion Report (if completed) */}
                {task.completion_report && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-green-800">Completion Report:</span>
                    </div>
                    <p className="text-gray-700 text-sm">{task.completion_report}</p>
                  </div>
                )}

                {/* Actions */}
                {task.status !== "completed" && (
                  <div className="flex flex-wrap gap-3">
                    {task.status === "pending" && (
                      <button
                        onClick={() => handleStatusChange(task.id, "in_progress")}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition font-medium text-sm"
                      >
                        Start Task
                      </button>
                    )}
                    
                    {task.status === "in_progress" && (
                      <button
                        onClick={() => setSelectedTask(task)}
                        className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition font-medium text-sm"
                      >
                        Mark as Complete
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Completion Report Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedTask(null)}
          />
          <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl max-w-2xl w-full p-8 z-10 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete Task</h2>
            <p className="text-gray-600 mb-6">Task: <span className="font-semibold">{selectedTask.title}</span></p>
            
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Completion Report <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="Describe what you accomplished, challenges faced, and any notes..."
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition resize-none"
              rows="6"
            />
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSubmitReport}
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit & Complete"}
              </button>
              <button
                onClick={() => {
                  setSelectedTask(null);
                  setReportText("");
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
