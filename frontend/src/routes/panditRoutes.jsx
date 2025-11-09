import { Routes, Route } from "react-router-dom";

import PanditRegister from "../pages/Pandit/PanditRegister.jsx";
import PanditLogin from "../pages/Pandit/PanditLogin.jsx";
import PanditChangePassword from "../pages/Pandit/PanditChangePassword.jsx";
import PanditDashboard from "../pages/Pandit/PanditDashboard.jsx";
import PanditWallet from "../pages/Pandit/PanditWallet.jsx";
import ChatBox from "../pages/Pandit/Pandit_chatbox.jsx";

const PanditRoutes = () => {
  return (
    <Routes>
      <Route path="/pandit/register" element={<PanditRegister />} />
      <Route path="/pandit/login" element={<PanditLogin />} />
      <Route path="/pandit/changepassword" element={<PanditChangePassword />} />
      <Route path="/pandit/:id/dashboard" element={<PanditDashboard />} />
      <Route path="/pandit/wallet" element={<PanditWallet />} />
      <Route path="/pandit/chat/:userId" element={<ChatBox />} />
    </Routes>
  );
};

export default PanditRoutes;
