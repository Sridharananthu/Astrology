// import { Routes, Route, Navigate } from "react-router-dom";

// import AdminLogin from "../pages/Admin/AdminLogin.jsx";
// import Dashboard from "../pages/Admin/AdminDashboard.jsx";
// import ManagePandits from "../pages/Admin/ManagePandits.jsx";
// import ManageUsers from "../pages/Admin/ManageUsers.jsx";
// import Transactions from "../pages/Admin/Transactions.jsx";
// import Settings from "../pages/Admin/Settings.jsx";

// import ProtectedAdmin from "./ProtectedAdmin.jsx";
// import AdminLayout from "../layouts/AdminLayout.jsx";

// export default function AdminRoutes() {
//   return (
//     <Routes>

//       {/* Public Login Route */}
//       <Route path="login" element={<AdminLogin />} />

//       {/* Protected Routes */}
//       <Route element={<ProtectedAdmin />}>
//         <Route element={<AdminLayout />}>

//           {/* Default Route → Dashboard */}
//           <Route index element={<Navigate to="dashboard" replace />} />

//           <Route path="dashboard" element={<Dashboard />} />
//           <Route path="pandit" element={<ManagePandits />} />
//           <Route path="users" element={<ManageUsers />} />
//           <Route path="transactions" element={<Transactions />} />
//           <Route path="settings" element={<Settings />} />

//         </Route>
//       </Route>
//     </Routes>
//   );
// }
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "../pages/Admin/AdminLogin.jsx";
import Dashboard from "../pages/Admin/AdminDashboard.jsx";
import ManagePandits from "../pages/Admin/ManagePandits.jsx";
import ManageUsers from "../pages/Admin/ManageUsers.jsx";
import Transactions from "../pages/Admin/Transactions.jsx";
import Settings from "../pages/Admin/Settings.jsx";

import AdminLayout from "../layouts/AdminLayout.jsx";

export default function AdminRoutes() {
  return (
    <Routes>
      {/* Default Admin Layout - NO PROTECTION */}
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="pandit" element={<ManagePandits />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Optional: login page, but not used */}
      <Route path="login" element={<AdminLogin />} />
    </Routes>
  );
}
