import { useState } from "react";
import { Link } from "react-router-dom";
import { userRegister } from "../api";

export default function SignupForm() {
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
  const [showConfirm, setShowConfirm] = useState(false);

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

      setSuccess("✅ Account created successfully!");
      setForm({
        fullName: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      console.log(res.data);
    } catch (err) {
      let errorMessage = "❌ Signup failed. Try again.";

      const data = err?.response?.data;
      if (data && typeof data === "object") {
        errorMessage = Object.entries(data)
          .map(([key, value]) =>
            `${key.replace("_", " ")}: ${
              Array.isArray(value) ? value.join(", ") : value
            }`
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
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">
          Create an Account
        </h2>

        {/* Full Name */}
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          className="w-full mb-3 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />

        {/* Phone */}
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="w-full mb-3 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-3 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />

        {/* Password */}
        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative mb-4">
          <input
            type={showConfirm ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? "Hide" : "Show"}
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Sign Up
        </button>

        {/* Error & Success Messages */}
        {error && (
          <p className="mt-3 text-sm text-center text-red-600 whitespace-pre-line">
            {error}
          </p>
        )}
        {success && (
          <p className="mt-3 text-sm text-center text-green-600">{success}</p>
        )}

        {/* Link to Login */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
