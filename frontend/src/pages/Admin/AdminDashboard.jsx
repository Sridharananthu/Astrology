// src/pages/Admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) return navigate("/admin/login");

      const res = await axios.get("/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    };
    fetchStats();
  }, []);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-600">Total Pandits</p>
          <h2 className="text-3xl font-semibold">{stats.totalPandits}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-600">Pending Requests</p>
          <h2 className="text-3xl font-semibold">{stats.pendingPandits}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-600">Total Earnings</p>
          <h2 className="text-3xl font-semibold">₹{stats.totalEarnings}</h2>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
