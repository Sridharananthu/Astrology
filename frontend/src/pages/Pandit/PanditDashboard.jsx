import React, { useState, useEffect } from "react";
import {
  Wallet,
  CalendarDays,
  CheckCircle2,
  Clock,
  MessageCircle,
} from "lucide-react";
import StatCard from "../../components/PanditComponents/StatCard";
import ChatBox from "../Pandit/Pandit_chatbox";
import { getPanditDashboard } from "../../services/api"; // ✅ import backend call

const Dashboard = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [pandit, setPandit] = useState(null);
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const panditId = localStorage.getItem("panditId");
  // console.log("Pandit Id",panditId);
  // console.log("Acrtive chat",activeChat);
  // console.log("Room iD",roomId);
useEffect(() => {
  const fetchData = async () => {
    const id = localStorage.getItem("panditId");
    const token = localStorage.getItem("panditToken");
    console.log("ID and token", id, token);
    if (!id || !token) {
      console.warn("No Pandit session found, redirecting...");
      // window.location.href = "/pandit/login";
      return;
    }

    try {
      const res = await getPanditDashboard(id);
      console.log("Result is:", res);
      if (res.data.success) {
        setPandit(res.data.pandit);
        setStats(res.data.stats);
        setRecentOrders(res.data.recentOrders);
      } else {
        console.error("Failed to load dashboard:", res.data.message);
      }
    } catch (err) {
      console.error("Error fetching Pandit Dashboard:", err);
      // if (err.response && err.response.status === 401) {
      //   // Unauthorized → redirect
      //   window.location.href = "/pandit/login";
      // }
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);


  // ✅ When Pandit clicks “Chat”
  const handleStartChat = (order) => {
    const room = `user_${order.userId}_pandit_${panditId}`;
    setRoomId(room);
    setActiveChat(order);
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-[#d4af37]">
        Loading your dashboard...
      </div>
    );

  if (!pandit)
    return (
      <div className="min-h-screen flex justify-center items-center text-red-400">
        Pandit not found or data missing
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f29] to-[#111633] flex flex-col md:flex-row text-gray-100">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#161b3d] border-r border-[#d4af37]/30 p-6 md:min-h-screen">
        <h1 className="text-3xl font-bold text-[#d4af37] mb-10 text-center md:text-left">
          🕉️ {pandit.name?.split(" ")[0] || "Pandit"} Ji Portal
        </h1>
        <nav className="flex md:flex-col justify-center md:justify-start gap-4">
          {[
            { name: "Dashboard", path: "/pandit/dashboard" },
            { name: "Orders", path: "/pandit/orders" },
            { name: "Wallet", path: "/pandit/wallet" },
            { name: "Profile", path: "/pandit/profile" },
          ].map((link, i) => (
            <a
              key={i}
              href={link.path}
              className="bg-[#0b0f29] hover:bg-[#d4af37] hover:text-black text-gray-200 text-sm font-medium px-5 py-2 rounded-xl border border-[#2e3261] transition-all duration-200"
            >
              {link.name}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
        {!activeChat ? (
          <>
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
              <div>
                <h2 className="text-3xl font-bold text-[#d4af37]">
                  Welcome Back, {pandit.name?.split(" ")[0] || "Pandit"} Ji 🙏
                </h2>
                <p className="text-gray-400 mt-1 text-sm">
                  Here’s your spiritual overview for today
                </p>
              </div>
              <div className="bg-[#d4af37] text-black font-semibold px-6 py-3 rounded-xl mt-4 md:mt-0 shadow-lg">
                Wallet Balance: ₹{stats.walletBalance || 0}
              </div>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <StatCard
                icon={<Clock />}
                label="Pending Orders"
                value={stats.pending || 0}
              />
              <StatCard
                icon={<CalendarDays />}
                label="Upcoming"
                value={stats.upcoming || 0}
              />
              <StatCard
                icon={<CheckCircle2 />}
                label="Completed"
                value={stats.completed || 0}
              />
            </div>

            {/* Upcoming Booking */}
            {stats.nextBooking && (
              <div className="bg-[#161b3d] border border-[#2e3261] rounded-2xl shadow-xl p-6 mb-10">
                <h3 className="text-lg font-semibold mb-3 text-[#d4af37] flex items-center">
                  <CalendarDays className="mr-2 text-[#d4af37]" /> Next Booking
                </h3>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-200">
                      {stats.nextBooking.service}
                    </p>
                    <p className="text-sm text-gray-400">
                      Client: {stats.nextBooking.client}
                    </p>
                  </div>
                  <p className="text-sm text-gray-400">
                    {new Date(stats.nextBooking.date).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {/* Recent Orders (From Backend) */}
            <div className="bg-[#161b3d] border border-[#2e3261] rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-[#d4af37]">
                Recent Chat Requests
              </h3>

              {recentOrders.length === 0 ? (
                <p className="text-gray-400 italic">
                  No recent chat sessions yet.
                </p>
              ) : (
                <table className="w-full text-left text-gray-300 text-sm">
                  <thead>
                    <tr className="border-b border-[#2e3261] text-gray-400">
                      <th className="pb-2">Session ID</th>
                      <th>Client</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Chat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-[#2e3261]/50 hover:bg-[#0b0f29] transition"
                      >
                        <td className="py-2">{order.id.slice(-6)}</td>
                        <td>{order.client}</td>
                        <td>
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              order.status === "Active"
                                ? "bg-yellow-900/30 text-yellow-300 border border-yellow-600/50"
                                : "bg-green-900/30 text-green-300 border border-green-600/50"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td>{order.date}</td>
                        <td>
                          <button
                            onClick={() => handleStartChat(order)}
                            className="flex items-center gap-1 text-[#d4af37] hover:text-[#f1e08c] transition"
                          >
                            <MessageCircle size={16} />
                            Chat
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        ) : (
          // Chat Mode
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-[#d4af37]">
                Chat with {activeChat.client}
              </h3>
              <button
                onClick={() => setActiveChat(null)}
                className="bg-[#d4af37] text-black px-4 py-2 rounded-xl font-medium hover:bg-[#c09c2e] transition"
              >
                ← Back
              </button>
            </div>

            {/* ✅ Real-time Chat */}
            <ChatBox userId={activeChat.userId} roomId={roomId} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
