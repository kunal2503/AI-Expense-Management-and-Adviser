import { Routes, Route } from "react-router";
import HomePage from "../pages/HomePage";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";

const AppLayout = () => {
  const isAuthenticated = localStorage.getItem("token") ? true : false;

  return (
    <Routes>
      
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<HomePage />} />
      { isAuthenticated &&
        <Route path="/dashboard" element={<Dashboard />} />
      }
    </Routes>
  );
};

export default AppLayout;