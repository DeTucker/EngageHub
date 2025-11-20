import { Clock, Shield, AlertCircle } from "lucide-react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function PendingApproval() {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("access_token");
    Cookies.remove("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-12 border border-gray-200">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl">
                <Clock className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Account Pending Approval
          </h1>

          {/* Message */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Thank you for signing up! Your account has been created successfully, but it requires approval from an HR Manager before you can access the dashboard.
                </p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-600" />
              What happens next?
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">1.</span>
                <span>An HR Manager will review your account details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">2.</span>
                <span>You'll receive approval within 24-48 hours (typically)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">3.</span>
                <span>Once approved, you can log in and access all features</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleLogout}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 font-medium"
            >
              Back to Login
            </button>
          </div>

          {/* Footer Note */}
          <p className="text-center text-sm text-gray-500 mt-8">
            If you have any questions, please contact your HR department.
          </p>
        </div>
      </div>
    </div>
  );
}
