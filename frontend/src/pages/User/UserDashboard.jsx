// src/pages/User/UserDashboard.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MessageCircle, Star } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getUserDashboard, startChatSession } from "../../services/api";
import ChatPage from "./ChatPage";

const UserDashboard = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [pandits, setPandits] = useState([]);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePandit, setActivePandit] = useState(null); // 👈 currently selected pandit for chat
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getUserDashboard(id);
        setUser(res.data.user);
        setPandits(res.data.pandits);
        setChats(res.data.chats);
      } catch (err) {
        console.error("Error fetching user dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [id]);

  const handleChatStart = async (panditId) => {
    try {
      const res = await startChatSession(id, panditId);
      console.log(res);
      if (res.data.success) {
        setActivePandit(panditId);
        setRoomId(res.data.roomId);

      }
    } catch (err) {
      console.error("❌ Failed to start chat:", err);
    }
  };

  if (loading)
    return <p className="text-center mt-20 text-gray-600">Loading...</p>;
  if (!user)
    return <p className="text-center mt-20 text-red-600">User not found</p>;

  return (
    <>
      <Navbar />

      <div className="px-4 md:px-12 py-12 bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen">
        <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center text-indigo-700">
          Welcome, {user.name}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 🧑 USER PROFILE CARD */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition col-span-1">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-indigo-700">
              👤 Your Profile
            </h2>
            <div className="flex flex-col items-center">
              <img
                src={user.profilePic || "https://i.pravatar.cc/150"}
                alt="Profile"
                className="w-32 h-32 rounded-full mb-4 border-4 border-indigo-500"
              />
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <p className="text-gray-500 text-sm">{user.email}</p>

              <button className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
                Edit Profile
              </button>
            </div>

            <ul className="mt-6 space-y-2 text-gray-700 text-sm">
              <li><strong>Phone:</strong> {user.phone}</li>
              <li><strong>Gender:</strong> {user.gender}</li>
              <li><strong>DOB:</strong> {new Date(user.dob).toLocaleDateString()}</li>
              <li><strong>Zodiac:</strong> {user.zodiac}</li>
            </ul>
          </div>

          {/* 🔮 PANDITS SECTION */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition col-span-1 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-indigo-700">
              🔮 Available Pandits
            </h2>
            {pandits.length === 0 ? (
              <p className="text-gray-500 italic">No Pandits available yet.</p>
            ) : (
              <ul className="space-y-3">
                {pandits.map((p) => (
                  <li
                    key={p._id}
                    className={`p-3 border rounded-lg flex justify-between items-center cursor-pointer ${
                      activePandit === p._id ? "bg-indigo-50 border-indigo-400" : "hover:bg-gray-50"
                    }`}
                    onClick={() => handleChatStart(p._id)}
                  >
                    <div>
                      <h3 className="font-medium text-gray-800">{p.name}</h3>
                      <p className="text-sm text-gray-500">{p.expertise}</p>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star size={16} /> <span>{p.rating}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 💬 CHAT WINDOW */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition col-span-2 flex flex-col">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-indigo-700">
              💬 Chat
            </h2>
            {activePandit && roomId ? (
              <ChatPage panditId={activePandit} roomId={roomId} />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 italic">
                Select a Pandit to start chatting 💬
              </div>
            )}
          </div>
        </div>

        {/* 🕓 CHAT HISTORY */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-indigo-700">
            🕓 Chat History
          </h2>
          {chats.length === 0 ? (
            <p className="text-gray-500 italic">No previous chats found.</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {chats.map((chat, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-xl hover:bg-gray-50 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {chat.panditId?.name || "Unknown Pandit"}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {chat.lastMessage}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-3 text-indigo-600 text-sm">
                    <div className="flex items-center gap-1">
                      <MessageCircle size={16} />
                      Chat
                    </div>
                    <span>{new Date(chat.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default UserDashboard;
