import { useState, useEffect, useMemo } from "react";
import { getAllEmployees } from "../../../api";
import { Users, Search, Filter, Eye, X } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading employees...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 p-5 rounded-xl shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Manage Employees
            </h1>
            <p className="text-gray-600 mt-1">
              View and manage employee information and profiles
            </p>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full md:w-56 pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition appearance-none bg-white cursor-pointer"
            >
              {roles.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          Showing <span className="font-bold text-blue-600">{filtered.length}</span> of {employees.length} employees
        </div>
      </div>

      {/* Table */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Employee</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Role</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Department</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Joined</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-lg font-medium">No employees found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((e, idx) => {
                  const colorClass = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                  return (
                    <tr key={e.email} className="border-b border-gray-100 hover:bg-blue-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold text-sm ${colorClass} shadow-md`}
                          >
                            {initials(e.full_name)}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900">{e.full_name}</div>
                            <div className="text-xs text-gray-500">{e.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          {e.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-medium">{e.department || "N/A"}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {e.date_of_joining ? new Date(e.date_of_joining).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelected(e)}
                          className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />
          <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl max-w-lg w-full p-8 z-10 border border-gray-200 animate-in zoom-in-95 duration-200">
            <header className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {initials(selected.full_name)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selected.full_name}</h2>
                  <p className="text-sm text-blue-600 font-medium">{selected.role}</p>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            <div className="space-y-4 text-sm">
              <div className="p-4 bg-white rounded-xl border border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Department</p>
                <p className="text-base font-medium text-gray-900">{selected.department || "Not specified"}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email</p>
                <p className="text-base font-medium text-gray-900">{selected.email}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                <p className="text-base font-medium text-gray-900">{selected.phone_number || "Not specified"}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Date Joined</p>
                <p className="text-base font-medium text-gray-900">
                  {selected.date_of_joining 
                    ? new Date(selected.date_of_joining).toLocaleDateString() 
                    : "Not specified"}
                </p>
              </div>
            </div>

            <footer className="mt-8 flex justify-end">
              <button
                onClick={() => setSelected(null)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 font-medium"
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
