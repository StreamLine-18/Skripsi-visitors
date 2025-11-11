import { Link, useLocation } from "wouter";
import { useIsMobile } from "@/hooks/use-mobile";
import { Mountain, Bell, User, Home, Ticket, History } from "lucide-react";
import { useState, useEffect } from "react";

const navItems = [
  { path: "/", icon: Home, label: "Beranda" },
  { path: "/tickets", icon: Ticket, label: "Tiket Saya" },
  { path: "/history", icon: History, label: "Riwayat" },
];

export default function Header() {
  const isMobile = useIsMobile();
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const isHomePage = location === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // Determine navbar styling based on page and scroll state
  const isTransparent = isHomePage && !isScrolled;
const navbarClasses = `
  hidden md:block
  sticky top-0 z-50 w-full
  transition-all duration-500
  ${isTransparent ? "bg-transparent" : "bg-white/100 shadow-md border-b"}
`;


  const textColorClass = isTransparent ? "text-white" : "text-gray-900";
  const textColorSecondary = isTransparent ? "text-white/90" : "text-gray-600";
  const navLinkColor = isTransparent ? "text-white/90 hover:text-white" : "text-gray-600 hover:text-green-500";
  const activeLinkColor = isTransparent ? "text-white font-semibold" : "text-green-600 font-semibold";
  const activeIndicatorColor = isTransparent ? "bg-white" : "bg-green-400";
  // const iconColor = isTransparent ? "text-white hover:text-white hover:bg-white/20" : "text-gray-600 hover:text-teal-600 hover:bg-teal-50";
  const dividerColor = isTransparent ? "bg-white/30" : "bg-gray-300";

  return (
    <header className={navbarClasses}>
      <div className="max-w-full mx-auto px-9 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-15 h-15 rounded-lg flex items-center justify-center">
              <img src="/public/assets/logo.png" alt="Alas Purwo Logo" className="w-10 h-10" />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${textColorClass} transition-colors duration-300`}>
                Taman Nasional Alas Purwo
              </h1>
              <p className={`text-xs ${textColorSecondary} transition-colors duration-300`}>
                Digital Ticketing System
              </p>
            </div>
          </Link>

          {/* Navigasi & Ikon di Kanan */}
          <div className="flex items-center space-x-8">
            {/* Menu Navigasi */}
            <nav className="flex items-center space-x-6">
              {navItems.map(({ path, label }) => {
                const isActive = location === path;
                return (
                  <Link
                    key={path}
                    href={path}
                    className={`text-sm font-medium transition-colors duration-300 relative py-2 ${isActive
                        ? activeLinkColor
                        : navLinkColor
                      }`}
                  >
                    {label}
                    {isActive && (
                      <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${activeIndicatorColor} rounded-full transition-colors duration-300`}></span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Divider */}
            <div className={`h-8 w-px ${dividerColor} transition-colors duration-300`}></div>

            {/* Ikon (Profil) */}
            <div className="flex items-center space-x-3">
              <Link
                href="/profile"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${isTransparent
                    ? "bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                    : "gradient-primary hover:shadow-lg"
                  }`}
              >
                <User className="text-white w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}