import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";

const AstrologerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [astrologer, setAstrologer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAstrologer = async () => {
      try {
        const response = await API.get(`/astrologers/${id}`);
        setAstrologer(response.data);
      } catch (err) {
        console.error("Error fetching astrologer:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAstrologer();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#fdf6ec] to-[#fff] text-gray-600">
        Loading astrologer details...
      </div>
    );
  }

  if (!astrologer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#fdf6ec] to-[#fff] text-gray-600">
        Astrologer not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf6ec] to-[#fff] py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="p-8 flex flex-col md:flex-row items-center md:items-start md:space-x-10">
          <img
            src={astrologer.profileImage || "/assets/default-avatar.png"}
            alt={astrologer.name}
            className="w-40 h-40 rounded-full object-cover border-4 border-[#ffb300]"
          />
          <div className="mt-6 md:mt-0 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-800">
              {astrologer.name}
            </h2>
            <p className="text-gray-500 mt-1">
              {astrologer.specialization || "Astrologer"}
            </p>
            <div className="text-[#ffb300] mt-2 font-semibold">
              ⭐ {astrologer.rating || "4.8"}
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="px-8 pb-10 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            About
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {astrologer.bio || "Astrologer details coming soon..."}
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate(`/chat/${id}`)}
              className="bg-[#ffb300] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#ff9800] transition"
            >
              💬 Chat
            </button>

            <button
              onClick={() => alert('Call feature coming soon!')}
              className="bg-green-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-600 transition"
            >
              📞 Call
            </button>

            <button
              onClick={() => navigate(`/book/${id}`)}
              className="bg-[#ffb300] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#ff9800] transition"
            >
              📅 Book Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AstrologerProfile;
