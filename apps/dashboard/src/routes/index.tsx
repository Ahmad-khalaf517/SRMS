import { Routes, Route } from "react-router";
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login-page";
import Signup from "@/pages/signup";
import NotFound from "@/pages/not-found";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}