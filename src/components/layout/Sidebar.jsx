import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, BookOpen, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Team", path: "/admin/team", icon: Users },
  { label: "Blogs", path: "/admin/blogs", icon: BookOpen },
];

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-white/10">
        <img src="/adminlogo.png" alt="Logo" className="h-14 w-auto object-contain" />
        <div className="flex items-center gap-3 mt-3">
          <span className="text-white text-base font-bold tracking-wide">RealEstate</span>
          <p className="text-white/60 text-[10px] uppercase tracking-widest">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        <p className="text-white/60 text-[10px] uppercase tracking-widest px-3 mb-3 font-semibold">Menu</p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                isActive
                  ? "bg-[#2E3192] text-white shadow-lg border-l-4 border-[#4B4FD4]"
                  : "text-white/70 hover:bg-[#3D41B8] hover:text-white"
              )}
            >
              <item.icon className={cn("h-[18px] w-[18px] transition-transform duration-200", !isActive && "group-hover:scale-110")} />
              {item.label}
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50" />}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 pb-6 border-t border-white/10 pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:bg-[#3D41B8] hover:text-white transition-all duration-200 w-full group"
        >
          <LogOut className="h-[18px] w-[18px] group-hover:translate-x-0.5 transition-transform" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}
      <aside className={cn(
        "lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-[#1a1c5e] transform transition-transform duration-300 ease-in-out",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <NavContent />
      </aside>
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-[#1a1c5e] z-30">
        <NavContent />
      </aside>
    </>
  );
}