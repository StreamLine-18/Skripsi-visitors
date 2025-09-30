import { Link, useLocation } from "wouter";
import { Home, Ticket, History, User } from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "Beranda" },
  { path: "/tickets", icon: Ticket, label: "Tiket Saya" },
  { path: "/history", icon: History, label: "Riwayat" },
  { path: "/profile", icon: User, label: "Profil" },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <nav className="hidden md:block fixed left-0 top-20 bottom-0 w-64 bg-white border-r border-gray-200 p-4 z-30">
      <div className="space-y-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location === path;
          return (
            <Link key={path} href={path}>
              <button className={`nav-item w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors ${isActive ? 'active' : ''}`}>
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
