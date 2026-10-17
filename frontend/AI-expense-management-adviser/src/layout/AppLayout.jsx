import { Navigate, Route, Routes, useLocation } from "react-router";
import HomePage from "../pages/HomePage";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";

const AppLayout = () => {
  const location = useLocation();
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  return (
    <Routes>
      <Route path="/signin" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signin />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={isAuthenticated ? <Dashboard key={location.key} /> : <Navigate to="/signin" replace state={{ from: location }} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppLayout;