// frontend/src/pages/TestSocketChat.jsx
import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

const TestSocketChat = () => {
  // ✅ Use real IDs from localStorage
  const userId = localStorage.getItem("userId");
  const panditId = localStorage.getItem("panditId");

  // Fallbacks for testing
  const activeUser = userId || "user_demo_001";
  const activePandit = panditId || "pandit_demo_001";

  // Common room ID
  const roomId = `user_${activeUser}_pandit_${activePandit}`;

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    // ✅ Join same chat room
    socket.emit("join_room", roomId);
    console.log(`📥 Joined room: ${roomId}`);

    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, [roomId]);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const msgData = {
      roomId,
      sender: activeUser,
      receiver: activePandit,
      message,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("send_message", msgData);
    setMessage("");
  };

  // ✅ Send message on Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // prevent newline
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f29] flex flex-col items-center justify-center text-white px-4">
      <h2 className="text-2xl font-bold mb-4 text-[#d4af37]">
        💬 Real-Time Pandit-User Chat
      </h2>

      <div className="text-gray-400 mb-2 text-xs sm:text-sm">
        Room: <span className="text-[#d4af37]">{roomId}</span>
      </div>

      {/* 💬 Chat Window */}
      <div className="bg-[#161b3d] border border-[#d4af37] rounded-xl shadow-md w-full max-w-lg p-4 h-[450px] flex flex-col overflow-y-auto">
        {chat.map((msg, i) => {
          const isSentByUser = msg.sender === activeUser;
          return (
            <div
              key={i}
              className={`flex mb-2 ${
                isSentByUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-2xl shadow-md ${
                  isSentByUser
                    ? "bg-blue-600 text-right rounded-br-none" // sent (you)
                    : "bg-green-600 text-left rounded-bl-none" // received (other)
                }`}
              >
                <p className="break-words">{msg.message}</p>
                <span className="text-xs text-gray-200 mt-1 block">
                  {msg.time}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef}></div>
      </div>

      {/* ✍️ Input Box */}
      <div className="flex mt-4 w-full max-w-lg gap-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 bg-[#161b3d] border border-[#d4af37] rounded-full px-4 py-2 text-white focus:outline-none resize-none"
        />
        <button
          onClick={sendMessage}
          className="bg-[#d4af37] text-black font-semibold px-6 py-2 rounded-full hover:bg-[#f5d67a] transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default TestSocketChat;
    