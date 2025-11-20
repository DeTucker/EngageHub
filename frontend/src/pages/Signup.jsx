import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userRegister } from "../api";

export default function Signup() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { fullName, phone, email, password, confirmPassword } = form;

    // ✅ Validation
    if (!fullName || !phone || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await userRegister({
        full_name: fullName,
        phone_number: phone,
        email,
        password,
      });

      setSuccess("✅ Account created successfully! You'll be redirected to login. Your account requires HR approval before you can access the dashboard.");
      setForm({
        fullName: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      console.log(res.data);
      // Redirect to login after success
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      let errorMessage = "❌ Signup failed. Try again.";

      const data = err?.response?.data;
      if (data && typeof data === "object") {
        errorMessage = Object.entries(data)
          .map(([key, value]) =>
            `${key.replace("_", " ")}: ${Array.isArray(value) ? value.join(", ") : value}`
          )
          .join("\n");
      } else if (err?.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      }

      setError(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">
          Sign Up
        </h2>

        {error && (
          <p className="mb-4 text-center text-sm text-red-500 whitespace-pre-line">
            {error}
          </p>
        )}
        {success && (
          <p className="mb-4 text-center text-sm text-green-600">{success}</p>
        )}

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          className="w-full mb-3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="w-full mb-3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          required
        />

        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2 text-sm text-gray-500"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full mb-3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          required
        />

        <button
          type="submit"
          className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Create Account
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
