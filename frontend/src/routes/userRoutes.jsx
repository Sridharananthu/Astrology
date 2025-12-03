import { Routes, Route } from "react-router-dom";

import Login from "../pages/LandingPage/Login.jsx";
import Signup from "../pages/LandingPage/Signup.jsx";
import HomeUser from "../pages/UserPage/HomeUser.jsx";
import ChatUser from "../pages/UserPage/ChatUser.jsx";
import Pandit from "../pages/LandingPage/Pandits.jsx";
import ProtectedUser from "./ProtectedUser.jsx";
import UserLayout from "../layouts/UserLayout.jsx";
import UserWallet from "../pages/UserPage/WalletUser.jsx";

export default function UserRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Signup />} />
      <Route path="pandits" element={<Pandit />}/>

      {/* Protected */}
      <Route element={<ProtectedUser />}>
        <Route element={<UserLayout />}>
          <Route path="home" element={<HomeUser />} />
          <Route path="wallet" element={<UserWallet />} />
          <Route path="chat/:panditId" element={<ChatUser />} />
        </Route>
      </Route>
    </Routes>
  );
}
