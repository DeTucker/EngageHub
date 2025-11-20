import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // 👈 added Link
import Cookies from "js-cookie";
import { userLogin } from "../api";

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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Welcome Back
        </h2>

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
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-500 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
