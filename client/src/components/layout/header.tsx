import { useIsMobile } from "@/hooks/use-mobile";
import { Mountain, Bell, User } from "lucide-react";

export default function Header() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <header className="gradient-primary text-white p-4 shadow-lg md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Mountain className="w-6 h-6" />
            <div>
              <h1 className="text-lg font-bold">Alas Purwo</h1>
              <p className="text-xs opacity-90">Hutan Pertama Jawa</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-orange-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">
                2
              </span>
            </div>
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="hidden md:block bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
                <Mountain className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Taman Nasional Alas Purwo</h1>
                <p className="text-sm text-gray-600">Digital Ticketing System</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-teal-600">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                2
              </span>
            </button>
            <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center">
              <User className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
