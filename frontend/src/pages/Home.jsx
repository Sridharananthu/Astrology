import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-yellow-50 to-orange-100 pt-16">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center py-20 px-4 w-full bg-gradient-to-b from-yellow-50 to-orange-100">
        <div className="max-w-5xl w-full mx-auto">
          <h1 className="text-5xl font-bold text-orange-600 mb-4">
            Welcome to AstroConnect
          </h1>
          <p className="text-gray-700 text-lg mb-6">
            Connect instantly with trusted astrologers for guidance, predictions, and spiritual support.
          </p>
          <Link
            to="/pandits"
            className="bg-orange-500 text-white px-6 py-3 rounded-lg shadow hover:bg-orange-600 transition-all"
          >
            Consult Now
          </Link>
        </div>
      </section>

      {/* Featured Pandits */}
      <section className="py-16 px-4 sm:px-6 bg-white w-full">
        <div className="max-w-6xl w-full mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-10">
            Featured Astrologers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-orange-50 p-6 rounded-2xl shadow hover:shadow-lg transition-all"
              >
                <img
                  src={`https://i.pravatar.cc/150?img=${i + 10}`}
                  alt={`Pandit ${i}`}
                  className="rounded-full w-24 h-24 mx-auto mb-4 border-4 border-orange-400"
                />
                <h3 className="text-xl font-semibold text-gray-800">
                  Pandit {i} Sharma
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  Expert in Vedic Astrology, Kundali Reading, and Palmistry
                </p>
                <button className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg w-full hover:bg-orange-600">
                  Chat Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-orange-100 px-4 sm:px-6 w-full">
        <div className="max-w-6xl w-full mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-10">
            How It Works
          </h2>
          <div className="flex flex-col md:flex-row justify-center items-stretch gap-10 w-full">
            {[
              {
                title: "1. Sign Up",
                desc: "Create your free account and set your preferences.",
              },
              {
                title: "2. Choose Astrologer",
                desc: "Browse profiles and select the astrologer that fits your needs.",
              },
              {
                title: "3. Start Chat",
                desc: "Instantly connect and get real-time guidance.",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow w-full md:w-1/3 hover:shadow-lg transition-all"
              >
                <h3 className="text-xl font-bold text-orange-600 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-700">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
