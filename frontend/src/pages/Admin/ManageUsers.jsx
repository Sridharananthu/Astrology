import { useState, useEffect } from "react";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // later: fetch from API
    setUsers([
      { id: 1, name: "Amit Verma", email: "amit@gmail.com", status: "active" },
      { id: 2, name: "Riya Sen", email: "riya@gmail.com", status: "blocked" },
    ]);
  }, []);

  const toggleBlock = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "active" ? "blocked" : "active" }
          : u
      )
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Manage Users</h2>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 capitalize">{u.status}</td>
                <td className="p-3">
                  <button
                    onClick={() => toggleBlock(u.id)}
                    className={`px-3 py-1 text-sm rounded-md ${
                      u.status === "active"
                        ? "bg-red-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {u.status === "active" ? "Block" : "Unblock"}
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

export default ManageUsers;
