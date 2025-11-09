import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex">
   <Sidebar />
      <div className="ml-64 w-full">
        <Topbar />
              <main className="flex-1 bg-gray-50 p-6">
        <Outlet /> 
      </main>
        <div className="p-6 bg-gray-100 min-h-screen">{children}</div>
      </div>

    </div>
  );
};

export default AdminLayout;
