import PanditSidebar from "../components/PanditComponents/PanditSidebar";
import { Outlet } from "react-router-dom";

export default function PanditLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <PanditSidebar />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
