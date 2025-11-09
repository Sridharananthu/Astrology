import { Routes, Route } from "react-router-dom";

// ===== Landing Pages =====
import Home from "../pages/LandingPage/Home.jsx";
import Login from "../pages/LandingPage/Login.jsx";
import Signup from "../pages/LandingPage/Signup.jsx";
import Pandits from "../pages/LandingPage/Pandits.jsx";
import AstrologerProfile from "../pages/LandingPage/AstrologerProfile.jsx";
import ChatPage from "../pages/LandingPage/ChatPage.jsx";
import BookSession from "../pages/LandingPage/BookSession.jsx";
import TestSocketChat from "../pages/testSocketChat.jsx";
// ===== User Dashboard =====
import UserDashboard from "../pages/User/UserDashboard.jsx";
import UserChat from "../pages/User/ChatPage.jsx";

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/pandits" element={<Pandits />} />
      <Route path="/astrologer/:id" element={<AstrologerProfile />} />
      <Route path="/chat/:id" element={<ChatPage />} />
      <Route path="/book/:id" element={<BookSession />} />
      <Route path="/user/:id" element={<UserDashboard />} />
      <Route path="/testchat" element={<TestSocketChat />} />
      <Route path="/user/chat/:id" element={<UserChat />} />
    </Routes>
  );
};

export default UserRoutes;
