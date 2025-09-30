import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Edit, 
  Heart, 
  Bell, 
  HelpCircle, 
  LogOut,
  MapPin,
  Calendar,
  CreditCard 
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  memberSince: string;
  stats: {
    totalVisits: number;
    totalSpent: string;
    favorites: number;
  };
}

export default function Profile() {
  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: ["/api/profile"],
  });

  const menuItems = [
    { icon: Edit, label: "Edit Profil", href: "/profile/edit" },
    { icon: Heart, label: "Destinasi Favorit", href: "/profile/favorites" },
    { icon: Bell, label: "Notifikasi", href: "/profile/notifications" },
    { icon: HelpCircle, label: "Bantuan & FAQ", href: "/profile/help" },
  ];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <div className="animate-pulse">
          <div className="gradient-primary rounded-2xl h-32 mb-6"></div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-20"></div>
            ))}
          </div>
          <div className="bg-gray-200 rounded-2xl h-64"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Profile Header */}
      <Card className="overflow-hidden">
        <div className="gradient-primary text-white p-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{profile?.name}</h2>
              <p className="opacity-90">{profile?.email}</p>
              <p className="text-sm opacity-75">Member sejak {profile?.memberSince}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <MapPin className="w-5 h-5 text-teal-600 mr-1" />
              <div className="text-2xl font-bold text-teal-600">{profile?.stats.totalVisits}</div>
            </div>
            <p className="text-xs text-gray-600">Total Kunjungan</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <CreditCard className="w-5 h-5 text-blue-600 mr-1" />
              <div className="text-2xl font-bold text-blue-600">{profile?.stats.totalSpent}</div>
            </div>
            <p className="text-xs text-gray-600">Total Pengeluaran</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Heart className="w-5 h-5 text-orange-600 mr-1" />
              <div className="text-2xl font-bold text-orange-600">{profile?.stats.favorites}</div>
            </div>
            <p className="text-xs text-gray-600">Favorit</p>
          </CardContent>
        </Card>
      </div>

      {/* Menu Options */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Pengaturan Akun</h3>
          <div className="space-y-3">
            {menuItems.map(({ icon: Icon, label, href }) => (
              <Button
                key={label}
                variant="ghost"
                className="w-full justify-between p-4 h-auto hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{label}</span>
                </div>
                <svg 
                  className="w-4 h-4 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            ))}
            
            <Button
              variant="ghost"
              className="w-full justify-between p-4 h-auto hover:bg-red-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <LogOut className="w-5 h-5 text-red-400" />
                <span className="text-red-600">Keluar</span>
              </div>
              <svg 
                className="w-4 h-4 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
