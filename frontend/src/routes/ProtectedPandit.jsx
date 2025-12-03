import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedPandit() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "pandit") {
    return <Navigate to="/pandit/login" replace />;
  }

  return <Outlet />;
}
