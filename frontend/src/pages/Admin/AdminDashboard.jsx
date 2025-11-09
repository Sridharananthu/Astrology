import StatCard from "../../components/AdminComponents/StatCard";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts"  ;

const Dashboard = () => {
  const data = [
    { name: "Mon", sessions: 12 },
    { name: "Tue", sessions: 18 },
    { name: "Wed", sessions: 22 },
    { name: "Thu", sessions: 15 },
    { name: "Fri", sessions: 25 },
    { name: "Sat", sessions: 9 },
    { name: "Sun", sessions: 30 },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Pandits" value="54" />
        <StatCard title="Active Users" value="320" />
        <StatCard title="Monthly Revenue" value="₹48,200" />
        <StatCard title="Sessions Today" value="12" />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-semibold mb-4">Weekly Sessions</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sessions" fill="#6366F1" radius={6} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
