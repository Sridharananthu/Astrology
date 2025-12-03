// pages/PanditChat.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";

import { socket } from "../../utils/socket";
import { getChatHistory } from "../../services/chatApi";
import API from "../../services/api";
import { setPanditSessionStatus } from "../../services/panditApi";

export default function PanditChat() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isReady, setIsReady] = useState(false);

  const chatRef = useRef(null);
  const pandit = JSON.parse(localStorage.getItem("pandit"));
  const panditId = pandit?._id;
  const roomId = `user_${userId}_pandit_${panditId}`;

  useEffect(() => {
    if (!userId || !panditId) return;

    // Accept chat on server (set session)
    API.post("/chat/join", { panditId, roomId })
      .then(() => setPanditSessionStatus(panditId, "chat"))
      .then(() => socket.emit("pandit_status_update", { panditId, isOnline: true, currentSession: "chat" }))
      .catch((e) => console.error("Accept chat error", e));

    // Join socket room and pass panditId for server reference
    socket.emit("join_room", { roomId, role: "pandit", panditId });

    // Load history (don't unlock until chat_ready)
    getChatHistory(roomId).then((res) => {
      if (res.data.success) setMessages(res.data.messages || []);
    });

    const handleReceive = (data) => {
      if (data.roomId === roomId) setMessages((prev) => [...prev, data]);
    };
    const handleReady = ({ roomId: ready }) => {
      if (ready === roomId) setIsReady(true);
    };

    const handleChatEnded = ({ roomId: endedRoom }) => {
      if (endedRoom !== roomId) return;
      alert("User has ended the chat.");
      navigate("/pandit/requests");
    };

    socket.on("receive_message", handleReceive);
    socket.on("chat_ready", handleReady);
    socket.on("chat_ended", handleChatEnded);

    // optional: participant events
    socket.on("participant_joined", ({ role }) => {
      // console.log(`${role} joined`);
    });
    socket.on("participant_left", ({ role }) => {
      // console.log(`${role} left`);
    });

    return () => {
      socket.off("receive_message", handleReceive);
      socket.off("chat_ready", handleReady);
      socket.off("chat_ended", handleChatEnded);
      socket.off("participant_joined");
      socket.off("participant_left");

      // clear session when leaving
      setPanditSessionStatus(panditId, null)
        .then(() => socket.emit("pandit_status_update", { panditId, isOnline: true, currentSession: null }))
        .catch((e) => console.error("Failed clearing session on unmount", e));
    };
  }, [userId, panditId, navigate]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !isReady) return;

    const payload = {
      roomId,
      userId,
      panditId,
      sender: pandit.name,
      senderName: pandit.name,
      senderId: panditId,
      message: input.trim(),
    };

    socket.emit("send_message", payload);
    setInput("");
  };

  const endChatNow = async () => {
    try {
      await API.post("/chat/end-session", { roomId });
      // Notify user via socket (server-side chatRoutes also emits)
      socket.emit("chat_ended", { roomId, endedBy: "pandit" });
      navigate("/pandit/requests");
    } catch (err) {
      console.error("Failed to end chat:", err);
    }
  };

  return (
    <div className="h-[90vh] flex bg-white shadow rounded-lg">
      <aside className="w-64 border-r p-4 flex flex-col">
        <button
          onClick={endChatNow}
          className="flex items-center gap-2 mb-4 text-gray-600 hover:text-black"
        >
          <ArrowLeft size={18} /> End Chat
        </button>

        <h2 className="text-xl font-semibold">Chat with User</h2>
        <p className="text-sm text-gray-500 mt-1">User ID: {userId}</p>
      </aside>

      <main className="flex-1 flex flex-col">
        <div ref={chatRef} className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4">
          {!isReady ? (
            <div className="text-center text-gray-500 mt-32">⏳ Waiting for user to join the chat…</div>
          ) : (
            messages.map((msg, index) => {
              const senderField = msg.sender || msg.senderName || msg.senderId;
              const isMine = senderField === pandit.name || senderField === panditId;
              return (
                <div key={index} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs p-3 rounded-lg ${isMine ? "bg-indigo-600 text-white" : "bg-white border shadow"}`}>
                    <p>{msg.text || msg.message}</p>
                    <span className="text-[10px] opacity-60 block mt-1">{new Date(msg.time).toLocaleTimeString()}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 border-t flex items-center gap-3">
          <input
            type="text"
            value={input}
            disabled={!isReady}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-300 disabled:opacity-50"
            placeholder={isReady ? "Type a message…" : "Waiting for user to join…"}
          />

          <button onClick={handleSend} disabled={!isReady} className={`p-3 rounded-full ${isReady ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}>
            <Send size={18} />
          </button>
        </div>
      </main>
    </div>
  );
}
