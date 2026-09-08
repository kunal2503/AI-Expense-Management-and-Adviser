import { Routes, Route } from "react-router";
import HomePage from "../pages/HomePage";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";

const AppLayout = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};

export default AppLayout;