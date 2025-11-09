const Topbar = () => {
  return (
    <div className="flex justify-between items-center bg-white p-4 shadow-md">
      <h1 className="text-lg font-semibold">Admin Dashboard</h1>
      <div className="flex items-center gap-3">
        <img
          src="https://i.pravatar.cc/40"
          alt="admin"
          className="w-8 h-8 rounded-full"
        />
        <span className="text-sm font-medium">Admin</span>
      </div>
    </div>
  );
};

export default Topbar;
