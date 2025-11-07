import React from "react";

const PanditCard = ({ pandit }) => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-xl transition">
      <img
        src={pandit.image}
        alt={pandit.name}
        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
      />
      <h3 className="text-xl font-semibold mb-2">{pandit.name}</h3>
      <p className="text-gray-600 mb-1">{pandit.title}</p>
      <p className="text-gray-500 text-sm mb-4">{pandit.description}</p>
      <button className="border border-orange-500 text-orange-500 font-medium py-2 px-4 rounded-lg hover:bg-orange-500 hover:text-white transition">
        View Profile / Book Now
      </button>
    </div>
  );
};

export default PanditCard;
