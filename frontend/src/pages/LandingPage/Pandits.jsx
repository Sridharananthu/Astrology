import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import API from "../../services/api";

const Pandits = () => {
  const [pandits, setPandits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch astrologers from backend
  useEffect(() => {
    const fetchPandits = async () => {
      try {
        const res = await API.get("/astrologers"); // <-- make sure backend has this route
        setPandits(res.data);
      } catch (err) {
        console.error("Error fetching pandits:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPandits();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-yellow-50 to-orange-100">
      <Navbar />

      <section className="pt-20 pb-10 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-orange-600 mb-4">
            Our Expert Astrologers
          </h1>
          <p className="text-gray-700 text-lg mb-8">
            Connect with certified astrologers for personalized readings and guidance.
          </p>

          {loading ? (
            <p className="text-gray-600">Loading astrologers...</p>
          ) : pandits.length === 0 ? (
            <p className="text-gray-600">No astrologers found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-6">
              {pandits.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 text-center"
                >
                  <img
                    src={p.imageUrl || `https://i.pravatar.cc/150?u=${p.id}`}
                    alt={p.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-orange-400"
                  />
                  <h3 className="text-xl font-semibold text-gray-800">{p.name}</h3>
                  <p className="text-gray-600 text-sm mt-2">{p.speciality}</p>
                  <p className="text-orange-600 font-semibold mt-3">
                    ₹{p.ratePerMin}/min
                  </p>
                  <button className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg w-full hover:bg-orange-600">
                    Chat Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pandits;
