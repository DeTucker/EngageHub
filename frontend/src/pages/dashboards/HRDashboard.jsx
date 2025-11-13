import { Outlet, NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function HRDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = Cookies.get("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user cookie:", e);
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    Cookies.remove("access_token");
    Cookies.remove("user");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="p-5 border-b bg-indigo-600 text-white">
          <h1 className="text-xl font-bold">HR Manager Panel</h1>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-4 border-b bg-gray-50">
            <p className="font-semibold text-gray-800">{user.full_name}</p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="overview"
            className={({ isActive }) =>
              `block p-2 rounded-lg transition ${
                isActive
                  ? "bg-indigo-500 text-white"
                  : "hover:bg-indigo-100 text-gray-700"
              }`
            }
          >
            📊 Dashboard Overview
          </NavLink>

          <NavLink
            to="employees"
            className={({ isActive }) =>
              `block p-2 rounded-lg transition ${
                isActive
                  ? "bg-indigo-500 text-white"
                  : "hover:bg-indigo-100 text-gray-700"
              }`
            }
          >
            👥 Manage Employees
          </NavLink>

          <NavLink
            to="rewards"
            className={({ isActive }) =>
              `block p-2 rounded-lg transition ${
                isActive
                  ? "bg-indigo-500 text-white"
                  : "hover:bg-indigo-100 text-gray-700"
              }`
            }
          >
            🎁 Manage Rewards
          </NavLink>

          <NavLink
            to="leaves"
            className={({ isActive }) =>
              `block p-2 rounded-lg transition ${
                isActive
                  ? "bg-indigo-500 text-white"
                  : "hover:bg-indigo-100 text-gray-700"
              }`
            }
          >
            📝 Review Leave Requests
          </NavLink>

          <NavLink
            to="performance"
            className={({ isActive }) =>
              `block p-2 rounded-lg transition ${
                isActive
                  ? "bg-indigo-500 text-white"
                  : "hover:bg-indigo-100 text-gray-700"
              }`
            }
          >
            📈 Employee Performance
          </NavLink>

          <NavLink
            to="settings"
            className={({ isActive }) =>
              `block p-2 rounded-lg transition ${
                isActive
                  ? "bg-indigo-500 text-white"
                  : "hover:bg-indigo-100 text-gray-700"
              }`
            }
          >
            ⚙️ Settings
          </NavLink>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
