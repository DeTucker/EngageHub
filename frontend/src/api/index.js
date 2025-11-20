import axios from "axios";
import Cookies from "js-cookie";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/"
});

// Attach token from cookies
API.interceptors.request.use((req) => {
  const token = Cookies.get("access_token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

//API calls

// ============ Authentication ============
//Register                                                                                                                                                                                                                                                                                          
export const userRegister = (formData) => {
  return API.post("/auth/signup/", formData);
};

//Login
export const userLogin = (formData) => {
  return API.post("auth/login/", formData);
};

// Get current user profile
export const getCurrentUser = () => {
  return API.get("/auth/me");
};

// Logout
export const userLogout = () => {
  return API.post("/auth/logout");
};

// ============ Employee Profile ============
// Get my profile
export const getMyProfile = () => {
  return API.get("/employees/me");
};

// Update my profile
export const updateMyProfile = (data) => {
  return API.put("/employees/me", null, { params: data });
};

// Change password
export const changePassword = (data) => {
  return API.post("/employees/change-password", data);
};

// ============ Leave Management ============
// Submit leave request
export const submitLeaveRequest = (data) => {
  return API.post("/leaves/", data);
};

// Get my leaves
export const getMyLeaves = () => {
  return API.get("/leaves/my-leaves");
};

// Get leave balance
export const getLeaveBalance = () => {
  return API.get("/leaves/my-balance");
};

// HR: Get all leaves
export const getAllLeaves = (statusFilter = null) => {
  const params = statusFilter ? { status_filter: statusFilter } : {};
  return API.get("/leaves/all", { params });
};

// HR: Update leave status
export const updateLeaveStatus = (leaveId, data) => {
  return API.patch(`/leaves/${leaveId}`, data);
};

// HR: Get leave statistics
export const getLeaveStatistics = () => {
  return API.get("/leaves/statistics");
};

// ============ Employee Management (HR) ============
// Get all employees
export const getAllEmployees = (params = {}) => {
  return API.get("/employees/", { params });
};

// Get employee details
export const getEmployeeDetails = (employeeId) => {
  return API.get(`/employees/${employeeId}`);
};

// Update employee
export const updateEmployee = (employeeId, data) => {
  return API.put(`/employees/${employeeId}`, null, { params: data });
};

// Get employee statistics
export const getEmployeeStatistics = () => {
  return API.get("/employees/statistics/overview");
};

// Get employee summary
export const getEmployeeSummary = (employeeId) => {
  return API.get(`/employees/${employeeId}/summary`);
};

// ============================================
// PERFORMANCE REVIEWS
// ============================================

// Get my performance reviews
export const getMyPerformanceReviews = () => {
  return API.get("/performance/my-reviews");
};

// Get all performance reviews (HR only)
export const getAllPerformanceReviews = () => {
  return API.get("/performance/all");
};

// Get performance statistics (HR only)
export const getPerformanceStatistics = () => {
  return API.get("/performance/statistics");
};

// ============================================
// REWARDS
// ============================================

// Get my rewards
export const getMyRewards = () => {
  return API.get("/rewards/my-rewards");
};

// Get all rewards (HR only)
export const getAllRewards = () => {
  return API.get("/rewards/all");
};

// Create reward (HR only)
export const createReward = (rewardData) => {
  return API.post("/rewards/", rewardData);
};

// Delete reward (HR only)
export const deleteReward = (rewardId) => {
  return API.delete(`/rewards/${rewardId}`);
};

// Get rewards statistics (HR only)
export const getRewardsStatistics = () => {
  return API.get("/rewards/statistics");
};

export default API;
