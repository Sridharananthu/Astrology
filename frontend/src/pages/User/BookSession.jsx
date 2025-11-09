import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";

const BookSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBooking = async () => {
    if (!date || !time) return alert("Please select date and time.");
    setLoading(true);
    try {
      await API.post(`/bookings`, { astrologerId: id, date, time });
      setSuccess(true);
    } catch (err) {
      console.error("Booking failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#fdf6ec] to-[#fff]">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
          <h2 className="text-2xl font-semibold text-green-600">
            ✅ Session Booked Successfully!
          </h2>
          <p className="text-gray-600 mt-2">
            Your astrologer will contact you soon.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 bg-[#ffb300] text-white px-8 py-3 rounded-full hover:bg-[#ff9800] transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf6ec] to-[#fff] flex justify-center items-center px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Book a Session
        </h2>

        <label className="block mb-4">
          <span className="text-gray-700">Select Date</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full mt-2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#ffb300] outline-none"
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">Select Time</span>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full mt-2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#ffb300] outline-none"
          />
        </label>

        <button
          onClick={handleBooking}
          disabled={loading}
          className="w-full bg-[#ffb300] text-white py-3 rounded-full font-semibold hover:bg-[#ff9800] transition"
        >
          {loading ? "Booking..." : "Book Session"}
        </button>
      </div>
    </div>
  );
};

export default BookSession;
