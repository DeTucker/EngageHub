import { Outlet, NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { LayoutDashboard, Users, Gift, FileText, TrendingUp, Settings, LogOut, Shield } from "lucide-react";

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
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-purple-600 to-indigo-700 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-purple-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">EngageHub</h1>
              <p className="text-xs text-purple-200">HR Manager Portal</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {user.full_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{user.full_name}</p>
                  <p className="text-xs text-purple-200 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <NavLink
            to="overview"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-white text-purple-600 shadow-lg"
                  : "text-purple-100 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard Overview</span>
          </NavLink>

          <NavLink
            to="employees"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-white text-purple-600 shadow-lg"
                  : "text-purple-100 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Manage Employees</span>
          </NavLink>

          <NavLink
            to="rewards"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-white text-purple-600 shadow-lg"
                  : "text-purple-100 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <Gift className="w-5 h-5" />
            <span className="font-medium">Manage Rewards</span>
          </NavLink>

          <NavLink
            to="leaves"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-white text-purple-600 shadow-lg"
                  : "text-purple-100 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Review Leave Requests</span>
          </NavLink>

          <NavLink
            to="performance"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-white text-purple-600 shadow-lg"
                  : "text-purple-100 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">Employee Performance</span>
          </NavLink>

          <NavLink
            to="settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-white text-purple-600 shadow-lg"
                  : "text-purple-100 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </NavLink>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-purple-100 hover:bg-white/10 hover:text-white border border-white/20 hover:border-white/40 group"
          >
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
