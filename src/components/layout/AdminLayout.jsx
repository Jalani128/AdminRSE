import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="lg:ml-64 flex flex-col min-h-screen">
        <TopBar setMobileOpen={setMobileOpen} />
        <main className="flex-1 p-6 lg:p-8 bg-[#f8f9ff]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
