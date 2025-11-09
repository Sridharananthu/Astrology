// src/components/PanditComponents/ChatBox.jsx
import React, { useEffect, useState, useRef } from "react";
import { socket } from "../../utils/socket";

const ChatBox = ({ userId, roomId }) => {
  const panditId = localStorage.getItem("panditId");

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isReady, setIsReady] = useState(false);
  const chatEndRef = useRef(null);

  // 🧠 Join room and setup socket listeners
  useEffect(() => {
    if (!roomId || !panditId) return;

    console.log("🟣 Pandit joining chat room:", { roomId, panditId });

    // Join the chat as pandit
    socket.emit("join_room", { roomId, role: "pandit" });

    // Wait for both sides to connect
    socket.on("chat_ready", ({ roomId: readyRoom }) => {
      if (readyRoom === roomId) {
        console.log("✅ Both participants connected!");
        setIsReady(true);
      }
    });

    // Receive messages
    socket.on("receive_message", (data) => {
      console.log("💬 Received:", data);
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("chat_ready");
      socket.off("receive_message");
    };
  }, [roomId, panditId]);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🟡 Send message
  const sendMessage = () => {
    if (!newMessage.trim() || !isReady) return;

    const msgData = {
      roomId,
      sender: panditId,
      receiver: userId,
      message: newMessage,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("send_message", msgData);
    setMessages((prev) => [...prev, msgData]);
    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-[#161b3d] border border-[#2e3261] rounded-2xl shadow-xl p-6 h-[500px] flex flex-col">
      <h3 className="text-lg font-semibold mb-3 text-[#d4af37]">
        💬 Chat with User #{userId}
      </h3>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 scrollbar-thin scrollbar-thumb-[#2e3261] scrollbar-track-transparent">
        {!isReady ? (
          <div className="text-center text-gray-400 mt-20">
            🕓 Waiting for user to join the chat...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            Start your conversation 🙏
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.sender === panditId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                  msg.sender === panditId
                    ? "bg-[#d4af37] text-black rounded-br-none"
                    : "bg-[#0b0f29] text-gray-200 border border-[#2e3261] rounded-bl-none"
                }`}
              >
                {msg.message}
                <div className="text-[10px] text-gray-400 mt-1">{msg.time}</div>
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef}></div>
      </div>

      {/* Input Area */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder={
            isReady ? "Type your message..." : "Waiting for user to join..."
          }
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={!isReady}
          className="flex-1 bg-[#0b0f29] border border-[#2e3261] text-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#d4af37] disabled:opacity-50"
        />
        <button
          onClick={sendMessage}
          disabled={!isReady}
          className={`font-semibold px-4 py-2 rounded-xl transition ${
            isReady
              ? "bg-[#d4af37] text-black hover:bg-[#c09c2e]"
              : "bg-gray-500 text-gray-300 cursor-not-allowed"
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
