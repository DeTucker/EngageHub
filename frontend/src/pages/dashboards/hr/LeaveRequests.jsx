import { useMemo, useState, useEffect } from "react";
import { getAllLeaves, updateLeaveStatus } from "../../../api";

/**
 * LeaveRequests
 *
 * Features:
 * - Fetch all leaves from backend
 * - Search by name or type
 * - Filter by status (All / pending / approved / rejected)
 * - Table with requester details, dates, type, status, and actions
 * - View details modal (reason, attachments placeholder)
 * - Approve / Reject actions with backend update
 *
 * Styling: Tailwind CSS classes (matches your dashboard style)
 */

const AVATAR_COLORS = [
  "bg-indigo-100 text-indigo-700",
  "bg-green-100 text-green-700",
  "bg-yellow-100 text-yellow-700",
  "bg-red-100 text-red-700",
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
];

function initials(name) {
  if (!name) return "NA";
  return name
    .split(" ")
    .map((x) => x[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString();
  } catch {
    return dateStr;
  }
}

export default function LeaveRequests() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await getAllLeaves();
      setLeaves(res.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load leave requests");
      setLoading(false);
    }
  };

  // Derived filtered list
  const filtered = useMemo(() => {
    return leaves.filter((item) => {
      const matchesSearch =
        item.user_name?.toLowerCase().includes(query.toLowerCase()) ||
        item.leave_type?.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leaves, query, statusFilter]);

  const statuses = ["All", "pending", "approved", "rejected"];

  // Actions: approve / reject
  async function applyAction(id, action) {
    setActionLoading(true);
    try {
      const newStatus = action === "approve" ? "approved" : "rejected";
      await updateLeaveStatus(id, { status: newStatus });
      // Refresh leaves after action
      await fetchLeaves();
      setConfirmAction(null);
      if (selected && selected.id === id) {
        setSelected(null);
      }
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to update leave status");
    } finally {
      setActionLoading(false);
    }
  }

  function clearAllFilters() {
    setQuery("");
    setStatusFilter("All");
  }

  if (loading) {
    return (
      <div className="p-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading leave requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <header className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Leave Requests</h1>
          <p className="text-sm text-gray-500">Review and manage employee leave requests.</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={clearAllFilters}
            className="px-3 py-1 text-sm rounded-md border border-gray-200 hover:bg-gray-50"
          >
            Reset filters
          </button>
        </div>
      </header>

      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or type..."
              className="w-full md:w-64 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
              aria-label="Search leave requests"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
              aria-label="Filter by status"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="text-sm text-gray-600">
            Showing <strong>{filtered.length}</strong> result{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 text-sm text-gray-600">Employee</th>
              <th className="px-4 py-3 text-sm text-gray-600">Dates</th>
              <th className="px-4 py-3 text-sm text-gray-600">Type</th>
              <th className="px-4 py-3 text-sm text-gray-600">Submitted</th>
              <th className="px-4 py-3 text-sm text-gray-600">Status</th>
              <th className="px-4 py-3 text-sm text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No leave requests found.
                </td>
              </tr>
            ) : (
              filtered.map((r, idx) => {
                const colorClass = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                return (
                  <tr key={r.id} className="border-t">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center font-medium ${colorClass}`}
                          aria-hidden
                        >
                          {initials(r.user_name)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{r.user_name}</div>
                          <div className="text-xs text-gray-500">{r.user_email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(r.start_date)} — {formatDate(r.end_date)}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-600 capitalize">{r.leave_type}</td>

                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(r.created_at).toLocaleString()}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={
                          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize " +
                          (r.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : r.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800")
                        }
                        aria-label={`Status ${r.status}`}
                      >
                        {r.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelected(r)}
                          className="px-3 py-1 text-sm rounded-md border hover:bg-gray-50"
                          aria-label={`View details for ${r.user_name}`}
                        >
                          View
                        </button>

                        {r.status === "pending" ? (
                          <>
                            <button
                              onClick={() => setConfirmAction({ id: r.id, action: "approve" })}
                              className="px-3 py-1 text-sm rounded-md bg-green-600 text-white hover:bg-green-700"
                              aria-label={`Approve ${r.user_name}`}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => setConfirmAction({ id: r.id, action: "reject" })}
                              className="px-3 py-1 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
                              aria-label={`Reject ${r.user_name}`}
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-gray-500 italic capitalize">{r.status}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Details modal */}
      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-40 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSelected(null)}
            aria-hidden
          />
          <div className="relative max-w-2xl w-full bg-white rounded-lg shadow-lg p-6 z-50">
            <header className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{selected.user_name}</h2>
                <p className="text-sm text-gray-500">{selected.user_email}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                aria-label="Close details"
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </header>

            <section className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <div className="text-xs text-gray-400">Leave dates</div>
                <div className="font-medium">
                  {formatDate(selected.start_date)} — {formatDate(selected.end_date)}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-400">Type</div>
                <div className="font-medium capitalize">{selected.leave_type}</div>
              </div>

              <div>
                <div className="text-xs text-gray-400">Days</div>
                <div className="font-medium">{selected.days_count} days</div>
              </div>

              <div>
                <div className="text-xs text-gray-400">Status</div>
                <div className="font-medium capitalize">{selected.status}</div>
              </div>

              <div className="md:col-span-2">
                <div className="text-xs text-gray-400">Reason</div>
                <p className="mt-1 text-gray-800">{selected.reason || "No reason provided"}</p>
              </div>

              <div>
                <div className="text-xs text-gray-400">Submitted</div>
                <div>{new Date(selected.created_at).toLocaleString()}</div>
              </div>

              {selected.updated_at && (
                <div>
                  <div className="text-xs text-gray-400">Last updated</div>
                  <div>{new Date(selected.updated_at).toLocaleString()}</div>
                </div>
              )}
            </section>

            <footer className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelected(null)}
                className="px-3 py-1 rounded-md border"
              >
                Close
              </button>

              {selected.status === "pending" && (
                <>
                  <button
                    onClick={() => setConfirmAction({ id: selected.id, action: "reject" })}
                    className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => setConfirmAction({ id: selected.id, action: "approve" })}
                    className="px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700"
                  >
                    Approve
                  </button>
                </>
              )}
            </footer>
          </div>
        </div>
      )}

      {/* Confirm dialog */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setConfirmAction(null)} />
          <div className="relative bg-white rounded-lg shadow-lg p-5 max-w-md w-full z-10">
            <h3 className="text-lg font-semibold text-gray-900">
              Confirm {confirmAction.action === "approve" ? "Approve" : "Reject"}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to{" "}
              <strong>{confirmAction.action === "approve" ? "approve" : "reject"}</strong> this leave
              request? This action will update the database.
            </p>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-3 py-1 rounded-md border"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={() => applyAction(confirmAction.id, confirmAction.action)}
                className="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                disabled={actionLoading}
              >
                {actionLoading ? "Processing..." : `Yes, ${confirmAction.action === "approve" ? "Approve" : "Reject"}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
