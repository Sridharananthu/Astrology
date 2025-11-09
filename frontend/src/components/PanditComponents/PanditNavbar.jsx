import React from "react";
import { NavLink } from "react-router-dom";
import { Wallet, Home, User, MessageSquare, LogOut, Menu } from "lucide-react";

const PanditNavbar = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <nav className="bg-[#0b0f29] border-b border-[#2e3261] text-gray-100 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Brand */}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#d4af37]">🕉️ Pandit Portal</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <NavLink
              to="/pandit/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? "text-[#d4af37] border-b-2 border-[#d4af37]"
                    : "text-gray-300 hover:text-[#d4af37]"
                }`
              }
            >
              <Home size={16} /> Dashboard
            </NavLink>

            <NavLink
              to="/pandit/orders"
              className={({ isActive }) =>
                `flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? "text-[#d4af37] border-b-2 border-[#d4af37]"
                    : "text-gray-300 hover:text-[#d4af37]"
                }`
              }
            >
              <MessageSquare size={16} /> Orders
            </NavLink>

            <NavLink
              to="/pandit/chat"
              className={({ isActive }) =>
                `flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? "text-[#d4af37] border-b-2 border-[#d4af37]"
                    : "text-gray-300 hover:text-[#d4af37]"
                }`
              }
            >
              💬 Chat
            </NavLink>

            <NavLink
              to="/pandit/wallet"
              className={({ isActive }) =>
                `flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? "text-[#d4af37] border-b-2 border-[#d4af37]"
                    : "text-gray-300 hover:text-[#d4af37]"
                }`
              }
            >
              <Wallet size={16} /> Wallet
            </NavLink>

            <NavLink
              to="/pandit/profile"
              className={({ isActive }) =>
                `flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? "text-[#d4af37] border-b-2 border-[#d4af37]"
                    : "text-gray-300 hover:text-[#d4af37]"
                }`
              }
            >
              <User size={16} /> Profile
            </NavLink>
          </div>

          {/* Right: Logout & Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => alert("Logged out (add backend later)")}
              className="hidden md:flex items-center gap-1 text-gray-300 hover:text-red-400 transition"
            >
              <LogOut size={16} /> Logout
            </button>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-gray-300 hover:text-[#d4af37]"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-[#161b3d] border-t border-[#2e3261] px-4 py-3 space-y-2">
          <NavLink
            to="/pandit/dashboard"
            className="block text-gray-300 hover:text-[#d4af37]"
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/pandit/orders"
            className="block text-gray-300 hover:text-[#d4af37]"
            onClick={() => setMenuOpen(false)}
          >
            Orders
          </NavLink>
          <NavLink
            to="/pandit/chat"
            className="block text-gray-300 hover:text-[#d4af37]"
            onClick={() => setMenuOpen(false)}
          >
            Chat
          </NavLink>
          <NavLink
            to="/pandit/wallet"
            className="block text-gray-300 hover:text-[#d4af37]"
            onClick={() => setMenuOpen(false)}
          >
            Wallet
          </NavLink>
          <NavLink
            to="/pandit/profile"
            className="block text-gray-300 hover:text-[#d4af37]"
            onClick={() => setMenuOpen(false)}
          >
            Profile
          </NavLink>
          <button
            onClick={() => alert("Logged out (add backend later)")}
            className="block text-red-400 mt-2"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default PanditNavbar;
