import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import API from "../../services/api";

const Pandits = () => {
  const [pandits, setPandits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch pandits when component loads
  useEffect(() => {
    const fetchPandits = async () => {
      try {
        const res = await API.get("/pandits/getAllPandits");
        setPandits(res.data.pandits || []);
      } catch (err) {
        console.error("❌ Error fetching pandits:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPandits();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-yellow-50 to-orange-100">
      <Navbar />

      <section className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-orange-600 mb-4">
            Our Expert Astrologers
          </h1>
          <p className="text-gray-700 text-lg mb-10">
            Connect with trusted and verified astrologers for personal guidance and readings.
          </p>

          {loading ? (
            <p className="text-gray-600 text-lg">Loading astrologers...</p>
          ) : pandits.length === 0 ? (
            <p className="text-gray-600 text-lg">No astrologers found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {pandits.map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all p-6 text-center"
                >
                  <img
                    src={p.imageUrl || `https://i.pravatar.cc/150?u=${p._id}`}
                    alt={p.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-orange-400 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-800">{p.name}</h3>
                  <p className="text-gray-500 mt-1 text-sm">{p.speciality || "Astrologer"}</p>
                  <p className="text-orange-600 font-semibold mt-2">
                    ₹{p.ratePerMin || 50}/min
                  </p>
                  <button
                    className="mt-5 bg-orange-500 text-white px-4 py-2 rounded-lg w-full hover:bg-orange-600"
                    onClick={() => alert(`Starting chat with ${p.name}...`)}
                  >
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
