// src/pages/User/ChatPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { socket } from "../../utils/socket";

const ChatPage = ({ panditId, roomId }) => {
  const userId = localStorage.getItem("userId");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isReady, setIsReady] = useState(false); // ✅ whether both joined
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!roomId || !panditId) return;

    console.log("🟢 Joining chat room:", { roomId, userId, panditId });

    // Join the chat room as user
    socket.emit("join_room", { roomId, role: "user" });

    // Listen for readiness signal from server
    socket.on("chat_ready", ({ roomId: readyRoom }) => {
      if (readyRoom === roomId) {
        console.log("✅ Both participants are connected!");
        setIsReady(true);
      }
    });

    // Listen for incoming messages
    socket.on("receive_message", (data) => {
      console.log("📩 Message received:", data);
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("chat_ready");
      socket.off("receive_message");
    };
  }, [roomId, panditId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !isReady) return;

    const msgData = {
      roomId,
      sender: userId,
      receiver: panditId,
      message: input,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("send_message", msgData);
    setMessages((prev) => [...prev, msgData]);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-[#fffdf5] border border-gray-200 rounded-2xl shadow-lg">
      {/* Header */}
      <div className="bg-[#ffb300] text-white p-4 rounded-t-2xl">
        <h2 className="text-lg font-semibold">Chat with Pandit 🕉️</h2>
      </div>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {!isReady ? (
          <div className="text-center text-gray-500 mt-24">
            🕓 Waiting for Pandit to join the chat...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-24">
            Start your conversation 🌟
          </div>
        ) : (
          messages.map((msg, i) => {
            const isUser = msg.sender === userId;
            return (
              <div
                key={i}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl shadow ${
                    isUser
                      ? "bg-[#ffb300] text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.message}
                  <div className="text-xs text-gray-400 mt-1">{msg.time}</div>
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef}></div>
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={
            isReady ? "Type a message..." : "Waiting for Pandit to join..."
          }
          disabled={!isReady}
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#ffb300] disabled:opacity-50"
        />
        <button
          onClick={sendMessage}
          disabled={!isReady}
          className={`ml-3 px-6 py-2 rounded-full font-semibold transition ${
            isReady
              ? "bg-[#ffb300] text-white hover:bg-[#ff9800]"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
