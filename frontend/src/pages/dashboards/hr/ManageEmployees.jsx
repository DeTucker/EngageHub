import React, { useState, useMemo } from "react";

const FAKE_EMPLOYEES = [
  {
    id: "emp-001",
    name: "Jane Doe",
    role: "HR Manager",
    department: "Human Resources",
    email: "jane.doe@company.com",
    phone: "+254 700 123 456",
    joined: "2023-01-15",
    avatarColor: "bg-indigo-100 text-indigo-700",
  },
  {
    id: "emp-002",
    name: "Samuel Otieno",
    role: "Driver",
    department: "Transport",
    email: "sam.otieno@company.com",
    phone: "+254 711 223 344",
    joined: "2022-09-10",
    avatarColor: "bg-green-100 text-green-700",
  },
  {
    id: "emp-003",
    name: "Aisha Mwangi",
    role: "Logistics Coordinator",
    department: "Operations",
    email: "aisha.mwangi@company.com",
    phone: "+254 722 987 654",
    joined: "2021-12-02",
    avatarColor: "bg-yellow-100 text-yellow-700",
  },
  {
    id: "emp-004",
    name: "Peter Kimani",
    role: "Warehouse Assistant",
    department: "Warehouse",
    email: "peter.kimani@company.com",
    phone: "+254 733 555 999",
    joined: "2024-02-08",
    avatarColor: "bg-red-100 text-red-700",
  },
];

function initials(name) {
  if (!name) return "NA";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function ManageEmployees() {
  const [employees, setEmployees] = useState(FAKE_EMPLOYEES);
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      const matchesSearch =
        e.name.toLowerCase().includes(query.toLowerCase()) ||
        e.role.toLowerCase().includes(query.toLowerCase());
      const matchesDept = department === "All" || e.department === department;
      return matchesSearch && matchesDept;
    });
  }, [employees, query, department]);

  function handleDelete(id) {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  }

  const departments = ["All", ...new Set(employees.map((e) => e.department))];

  return (
    <div className="p-4">
      <header className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Manage Employees</h1>
          <p className="text-sm text-gray-500">View, edit, or remove employees.</p>
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
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="px-3 py-2 border rounded-md w-full md:w-48"
        >
          {departments.map((d) => (
            <option key={d}>{d}</option>
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
              filtered.map((e) => (
                <tr key={e.id} className="border-t">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center font-medium ${e.avatarColor}`}
                      >
                        {initials(e.name)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{e.name}</div>
                        <div className="text-xs text-gray-500">{e.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{e.role}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{e.department}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{e.joined}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelected(e)}
                        className="px-3 py-1 text-sm rounded-md border hover:bg-gray-50"
                      >
                        View
                      </button>
                      <button className="px-3 py-1 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="px-3 py-1 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
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
                <h2 className="text-lg font-semibold text-gray-900">{selected.name}</h2>
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
                {selected.department}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {selected.email}
              </p>
              <p>
                <span className="font-semibold">Phone:</span> {selected.phone}
              </p>
              <p>
                <span className="font-semibold">Joined:</span> {selected.joined}
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
