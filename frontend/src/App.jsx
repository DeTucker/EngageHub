import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import Signup from "./pages/Signup"
import Login from "./pages/Login"
import EmployeeDashboard from "./pages/dashboards/EmployeeDashboard"
import Rewards from "./pages/dashboards/employee/Rewards"
import Performance from "./pages/dashboards/employee/Performance"
import Profile from "./pages/dashboards/employee/Profile"
import Leave from "./pages/dashboards/employee/Leave"

import HRDashboard from "./pages/dashboards/HRDashboard";
import Overview from "./pages/dashboards/hr/Overview";
import ManageEmployees from "./pages/dashboards/hr/ManageEmployees";
import LeaveRequests from "./pages/dashboards/hr/LeaveRequests";
import PerformanceTracking from "./pages/dashboards/hr/PerformanceTracking";
import Settings from "./pages/dashboards/hr/Settings";
import ManageRewards from "./pages/dashboards/hr/ManageRewards";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute/>}>

        {/* Employee Dashboard */}
        <Route path="/dashboard/employee" element={<EmployeeDashboard />}>
          <Route path="rewards" element={<Rewards />} />
          <Route path="performance" element={<Performance />} />
          <Route path="profile" element={<Profile />} />
          <Route path="leave" element={<Leave />} />
        </Route>

        {/* HRDashoard */}
        <Route path="/dashboard/hr" element={<HRDashboard />}>
          <Route path="overview" element={<Overview />} />
          <Route path="employees" element={<ManageEmployees />} />
          <Route path="rewards" element={<ManageRewards />} />
          <Route path="leaves" element={<LeaveRequests />} />
          <Route path="performance" element={<PerformanceTracking />} />
          <Route path="settings" element={<Settings />} />
        </Route>

      </Route>

      </Routes>
    </Router>
  );
}

export default App;
