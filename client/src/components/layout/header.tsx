import { Link, useLocation } from "wouter";
import { useIsMobile } from "@/hooks/use-mobile";
import { Bell, User, Home, Ticket, History } from "lucide-react";
import { useState, useEffect } from "react";

const navItems = [
  { path: "/", icon: Home, label: "Beranda" },
  { path: "/tickets", icon: Ticket, label: "Tiket Saya" },
  { path: "/history", icon: History, label: "Riwayat" },
];

export default function Header() {
  const isMobile = useIsMobile();
  const [location] = useLocation();
  const isHomePage = location === "/";
  const isRegisterPage = location === "/register";
  const isLoginPage = location === "/login";

  const [scrollState, setScrollState] = useState<"transparent" | "glass" | "white">("transparent");

  // Handle scroll state
useEffect(() => {
  const handleScroll = () => {
    // Remove login/register override

    // For non-home pages (except login/register), use white background
    if (!isHomePage && !isLoginPage && !isRegisterPage) {
      setScrollState("white");
      return;
    }

    // For home, login, register → use scroll-based states
    const y = window.scrollY;
    if (y < 100) setScrollState("transparent");
    else if (y < 850) setScrollState("glass");
    else setScrollState("white");
  };

  handleScroll(); 
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [isHomePage, isLoginPage, isRegisterPage, location]);


  // Shared color logic
  const textColorClass =
    scrollState === "transparent" || scrollState === "glass"
      ? "text-white"
      : "text-gray-900";

  const textColorSecondary =
    scrollState === "transparent" || scrollState === "glass"
      ? "text-white/90"
      : "text-gray-600";

  const navLinkColor =
    scrollState === "transparent" || scrollState === "glass"
      ? "text-white/90 hover:text-white"
      : "text-gray-600 hover:text-green-500";

  const activeLinkColor =
    scrollState === "transparent" || scrollState === "glass"
      ? "text-white font-semibold"
      : "text-green-600 font-semibold";

  const activeIndicatorColor =
    scrollState === "transparent" || scrollState === "glass"
      ? "bg-white"
      : "bg-green-400";

  const dividerColor =
    scrollState === "transparent" || scrollState === "glass"
      ? "bg-white/30"
      : "bg-gray-300";

  const profileButtonClass =
    scrollState === "transparent"
      ? "bg-white/20 hover:bg-white/30 backdrop-blur-sm"
      : scrollState === "glass"
      ? "bg-white/30 hover:bg-white/40 backdrop-blur-md ring-1 ring-white/40"
      : "gradient-primary hover:shadow-lg";

  const userIconColor =
    scrollState === "transparent" || scrollState === "glass"
      ? "text-white"
      : "text-white";

  // 🔹 MOBILE HEADER
  if (isMobile) {
    return (
      <header className="gradient-primary text-white p-4 shadow-lg md:hidden sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center space-x-3">
              <img
                src="/assets/logo.png"
                alt="Alas Purwo Logo"
                className="w-10 h-10"
              />
              <div>
                <h1 className="text-lg font-bold">
                  Taman Nasional Alas Purwo
                </h1>
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

  // 🔹 DESKTOP HEADER
  const navbarClasses = `
    hidden md:block
    sticky top-0 z-50 w-full
    transition-all duration-500 ease-in-out
    ${
      scrollState === "transparent"
        ? "bg-transparent border-b shadow-none border-transparent"
        : scrollState === "glass"
        ? "bg-white/20 backdrop-blur-md border-b border-white/20 shadow-sm"
        : "bg-white backdrop-blur-none border-b border-gray-200 shadow-md"
    }
  `;

  return (
    <header className={navbarClasses}>
      <div className="max-w-full mx-auto px-9 py-4">
        <div className="flex items-center justify-between">
          {/* 🔹 Logo Section */}
          <Link
            href="/"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-15 h-15 rounded-lg flex items-center justify-center">
              <img
                src="/assets/logo.png"
                alt="Alas Purwo Logo"
                className="w-10 h-10"
              />
            </div>
            <div>
              <h1
                className={`text-xl font-bold ${textColorClass} transition-colors duration-300`}
              >
                Taman Nasional Alas Purwo
              </h1>
              <p
                className={`text-xs ${textColorSecondary} transition-colors duration-300`}
              >
                Digital Ticketing System
              </p>
            </div>
          </Link>

          {/* 🔹 Navigation & Icons */}
          <div className="flex items-center space-x-8">
            <nav className="flex items-center space-x-6">
              {navItems.map(({ path, label }) => {
                const isActive = location === path;
                return (
                  <Link
                    key={path}
                    href={path}
                    className={`text-sm font-medium transition-colors duration-300 relative py-2 ${
                      isActive ? activeLinkColor : navLinkColor
                    }`}
                  >
                    {label}
                    {isActive && (
                      <span
                        className={`absolute bottom-0 left-0 right-0 h-0.5 ${activeIndicatorColor} rounded-full transition-colors duration-300`}
                      ></span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Divider */}
            <div
              className={`h-8 w-px ${dividerColor} transition-colors duration-300`}
            ></div>

            {/* Profile Icon */}
            <div className="flex items-center space-x-3">
              <Link
                href="/profile"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${profileButtonClass}`}
              >
                <User className={`w-5 h-5 ${userIconColor}`} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
