import { Routes, Route } from "react-router-dom";

import PanditLogin from "../pages/Pandit/PanditLogin.jsx";
import PanditRegister from "../pages/Pandit/PanditRegister.jsx";
import PanditHome from "../pages/Pandit/PanditHome.jsx";
import PanditSessions from "../pages/Pandit/PanditSessions.jsx"
import PanditChatRequests from "../pages/Pandit/PanditChatRequests.jsx";
import PanditChat from "../pages/Pandit/PanditChat.jsx";
import PanditWallet from "../pages/Pandit/PanditWallet.jsx";
// import PanditProfile from "../pages/Pandit/PanditProfile.jsx";
import PanditChangePassword from "../pages/Pandit/PanditChangePassword.jsx";

import ProtectedPandit from "./ProtectedPandit.jsx";
import PanditLayout from "../layouts/PanditLayout.jsx";

export default function PanditRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="login" element={<PanditLogin />} />
      <Route path="register" element={<PanditRegister />} />

      {/* Protected */}
      <Route element={<ProtectedPandit />}>
        <Route element={<PanditLayout />}>
          <Route path="home" element={<PanditHome />} />
          <Route path="sessions" element={<PanditSessions />}/>
          <Route path="requests" element={<PanditChatRequests />} />
          <Route path="chat/:userId" element={<PanditChat />} />
          <Route path="wallet" element={<PanditWallet />} />
          {/* <Route path="profile" element={<PanditProfile />} /> */}
          <Route path="changepassword" element={<PanditChangePassword />} />
        </Route>
      </Route>
    </Routes>
  );
}
