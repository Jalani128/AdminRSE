import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, BookOpen, LogOut, Building2, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { base44 } from "@/api/Client";

const navItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Team", path: "/team", icon: Users },
  { label: "Blogs", path: "/blogs", icon: BookOpen },
];

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const location = useLocation();

  const handleLogout = () => base44.auth.logout("/");

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-7 bg-sidebar-bg border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <span className="font-display text-sidebar-fg text-base font-bold tracking-wide">RealEstate</span>
          <p className="text-sidebar-fg/60 text-[10px] uppercase tracking-widest">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        <p className="text-sidebar-fg/60 text-[10px] uppercase tracking-widest px-3 mb-3 font-semibold">Menu</p>
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
                  ? "bg-sidebar-active text-sidebar-active-fg shadow-lg shadow-primary/20 border-l-4 border-primary"
                  : "text-sidebar-fg hover:bg-sidebar-hover hover:text-sidebar-fg"
              )}
            >
              <item.icon className={cn("h-[18px] w-[18px] transition-transform duration-200", !isActive && "group-hover:scale-110")} />
              {item.label}
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 pb-6 border-t border-sidebar-border pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-fg/60 hover:bg-sidebar-hover hover:text-sidebar-fg transition-all duration-200 w-full group"
        >
          <LogOut className="h-[18px] w-[18px] group-hover:translate-x-0.5 transition-transform" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside className={cn(
        "lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-sidebar-bg transform transition-transform duration-300 ease-in-out",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <button onClick={() => setMobileOpen(false)} className="absolute top-5 right-4 text-sidebar-fg/60 hover:text-sidebar-fg">
          <X className="h-5 w-5" />
        </button>
        <NavContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-sidebar-bg z-30">
        <NavContent />
      </aside>
    </>
  );
}
