// components/pandit/PanditSidebar.jsx
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  History,
  Wallet,
  User,
  LogOut,
} from "lucide-react";
import { socket } from "../../utils/socket"; // make sure you have this
import API from "../../services/api";
import {
  setPanditOnlineStatus,
  getPanditDashboard,
  setPanditSessionStatus,
} from "../../services/panditApi";


export default function PanditSidebar() {
  const [pandit, setPandit] = useState(null);
  const [isOnline, setIsOnline] = useState(false);

  const stored = localStorage.getItem("pandit") || localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;
  const panditId = user?._id;

  useEffect(() => {
    if (!panditId) return;
    const fetchData = async () => {
      try {
        const data = await getPanditDashboard(panditId);
        if (data.success) {
          setPandit(data.pandit);
          setIsOnline(Boolean(data.pandit.isOnline));
        }
      } catch (err) {
        console.error("PanditSidebar fetch error:", err);
      }
    };

    fetchData();

    // Listen for status updates for this pandit (optional; useful if dashboard open elsewhere)
    const handler = ({ panditId: id, isOnline: online, currentSession }) => {
      if (id === panditId) {
        setIsOnline(Boolean(online));
        setPandit((prev) => (prev ? { ...prev, currentSession } : prev));
      }
    };
    socket.on("pandit_status_update", handler);

    return () => {
      socket.off("pandit_status_update", handler);
    };
  }, [panditId]);

  const handleToggleOnline = async () => {
    console.log("🔵 TOGGLE CLICKED");
    if (!panditId) return;

    // Optional: prevent toggle if in session (recommended)
    if (pandit?.currentSession) {
      alert("You cannot toggle online/offline while in an active session.");
      return;
    }

    const newStatus = !isOnline;
    try {
      // call your existing API function (keeps server as source of truth)
      const res = await setPanditOnlineStatus(panditId, newStatus);
      // set local state from response (persisted)
      console.log("🟢 API RESPONSE:", res);
      setIsOnline(Boolean(res.isOnline));
      console.log("📤 Calling setPanditOnlineStatus:", panditId, newStatus);

      // Also tell other clients faster (server will also emit from controller)
      socket.emit("pandit_status_update", {
        panditId,
        isOnline: res.isOnline,
        currentSession: pandit?.currentSession || null,
      });
    } catch (err) {
      console.error("Toggle error:", err);
      // revert UI if error
      setIsOnline((s) => s);
      alert("Failed to change status. Try again.");
    }
  };

  const handleLogout = async () => {
    if (!panditId) return;
    // clear session on logout
    try {
      await setPanditSessionStatus(panditId, null);
      socket.emit("pandit_status_update", { panditId, isOnline: false, currentSession: null });
    } catch (e) {
      console.error("Failed clearing session on logout", e);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      window.location.href = "/pandit/login";
    }
  };

  return (
    <aside className="w-64 bg-white shadow-md flex flex-col justify-between min-h-screen">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold">Pandit Panel</h1>
        <p className="text-sm text-gray-500">{pandit?.name}</p>

        <div className="mt-4 flex items-center gap-3">
          <span className={`text-sm ${isOnline ? "text-green-600" : "text-red-500"}`}>
            {isOnline ? "Online" : "Offline"}
          </span>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isOnline}
              onChange={handleToggleOnline}
              className="sr-only peer"
            />
            <div
              className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer
                peer-checked:bg-green-500 after:content-[''] after:absolute after:top-0.5 
                after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full
                after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"
            ></div>
          </label>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <SideItem to="/pandit/home" icon={<LayoutDashboard size={18} />} label="Dashboard" />
        <SideItem to="/pandit/sessions" icon={<History size={18} />} label="Sessions" />
        <SideItem to="/pandit/requests" icon={<MessageSquare size={18} />} label="Chat Requests" />
        <SideItem to="/pandit/wallet" icon={<Wallet size={18} />} label="Wallet" />
        <SideItem to="/pandit/profile" icon={<User size={18} />} label="Profile" />
      </nav>

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
        `flex items-center gap-3 px-4 py-2 rounded-lg ${
          isActive ? "bg-indigo-100 text-indigo-600" : "text-gray-700 hover:bg-gray-100"
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}
