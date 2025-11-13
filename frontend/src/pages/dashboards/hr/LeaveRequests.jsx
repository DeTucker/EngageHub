import React, { useMemo, useState } from "react";

/**
 * LeaveRequests
 *
 * Features:
 * - Search by name or role
 * - Filter by status (All / Pending / Approved / Denied)
 * - Table with requester avatar initials, dates, type, status, and actions
 * - View details modal (reason, attachments placeholder)
 * - Approve / Deny actions with confirmation (client-side only / instant update)
 * - Simple previous/next pagination
 *
 * Styling: Tailwind CSS classes (matches your dashboard style)
 */

const FAKE_DATA = [
  {
    id: "lr-001",
    name: "Jane Doe",
    role: "Operations Manager",
    avatarColor: "bg-indigo-100 text-indigo-700",
    startDate: "2025-11-03",
    endDate: "2025-11-07",
    type: "Annual Leave",
    submittedAt: "2025-10-25T09:12:00",
    status: "Pending",
    reason:
      "Family trip — planned months ago. Will be reachable by phone for emergencies.",
  },
  {
    id: "lr-002",
    name: "Samuel Otieno",
    role: "Driver",
    avatarColor: "bg-green-100 text-green-700",
    startDate: "2025-10-30",
    endDate: "2025-11-01",
    type: "Sick Leave",
    submittedAt: "2025-10-29T06:28:00",
    status: "Pending",
    reason: "Fever and flu symptoms. Visiting clinic today — will upload certificate.",
  },
  {
    id: "lr-003",
    name: "Aisha Mwangi",
    role: "Logistics Coordinator",
    avatarColor: "bg-yellow-100 text-yellow-700",
    startDate: "2025-12-15",
    endDate: "2025-12-22",
    type: "Annual Leave",
    submittedAt: "2025-10-15T14:00:00",
    status: "Approved",
    reason: "Holiday with family.",
  },
  {
    id: "lr-004",
    name: "Peter Kimani",
    role: "Warehouse Assistant",
    avatarColor: "bg-red-100 text-red-700",
    startDate: "2025-11-10",
    endDate: "2025-11-12",
    type: "Personal Leave",
    submittedAt: "2025-10-27T11:30:00",
    status: "Denied",
    reason: "Personal commitments.",
  },
  // add more fake entries if you like
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

export default function LeaveRequests({ initialData = FAKE_DATA }) {
  // Local data state
  const [data, setData] = useState(initialData);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState(null); // for modal
  const [confirmAction, setConfirmAction] = useState(null); // {id, action} when confirming approve/deny
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  // Derived filtered list
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((r) => {
      if (statusFilter !== "All" && r.status !== statusFilter) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        r.role.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q)
      );
    });
  }, [data, query, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Actions: approve / deny
  function applyAction(id, action) {
    // update status locally
    setData((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: action === "approve" ? "Approved" : "Denied",
            }
          : r
      )
    );
    setConfirmAction(null);
    // If the selected modal item was updated, refresh it
    if (selected && selected.id === id) {
      setSelected((s) => ({ ...s, status: action === "approve" ? "Approved" : "Denied" }));
    }
  }

  function clearAllFilters() {
    setQuery("");
    setStatusFilter("All");
    setPage(1);
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
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, role or type..."
              className="w-full md:w-64 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
              aria-label="Search leave requests"
            />

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 border rounded-md"
              aria-label="Filter by status"
            >
              <option>All</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Denied</option>
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
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No leave requests found.
                </td>
              </tr>
            ) : (
              pageItems.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center font-medium ${r.avatarColor}`}
                        aria-hidden
                      >
                        {initials(r.name)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{r.name}</div>
                        <div className="text-xs text-gray-500">{r.role}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatDate(r.startDate)} — {formatDate(r.endDate)}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-600">{r.type}</td>

                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(r.submittedAt).toLocaleString()}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={
                        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium " +
                        (r.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : r.status === "Approved"
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
                        aria-label={`View details for ${r.name}`}
                      >
                        View
                      </button>

                      {r.status === "Pending" ? (
                        <>
                          <button
                            onClick={() => setConfirmAction({ id: r.id, action: "approve" })}
                            className="px-3 py-1 text-sm rounded-md bg-green-600 text-white"
                            aria-label={`Approve ${r.name}`}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => setConfirmAction({ id: r.id, action: "deny" })}
                            className="px-3 py-1 text-sm rounded-md bg-red-600 text-white"
                            aria-label={`Deny ${r.name}`}
                          >
                            Deny
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-gray-500 italic">{r.status}</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="text-sm text-gray-600">
            Page {page} of {pageCount}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded-md border disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={page === pageCount}
              className="px-3 py-1 rounded-md border disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
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
                <h2 className="text-lg font-semibold text-gray-900">{selected.name}</h2>
                <p className="text-sm text-gray-500">{selected.role}</p>
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
                  {formatDate(selected.startDate)} — {formatDate(selected.endDate)}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-400">Type</div>
                <div className="font-medium">{selected.type}</div>
              </div>

              <div className="md:col-span-2">
                <div className="text-xs text-gray-400">Reason</div>
                <p className="mt-1 text-gray-800">{selected.reason}</p>
              </div>

              <div>
                <div className="text-xs text-gray-400">Submitted</div>
                <div>{new Date(selected.submittedAt).toLocaleString()}</div>
              </div>

              <div>
                <div className="text-xs text-gray-400">Status</div>
                <div>{selected.status}</div>
              </div>
            </section>

            <footer className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelected(null)}
                className="px-3 py-1 rounded-md border"
              >
                Close
              </button>

              {selected.status === "Pending" && (
                <>
                  <button
                    onClick={() => setConfirmAction({ id: selected.id, action: "deny" })}
                    className="px-3 py-1 rounded-md bg-red-600 text-white"
                  >
                    Deny
                  </button>
                  <button
                    onClick={() => setConfirmAction({ id: selected.id, action: "approve" })}
                    className="px-3 py-1 rounded-md bg-green-600 text-white"
                  >
                    Approve
                  </button>
                </>
              )}
            </footer>
          </div>
        </div>
      )}

      {/* Confirm dialog (simple inline) */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setConfirmAction(null)} />
          <div className="relative bg-white rounded-lg shadow-lg p-5 max-w-md w-full z-10">
            <h3 className="text-lg font-semibold text-gray-900">
              Confirm {confirmAction.action === "approve" ? "Approve" : "Deny"}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to{" "}
              <strong>{confirmAction.action === "approve" ? "approve" : "deny"}</strong> this leave
              request? This action updates the request status locally.
            </p>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-3 py-1 rounded-md border"
              >
                Cancel
              </button>
              <button
                onClick={() => applyAction(confirmAction.id, confirmAction.action)}
                className="px-3 py-1 rounded-md bg-blue-600 text-white"
              >
                Yes, {confirmAction.action === "approve" ? "Approve" : "Deny"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
