import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPanditRequests } from "../../services/panditApi";
import API from "../../services/api";

export default function PanditChatRequests() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  const stored = localStorage.getItem("pandit");
  const pandit = stored ? JSON.parse(stored) : null;

  const panditId = pandit?._id

  useEffect(() => {
    if (!pandit?._id) return;

    const fetchRequests = async () => {
      try {
        const res = await getPanditRequests(panditId);
        if (res.success) setRequests(res.data || []);
      } catch (err) {
        console.error("Error loading requests:", err);
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = async (req) => {
    try {
      await API.post("/chat/join", {
        panditId: pandit._id,
        roomId: req.roomId,
      });

      navigate(`/pandit/chat/${req.userId}`);
    } catch (err) {
      console.error(err);
      alert("Error accepting chat.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Chat Requests</h2>

      <div className="bg-white rounded-lg shadow-md p-6">
        {requests.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            No chat requests right now.
          </p>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req._id}
                className="flex items-center justify-between bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition"
              >
                <div>
                  <p className="text-lg font-medium">{req.user?.name}</p>
                  <p className="text-sm text-gray-500">{req.user?.email}</p>
                </div>

                <button
                  onClick={() => handleAccept(req)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Accept
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
