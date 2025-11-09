import React from "react";

const StatCard = ({ icon, label, value }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm flex items-center">
    <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full mr-4">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </div>
);

export default StatCard;
