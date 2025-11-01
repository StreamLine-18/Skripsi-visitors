import { Link, useLocation } from "wouter";
import { useIsMobile } from "@/hooks/use-mobile";
import { Mountain, Bell, User, Home, Ticket, History } from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "Beranda" },
  { path: "/tickets", icon: Ticket, label: "Tiket Saya" },
  { path: "/history", icon: History, label: "Riwayat" },
];

export default function Header() {
  const isMobile = useIsMobile();
  const [location] = useLocation();

  if (isMobile) {
    return (
      <header className="gradient-primary text-white p-4 shadow-lg md:hidden">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center space-x-3">
              <img src="/public/assets/logo.png" alt="Alas Purwo Logo" className="w-10 h-10" />
              <div>
                <h1 className="text-lg font-bold">Taman Nasional Alas Purwo</h1>
                <p className="text-xs opacity-90">Digital Ticketing System</p>
              </div>
            </div>
          </Link>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bell className="w-5 h-5" />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="hidden md:block bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-full mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-15 h-15  rounded-lg flex items-center justify-center ">
                <img src="/public/assets/logo.png" alt="Alas Purwo Logo" className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Taman Nasional Alas Purwo</h1>
                <p className="text-xs text-gray-600">Digital Ticketing System</p>
              </div>
            </a>
          </Link>

          {/* Navigasi & Ikon di Kanan */}
          <div className="flex items-center space-x-8">
            {/* Menu Navigasi */}
            <nav className="flex items-center space-x-6">
              {navItems.map(({ path, label }) => {
                const isActive = location === path;
                return (
                  <Link key={path} href={path}>
                    <a className={`text-sm font-medium transition-colors relative py-2 ${isActive
                        ? 'text-green-600 font-semibold'
                        : 'text-gray-600 hover:text-green-500'
                      }`}>
                      {label}
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-400 rounded-full"></span>
                      )}
                    </a>
                  </Link>
                );
              })}
            </nav>

            {/* Divider */}
            <div className="h-8 w-px bg-gray-500"></div>

            {/* Ikon (Notifikasi & Profil) */}
            <div className="flex items-center space-x-3">
              <button className="relative p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-all">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold shadow-md">
                  2
                </span>
              </button>

              <Link href="/profile">
                <a className="w-9 h-9 gradient-primary rounded-full flex items-center justify-center hover:shadow-lg transition-shadow cursor-pointer">
                  <User className="text-white w-5 h-5" />
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}