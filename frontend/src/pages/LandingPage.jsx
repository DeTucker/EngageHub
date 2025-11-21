import { Link } from "react-router-dom";
import { Shield, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
            <Shield className="w-9 h-9 text-white" />
          </div>
          <span className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            EngageHub
          </span>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-12 border border-white/60">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Welcome
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            Employee Management System
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <Link
              to="/signup"
              className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Create Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to="/login"
              className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 border-2 border-indigo-200"
            >
              Sign In
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-8">
            Streamline HR operations and boost employee engagement
          </p>
        </div>
      </div>
    </div>
  );
}
