import { Outlet, NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Award, TrendingUp, User, Calendar, LogOut, Menu } from "lucide-react";

export default function EmployeeDashboard() {
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
      navigate("/login"); // redirect if not logged in
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
      <aside className="w-72 bg-gradient-to-b from-indigo-600 to-indigo-800 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-indigo-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">EngageHub</h1>
              <p className="text-xs text-indigo-200">Employee Portal</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {user.full_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{user.full_name}</p>
                  <p className="text-xs text-indigo-200 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <NavLink
            to="rewards"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-white text-indigo-600 shadow-lg"
                  : "text-indigo-100 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <Award className="w-5 h-5" />
            <span className="font-medium">Track Rewards</span>
          </NavLink>

          <NavLink
            to="performance"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-white text-indigo-600 shadow-lg"
                  : "text-indigo-100 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">View Performance</span>
          </NavLink>

          <NavLink
            to="profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-white text-indigo-600 shadow-lg"
                  : "text-indigo-100 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <User className="w-5 h-5" />
            <span className="font-medium">Update Profile</span>
          </NavLink>

          <NavLink
            to="leave"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-white text-indigo-600 shadow-lg"
                  : "text-indigo-100 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Submit Leave</span>
          </NavLink>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-indigo-100 hover:bg-white/10 hover:text-white border border-white/20 hover:border-white/40 group"
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
