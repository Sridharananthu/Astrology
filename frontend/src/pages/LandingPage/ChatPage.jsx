import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ChatPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: "user", text: input }]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf6ec] to-[#fff] flex flex-col">
      <header className="bg-[#ffb300] text-white py-4 px-6 flex justify-between items-center shadow-md">
        <button onClick={() => navigate(-1)} className="text-white font-bold">
          ← Back
        </button>
        <h2 className="text-lg font-semibold">Chat with Astrologer #{id}</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            Start your conversation 🌟
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-sm px-4 py-2 rounded-2xl shadow ${
                msg.from === "user"
                  ? "bg-[#ffb300] text-white ml-auto"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {msg.text}
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-white border-t flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#ffb300]"
        />
        <button
          onClick={handleSend}
          className="ml-3 bg-[#ffb300] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#ff9800] transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
