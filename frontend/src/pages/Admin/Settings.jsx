import { useState } from "react";

const Settings = () => {
  const [commission, setCommission] = useState(10);
  const [supportEmail, setSupportEmail] = useState("support@astroapp.com");

  const handleSave = () => {
    alert("Settings saved successfully!");
    // later: send to backend
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Platform Settings</h2>
      <div className="bg-white p-6 rounded-xl shadow-md max-w-lg">
        <label className="block mb-4">
          <span className="text-gray-600">Commission Percentage</span>
          <input
            type="number"
            value={commission}
            onChange={(e) => setCommission(e.target.value)}
            className="mt-1 w-full border rounded-md p-2"
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-600">Support Email</span>
          <input
            type="email"
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
            className="mt-1 w-full border rounded-md p-2"
          />
        </label>

        <button
          onClick={handleSave}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;
