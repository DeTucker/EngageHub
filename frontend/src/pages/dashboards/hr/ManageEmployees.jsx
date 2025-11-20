import { useState, useEffect, useMemo } from "react";
import { getAllEmployees } from "../../../api";

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

export default function ManageEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await getAllEmployees();
      setEmployees(res.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load employees");
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      const matchesSearch =
        e.full_name.toLowerCase().includes(query.toLowerCase()) ||
        e.email.toLowerCase().includes(query.toLowerCase());
      const matchesRole = roleFilter === "All" || e.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [employees, query, roleFilter]);

  const roles = ["All", ...new Set(employees.map((e) => e.role))];

  if (loading) {
    return (
      <div className="p-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading employees...</p>
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
          <h1 className="text-xl font-semibold text-gray-900">Manage Employees</h1>
          <p className="text-sm text-gray-500">View and manage employee information.</p>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search employees..."
          className="px-3 py-2 border rounded-md w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border rounded-md w-full md:w-48"
        >
          {roles.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 text-sm text-gray-600">Employee</th>
              <th className="px-4 py-3 text-sm text-gray-600">Role</th>
              <th className="px-4 py-3 text-sm text-gray-600">Department</th>
              <th className="px-4 py-3 text-sm text-gray-600">Joined</th>
              <th className="px-4 py-3 text-sm text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No employees found.
                </td>
              </tr>
            ) : (
              filtered.map((e, idx) => {
                const colorClass = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                return (
                  <tr key={e.email} className="border-t">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center font-medium ${colorClass}`}
                        >
                          {initials(e.full_name)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{e.full_name}</div>
                          <div className="text-xs text-gray-500">{e.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{e.role}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{e.department || "N/A"}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {e.date_of_joining ? new Date(e.date_of_joining).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelected(e)}
                          className="px-3 py-1 text-sm rounded-md border hover:bg-gray-50"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSelected(null)}
          />
          <div className="relative bg-white rounded-lg shadow-lg max-w-lg w-full p-6 z-10">
            <header className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{selected.full_name}</h2>
                <p className="text-sm text-gray-500">{selected.role}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </header>

            <div className="mt-4 text-sm text-gray-700 space-y-2">
              <p>
                <span className="font-semibold">Department:</span>{" "}
                {selected.department || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {selected.email}
              </p>
              <p>
                <span className="font-semibold">Phone:</span> {selected.phone_number || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Joined:</span>{" "}
                {selected.date_of_joining 
                  ? new Date(selected.date_of_joining).toLocaleDateString() 
                  : "N/A"}
              </p>
            </div>

            <footer className="mt-6 flex justify-end">
              <button
                onClick={() => setSelected(null)}
                className="px-3 py-1 rounded-md border"
              >
                Close
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
