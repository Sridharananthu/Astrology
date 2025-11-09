import React, { useState } from "react";

const PanditChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Simulate success for now
    setSuccess(true);
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f29] to-[#111633] flex items-center justify-center px-6 py-16">
      <div className="bg-[#161b3d] border border-[#d4af37] rounded-2xl shadow-2xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-[#d4af37] mb-6">
          Change Your Password
        </h2>

        {error && (
          <p className="text-red-500 bg-red-100 border border-red-400 px-3 py-2 rounded-md text-center mb-4 text-sm">
            {error}
          </p>
        )}

        {success && (
          <div className="bg-green-700 text-white px-3 py-2 rounded-md text-center mb-4 text-sm">
            ✅ Password changed successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 text-sm mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full p-2 rounded-lg bg-[#0b0f29] border border-[#2e3261] focus:border-[#d4af37] outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full p-2 rounded-lg bg-[#0b0f29] border border-[#2e3261] focus:border-[#d4af37] outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#d4af37] text-black font-semibold py-2 rounded-lg hover:bg-[#f5d67a] transition"
          >
            Change Password
          </button>
        </form>

        <p className="text-gray-400 text-center text-sm mt-5">
          Remembered your password?{" "}
          <a href="/pandit-login" className="text-[#d4af37] hover:underline">
            Go back to Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default PanditChangePassword;
