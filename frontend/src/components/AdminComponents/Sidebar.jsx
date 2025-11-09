import { Link, useLocation } from "react-router-dom";
import { Home, Users, Settings, User, DollarSign } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: <Home size={18} /> },
    { name: "Pandits", path: "/admin/pandits", icon: <User size={18} /> },
    { name: "Users", path: "/admin/users", icon: <Users size={18} /> },
    { name: "Transactions", path: "/admin/transactions", icon: <DollarSign size={18} /> },
    { name: "Settings", path: "/admin/settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="bg-gray-900 text-white w-64 h-screen p-5 fixed">
      <h2 className="text-xl font-semibold mb-6">Admin Portal</h2>
      <ul className="space-y-4">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`flex items-center gap-3 p-2 rounded-md hover:bg-gray-800 ${
                location.pathname === item.path ? "bg-gray-800" : ""
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
