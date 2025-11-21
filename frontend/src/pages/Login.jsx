import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { userLogin } from "../api";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield, Home } from "lucide-react";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false); // 👈 toggle password
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error"); // "error" or "info"
  const navigate = useNavigate();

  useEffect(() => {
    // Check if session expired
    const sessionExpired = sessionStorage.getItem("session_expired");
    if (sessionExpired === "true") {
      setMessage("Your session has expired. Please login again.");
      setMessageType("info");
      sessionStorage.removeItem("session_expired");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("error");

    try {
      const res = await userLogin(formData);
      setMessage(res.data.message || "Login successful!");
      setMessageType("success");

      // ✅ Store token in cookie
      Cookies.set("access_token", res.data.access_token, {
        expires: 7,
        secure: false,
        sameSite: "Strict",
      });

      Cookies.set("user", JSON.stringify(res.data.user), {
        expires: 7,
        secure: false,
        sameSite: "Strict",
      });

      // ✅ Redirect based on role
      if (res.data.user.is_hr) {
        navigate("/dashboard/hr/overview");
      } else if (res.data.user.role === "employee") {
        navigate("/dashboard/employee/tasks");
      } else {
        setMessage("Unknown role. Contact admin.");
        setMessageType("error");
      }
    } catch (err) {
      setMessage(err.response?.data?.detail || "Login failed. Try again.");
      setMessageType("error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-6 relative">
      {/* Back to Home */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-gray-700 hover:text-indigo-600"
      >
        <Home className="w-4 h-4" />
        <span className="text-sm font-medium">Home</span>
      </Link>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            EngageHub
          </span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/60"
        >
          <h2 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-center text-gray-600 mb-8 text-sm">Sign in to continue to your dashboard</p>

        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-center text-sm ${
              messageType === "error"
                ? "bg-red-50 border border-red-200 text-red-700"
                : messageType === "info"
                ? "bg-blue-50 border border-blue-200 text-blue-700"
                : "bg-green-50 border border-green-200 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Email</label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            required
            value={formData.email}
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
              value={formData.password}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 text-sm"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Forgot password */}
        <div className="mb-6 text-right">
          <Link
            to="/forgot-password"
            className="text-sm text-blue-500 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition"
        >
          Login
        </button>

        {/* Signup link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
          >
            Create one now
          </Link>
        </p>
      </form>
      </div>
    </div>
  );
}

export default Login;
