import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Users,
  MessageSquare,
  CreditCard,
  ClipboardList,
  LogOut,
} from "lucide-react";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("admin")) || {};

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <aside className="w-64 bg-white shadow-md flex flex-col justify-between min-h-screen">
      {/* Header */}
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <p className="text-sm text-gray-500">{admin?.name || "Super Admin"}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">

        <SideItem
          to="/admin/dashboard"
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
        />

        <SideItem
          to="/admin/pandit-profiles"
          icon={<User size={18} />}
          label="Pandit Profiles"
        />

        <SideItem
          to="/admin/sessions"
          icon={<MessageSquare size={18} />}
          label="Sessions"
        />

        <SideItem
          to="/admin/transactions"
          icon={<CreditCard size={18} />}
          label="Transactions"
        />

        <SideItem
          to="/admin/users"
          icon={<Users size={18} />}
          label="Users"
        />

        <SideItem
          to="/admin/logs"
          icon={<ClipboardList size={18} />}
          label="Activity Logs"
        />

      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 p-4 text-red-500 hover:bg-red-50 border-t"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}

function SideItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg font-medium ${
          isActive
            ? "bg-indigo-100 text-indigo-600"
            : "text-gray-700 hover:bg-gray-100"
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}
