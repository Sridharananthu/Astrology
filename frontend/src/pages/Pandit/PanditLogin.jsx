import React, { useState } from "react";
import { loginPandit } from "../../services/authApi";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const PanditLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginPandit(formData);

      console.log("PANDIT LOGIN RESPONSE:", res);

      if (res?.success) {
        const { token, data: pandit } = res;

        localStorage.setItem("token", token);
        localStorage.setItem("role", "pandit");
        localStorage.setItem("panditId", pandit._id);
        localStorage.setItem("pandit", JSON.stringify(pandit));

        navigate("/pandit/home");
      } else {
        setError("Invalid login response. Please try again.");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f29] to-[#111633] flex justify-center items-center px-6 py-12">
      <div className="bg-[#161b3d] border border-[#d4af37] rounded-2xl shadow-2xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-[#d4af37] mb-6">
          Pandit Login
        </h2>

        {error && (
          <p className="bg-red-600 text-white text-sm py-2 px-3 rounded-lg mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-white text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your registered email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 text-white rounded-lg bg-[#0b0f29] border border-[#2e3261] focus:border-[#d4af37] outline-none"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-white text-sm mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 pr-10 text-white rounded-lg bg-[#0b0f29] border border-[#2e3261] focus:border-[#d4af37] outline-none"
              required
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 cursor-pointer text-gray-400 hover:text-[#d4af37]"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#d4af37] text-black font-semibold py-2 rounded-lg hover:bg-[#f5d67a] transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-gray-400 text-center text-sm mt-4">
          Don’t have an account?{" "}
          <a href="/pandit/register" className="text-[#d4af37] hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default PanditLogin;
