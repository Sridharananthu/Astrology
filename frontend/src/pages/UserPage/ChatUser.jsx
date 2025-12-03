// pages/ChatUser.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";

import { socket } from "../../utils/socket";
import { startChatSession, getChatHistory, endChatSession } from "../../services/chatApi";
import { debitWallet } from "../../services/userApi";

export default function ChatUser() {
  const { panditId } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState("");
  const [isReady, setIsReady] = useState(false);

  const chatRef = useRef(null);
  const roomId = `user_${userId}_pandit_${panditId}`;

  useEffect(() => {
    if (!userId || !panditId) return;

    // Start session on backend (creates session + request if needed)
    startChatSession(userId, panditId).catch((e) => console.error("startChatSession error:", e));

    // Join socket room and provide userId so server has context
    socket.emit("join_room", { roomId, role: "user", userId });

    // Load history (messages but don't unlock UI until chat_ready)
    getChatHistory(roomId).then((res) => {
      if (res.data.success) setMessages(res.data.messages || []);
    });

    const handleReceive = (data) => {
      if (data.roomId !== roomId) return;
      setMessages((prev) => [...prev, data]);
    };

    const handleReady = ({ roomId: ready }) => {
      if (ready === roomId) setIsReady(true);
    };

    const handleWaiting = ({ roomId: waitingRoom }) => {
      if (waitingRoom === roomId) setIsReady(false);
    };

    const handleTyping = ({ sender }) => {
      setTyping(sender);
      setTimeout(() => setTyping(""), 1500);
    };

    const handleChatEnded = ({ roomId: endedRoom }) => {
      if (endedRoom !== roomId) return;
      alert("Pandit has ended the chat.");
      navigate("/user/home");
    };

    socket.on("receive_message", handleReceive);
    socket.on("chat_ready", handleReady);
    socket.on("waiting_for_peer", handleWaiting);
    socket.on("typing", handleTyping);
    socket.on("chat_ended", handleChatEnded);

    // optional: participant joined/left notifications
    socket.on("participant_joined", ({ role }) => {
      // you could show a small toast: `${role} joined`
      // console.log(`${role} joined`);
    });
    socket.on("participant_left", ({ role }) => {
      // console.log(`${role} left`);
    });

    return () => {
      socket.off("receive_message", handleReceive);
      socket.off("chat_ready", handleReady);
      socket.off("waiting_for_peer", handleWaiting);
      socket.off("typing", handleTyping);
      socket.off("chat_ended", handleChatEnded);
      socket.off("participant_joined");
      socket.off("participant_left");
    };
  }, [panditId, userId, navigate]);

  // Auto-scroll: keep the chat locked to bottom when messages change
  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !isReady) return;

    const payload = {
      roomId,
      userId,
      panditId,
      sender: user.name,
      senderName: user.name,
      senderId: userId,
      message: input.trim(),
    };
    socket.emit("send_message", payload);
    setInput("");
  };

  const handleTypingInput = (e) => {
    setInput(e.target.value);
    socket.emit("typing", { roomId, sender: user.name });
  };

  const endSession = async () => {
    try {
      const res = await endChatSession(roomId);

      if (res.data.success) {
        // Notify other participant via socket (server will also emit on end-session)
        socket.emit("chat_ended", { roomId, endedBy: "user" });
        navigate("/user/home");
      } else {
        console.warn("Could not end chat:", res.data.message);
      }
    } catch (err) {
      console.error("Failed to end chat:", err);
    }
  };

  useEffect(() => {
    if (!isReady) return;
    console.log("should deduct amount")
    const interval = setInterval(async () => {
      try {
        const res = await debitWallet(panditId);
        if (!res.success) {
          alert("Insufficient balance. Chat ended.");
          socket.emit("chat_ended", { roomId, endedBy: "system" });
          navigate("/user/home");
        }
      } catch (err) {
        console.log("Debit error:", err);
      }
    }, 10000); // should be 60000
    
    return () => clearInterval(interval);
  }, [isReady]);

 

  return (
    <div className="flex bg-white shadow-lg rounded-lg mt-[64px] h-[calc(100vh-64px)]">
      <aside className="w-64 border-r p-4 flex flex-col bg-gray-50">
        <button onClick={endSession} className="flex items-center gap-2 mb-4 text-gray-600 hover:text-black">
          <ArrowLeft size={18} /> Back
        </button>

        <h2 className="text-xl font-semibold">Chat with Pandit</h2>
        <p className="text-sm text-gray-500 mt-1">ID: {panditId}</p>

        <button className="mt-6 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg" onClick={endSession}>
          End Chat
        </button>
      </aside>

      <main className="flex-1 flex flex-col bg-gray-100">
        <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {!isReady ? (
            <div className="text-center text-gray-500 mt-32">⏳ Waiting for pandit…</div>
          ) : (
            <>
              {messages.map((msg, index) => {
                const senderField = msg.sender || msg.senderName || msg.senderId;
                const isMine = senderField === user.name || senderField === userId;
                return (
                  <div key={index} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-xs p-3 rounded-lg ${isMine ? "bg-indigo-600 text-white" : "bg-white border shadow-sm"}`}>
                      <p>{msg.text || msg.message}</p>
                      <div className="flex items-center gap-1 text-[10px] opacity-70 mt-1">{new Date(msg.time).toLocaleTimeString()}</div>
                    </div>
                  </div>
                );
              })}
              {typing && <div className="text-sm text-gray-500 italic pl-2">{typing} is typing…</div>}
            </>
          )}
        </div>

        <div className="p-4 border-t flex items-center gap-3 bg-white">
          <input
            type="text"
            value={input}
            disabled={!isReady}
            onChange={handleTypingInput}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-300 disabled:opacity-50"
            placeholder={isReady ? "Type a message…" : "Waiting for pandit to join…"}
          />
          <button onClick={handleSend} disabled={!isReady} className={`p-3 rounded-full ${isReady ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-400 text-gray-200"}`}>
            <Send size={20} />
          </button>
        </div>
      </main>
    </div>
  );
}
