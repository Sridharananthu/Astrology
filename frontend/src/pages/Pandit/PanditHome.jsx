import React, { useEffect, useState } from "react";
import { getPanditDashboard } from "../../services/panditApi";

export default function PanditHome() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);

  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;

  useEffect(() => {
    if (!user?._id) return;

    const fetchData = async () => {
      try {
        const data = await getPanditDashboard(user._id);

        if (data.success) {
          setStats(data.stats);
          setOrders(data.recentOrders);
        }
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <StatCard title="Pending Requests" value={stats?.pending} />
        <StatCard title="Completed" value={stats?.completed} />
        <StatCard title="Wallet Balance" value={`₹${stats?.walletBalance}`} />
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Sessions</h3>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2">Client</th>
              <th className="py-2">Email</th>
              <th className="py-2">Status</th>
              <th className="py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-3">{order.client}</td>
                  <td className="py-3">{order.email}</td>
                  <td className="py-3">{order.status}</td>
                  <td className="py-3">{order.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500">
                  No recent sessions
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ------------------------------------------
   Reusable Components
------------------------------------------- */
function StatCard({ title, value }) {
  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-xl font-semibold mt-2">{value ?? "---"}</h3>
    </div>
  );
}
