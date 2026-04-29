import { Menu, Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function TopBar({ setMobileOpen }) {
  const email = localStorage.getItem('adminEmail') || 'admin@gmail.com';
  const initials = email.slice(0, 2).toUpperCase();

  return (
    <header className="h-16 bg-white border-b-2 border-[#2E3192] flex items-center justify-between px-6 sticky top-0 z-20">
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden h-9 w-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="hidden lg:block" />

      <div className="flex items-center gap-3">
        <button className="relative h-9 w-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </button>
        <div className="flex items-center gap-2.5">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-[#2E3192] text-white text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-none">Admin</p>
            <p className="text-xs text-muted-foreground mt-0.5">admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}