import { Routes, Route } from "react-router-dom";
import AdminLayout from "../components/AdminComponents/AdminLayout.jsx";
import Dashboard from "../pages/Admin/AdminDashboard.jsx";
import ManagePandits from "../pages/Admin/ManagePandits.jsx";
import ManageUsers from "../pages/Admin/ManageUsers.jsx";
import Transactions from "../pages/Admin/Transactions.jsx";
import Settings from "../pages/Admin/Settings.jsx";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="pandits" element={<ManagePandits />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
