// components/AstrologerPreview.jsx
import React, { useEffect, useState } from "react";
import "../../styles/astrologerPreview.css";
import { useNavigate } from "react-router-dom";
import { FaComments, FaPhoneAlt } from "react-icons/fa";
import { socket } from "../../utils/socket";
import { startChatSession, createChatRequest } from "../../services/chatApi";

const AstrologerPreview = () => {
  const [pandits, setPandits] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const navigate = useNavigate();

  // initial load
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/pandit/getAllPandits");
        const data = await res.json();
        if (!mounted) return;
        if (data.success && Array.isArray(data.pandit)) {
          setPandits(data.pandit.filter((p) => p.status === "approved"));
        }
      } catch (err) {
        console.error("❌ Error fetching pandit:", err);
      }
    };

    load();

    // realtime updates
    const handler = ({ panditId, isOnline, currentSession }) => {
      setPandits((prev) =>
        prev.map((p) =>
          p._id === panditId ? { ...p, isOnline, currentSession } : p
        )
      );
    };
    socket.on("pandit_status_update", handler);

    return () => {
      mounted = false;
      socket.off("pandit_status_update", handler);
    };
  }, []);

  const truncateText = (text, maxLength = 35) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const handleChatClick = async (panditId) => {
    const token = localStorage.getItem("token");
    const stored = localStorage.getItem("user");

    if (!token || !stored) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(stored);
    const userId = user._id;

    try {
      setLoadingId(panditId);

      await startChatSession(userId, panditId);
      await createChatRequest(userId, panditId);

      // Optimistic socket emit (server will also broadcast)
      socket.emit("pandit_status_update", {
        panditId,
        isOnline: true,
        currentSession: "chat",
      });

      navigate(`/user/chat/${panditId}`);
    } catch (err) {
      console.error("❌ Error starting chat:", err);
      alert("Failed to start chat. Please try again.");
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusDot = (p) => {
    if (p.currentSession) return "bg-red-500";
    if (p.isOnline) return "bg-green-500";
    return "bg-gray-400";
  };

  return (
    <section className="astrologer-preview">
      <div className="container">
        <h2 className="section-title">Our Top Astrologers</h2>

        <div className="astrologer-grid">
          {pandits.length > 0 ? (
            pandits.map((p) => {
              const disable = !p.isOnline || p.currentSession;

              return (
                <div className="astro-card" key={p._id}>
                  <div className="astro-image relative">
                    <img
                      src={
                        p.image
                          ? `http://localhost:5000/${p.image.replace(/^(\/)+/, "")}`
                          : "/assets/default-pandit.png"
                      }
                      alt={p.name}
                    />

                    <span
                      className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusDot(
                        p
                      )}`}
                    ></span>
                  </div>

                  <div className="astro-details">
                    <h3 className="astro-name">{p.name}</h3>
                    <p className="astro-lang">{p.languages?.join(", ") || "Language N/A"}</p>
                    <p className="astro-exp">
                      {p.experience ? `${p.experience} Year${p.experience > 1 ? "s" : ""}` : "Experience not mentioned"}
                    </p>
                    <p className="astro-skills">
                      {truncateText(p.skills?.join(", ") || "Astrology Expert")}
                    </p>

                    <div className="astro-bottom">
                      <span className="astro-price">₹{p.rate}/Min</span>
                      <div className="astro-actions">
                        <button
                          className={`astro-btn chat-btn ${disable ? "opacity-40 cursor-not-allowed" : ""}`}
                          disabled={disable || loadingId === p._id}
                          onClick={() => !disable && handleChatClick(p._id)}
                        >
                          {loadingId === p._id ? "Starting..." : <><FaComments className="icon chat-icon" /> Chat</>}
                        </button>

                        <button
                          className={`astro-btn call-btn ${disable ? "opacity-40 cursor-not-allowed" : ""}`}
                          disabled={disable}
                        >
                          <FaPhoneAlt className="icon call-icon" /> Call
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>Loading astrologers...</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AstrologerPreview;
