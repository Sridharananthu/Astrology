import React, { useEffect, useState } from "react";
import "../../styles/pandits.css";
import { useNavigate } from "react-router-dom";
import { FaComments, FaPhoneAlt } from "react-icons/fa";
import Navbar from "../../components/LandingComponents/Navbar";
import Footer from "../../components/LandingComponents/Footer";
import { socket } from "../../utils/socket";
import { startChatSession, createChatRequest } from "../../services/chatApi";

const Pandits = () => {
  const [pandits, setPandits] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const navigate = useNavigate();

  /* ---------------------------------------------
       LOAD ONCE + REALTIME UPDATES
  --------------------------------------------- */
  useEffect(() => {
    let mounted = true;

    const loadPandits = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/pandit/getAllPandits");
        const data = await res.json();

        if (!mounted) return;

        if (data.success && Array.isArray(data.pandit)) {
          setPandits(data.pandit.filter((p) => p.status === "approved"));
        }
      } catch (err) {
        console.error("❌ Error fetching pandits:", err);
      }
    };

    loadPandits();

    // Realtime listener
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

  /* ---------------------------------------------
        HELPERS
  --------------------------------------------- */
  const truncateText = (text, maxLength = 35) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const getStatusDot = (p) => {
    if (p.currentSession) return "red-dot"; // busy
    if (p.isOnline) return "green-dot";     // online
    return "gray-dot";                      // offline
  };

  /* ---------------------------------------------
        HANDLE START CHAT
  --------------------------------------------- */
  const handleChat = async (panditId) => {
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

      socket.emit("pandit_status_update", {
        panditId,
        isOnline: true,
        currentSession: "chat",
      });

      navigate(`/user/chat/${panditId}`);
    } catch (err) {
      console.error("❌ Chat start failed:", err);
      alert("Failed to start chat. Try again.");
    } finally {
      setLoadingId(null);
    }
  };

  /* ---------------------------------------------
        UI
  --------------------------------------------- */
  return (
    <div className="panditSection-page">
      <Navbar />

      <section className="panditSection-wrapper">
        <div className="panditSection-container">
          <h2 className="panditSection-title">Our Expert Pandits</h2>
          <p className="panditSection-subtitle">
            Connect with certified pandits for personalized guidance and spiritual insights.
          </p>

          <div className="panditSection-grid">
            {pandits.length > 0 ? (
              pandits.map((p) => {
                const disable = !p.isOnline || p.currentSession;
                return (
                  <div className="panditSection-card" key={p._id}>
                    <div className="panditSection-image relative">
                      <img
                        src={
                          p.image
                            ? `http://localhost:5000/${p.image.replace(/^(\/)+/, "")}`
                            : "/assets/default-pandit.png"
                        }
                        alt={p.name}
                      />

                      {/* status dot */}
                      <span className={`status-dot ${getStatusDot(p)}`}></span>
                    </div>

                    <div className="panditSection-details">
                      <h3 className="panditSection-name">{p.name}</h3>
                      <p className="panditSection-lang">
                        {p.languages?.join(", ") || "Language N/A"}
                      </p>
                      <p className="panditSection-exp">
                        {p.experience
                          ? `${p.experience} Year${p.experience > 1 ? "s" : ""}`
                          : "Experience not mentioned"}
                      </p>
                      <p className="panditSection-skills">
                        {truncateText(p.skills?.join(", ") || "Astrology Specialist")}
                      </p>

                      <div className="panditSection-bottom">
                        <span className="panditSection-price">₹{p.rate || 5}/Min</span>

                        <div className="panditSection-actions">
                          <button
                            className={`panditSection-btn chat-btn ${
                              disable ? "disabled-btn" : ""
                            }`}
                            disabled={disable || loadingId === p._id}
                            onClick={() => !disable && handleChat(p._id)}
                          >
                            {loadingId === p._id ? "Starting..." : (
                              <>
                                <FaComments className="panditSection-icon" /> Chat
                              </>
                            )}
                          </button>

                          <button
                            className={`panditSection-btn call-btn ${
                              disable ? "disabled-btn" : ""
                            }`}
                            disabled={disable}
                          >
                            <FaPhoneAlt className="panditSection-icon" /> Call
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>Loading pandits...</p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pandits;
