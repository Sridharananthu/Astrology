import React, { useEffect, useState } from "react";
import {
  getPanditActiveSessions,
  getPanditHistory,
} from "../../services/panditApi";

export default function PanditSessions() {
  const [active, setActive] = useState([]);
  const [history, setHistory] = useState([]);
  const [tab, setTab] = useState("active"); // active | history

  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;

  useEffect(() => {
    if (!user?._id) return;

    const fetchData = async () => {
      try {
        const activeRes = await getPanditActiveSessions(user._id);
        const historyRes = await getPanditHistory(user._id);

        if (activeRes.success) setActive(activeRes.data || []);
        if (historyRes.success) setHistory(historyRes.data || []);
      } catch (err) {
        console.error("Error loading sessions:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="">
      <h2 className="text-2xl font-semibold mb-6">Sessions</h2>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b pb-2">
        <button
          onClick={() => setTab("active")}
          className={`pb-2 text-lg ${
            tab === "active"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500"
          }`}
        >
          Active Sessions
        </button>

        <button
          onClick={() => setTab("history")}
          className={`pb-2 text-lg ${
            tab === "history"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500"
          }`}
        >
          Session History
        </button>
      </div>

      {/* Content */}
      {tab === "active" ? (
        <SessionTable title="Active Sessions" items={active} />
      ) : (
        <SessionTable title="Session History" items={history} />
      )}
    </div>
  );
}

/* ------------------------------------------
   REUSABLE TABLE COMPONENT
------------------------------------------- */
function SessionTable({ title, items }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2">User</th>
            <th className="py-2">Email</th>
            <th className="py-2">Status</th>
            <th className="py-2">Date</th>
          </tr>
        </thead>

        <tbody>
          {items.length > 0 ? (
            items.map((s) => (
              <tr key={s._id} className="border-b hover:bg-gray-50">
                <td className="py-3">{s.user?.name || "Unknown"}</td>
                <td className="py-3">{s.user?.email || "N/A"}</td>
                <td className="py-3">{s.isActive ? "Active" : "Completed"}</td>
                <td className="py-3">
                  {new Date(s.updatedAt).toLocaleDateString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="py-4 text-center text-gray-500">
                No sessions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
