import { Link, useLocation } from "wouter";
import { Home, Ticket, History, User } from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "Beranda" },
  { path: "/tickets", icon: Ticket, label: "Tiket Saya" },
  { path: "/history", icon: History, label: "Riwayat" },
  { path: "/profile", icon: User, label: "Profil" },
];

export default function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden h-[80px]">
      <div className="flex items-center justify-around">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location === path;
          return (
            <Link key={path} href={path}>
              <button className={`nav-item flex flex-col items-center space-y-1 p-2 ${isActive ? 'active' : ''}`}>
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
