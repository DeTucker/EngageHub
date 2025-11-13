import React from "react";
import Cookie from "js-cookie";

export default function Profile() {
  // Parse the cookie
  const userData = Cookie.get("user");
  const user = userData ? JSON.parse(userData) : null;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow-lg rounded-2xl p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800">No Profile Found</h2>
          <p className="text-gray-500 mt-2 text-sm">
            Please log in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="flex flex-col items-center space-y-5">
          {/* Avatar Circle */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-semibold">
            {user.full_name.charAt(0).toUpperCase()}
          </div>

          {/* Header */}
          <h1 className="text-2xl font-semibold text-gray-800">Profile</h1>
          <p className="text-gray-500 text-sm">Account Information</p>

          <div className="w-full border-t border-gray-200 my-4"></div>

          {/* Profile Details */}
          <div className="w-full space-y-4">
            <div>
              <label className="text-sm text-gray-500 uppercase">Full Name</label>
              <p className="text-lg font-medium text-gray-800">{user.full_name}</p>
            </div>

            <div>
              <label className="text-sm text-gray-500 uppercase">Email</label>
              <p className="text-lg font-medium text-gray-800">{user.email}</p>
            </div>

            <div>
              <label className="text-sm text-gray-500 uppercase">Role</label>
              <p className="text-lg font-medium text-gray-800 capitalize">
                {user.role}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => {
              Cookie.remove("user");
              window.location.reload();
            }}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
