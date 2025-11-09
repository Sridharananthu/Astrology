import { useEffect, useState } from "react";

const ManagePandits = () => {
  const [pandits, setPandits] = useState([]);

  useEffect(() => {
    // later: fetch from API
    setPandits([
      { id: 1, name: "Pandit Rajesh Sharma", status: "approved", rating: 4.8 },
      { id: 2, name: "Pandit Meera Joshi", status: "pending", rating: 4.5 },
      { id: 3, name: "Pandit Arjun Rao", status: "rejected", rating: 4.1 },
    ]);
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setPandits((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Manage Pandits</h2>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="p-3">Name</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pandits.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.rating}</td>
                <td className="p-3 capitalize">{p.status}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleStatusChange(p.id, "approved")}
                    className="px-3 py-1 text-sm bg-green-500 text-white rounded-md"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(p.id, "rejected")}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded-md"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagePandits;
