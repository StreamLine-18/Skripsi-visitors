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
  Settings,
  MapPin,
  Calendar,
  Shield,
  Camera,
} from "lucide-react";

interface UserProfile {
  id_user: string;
  full_name: string;
  email: string;
  role: { name: string };
  created_on: string;
}

export default function Profile() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

  const { data, isLoading } = useQuery<UserProfile>({
    queryKey: ["profile"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/public/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      return json.data;
    },
  });

  const menuItems = [
    { 
      icon: Edit, 
      label: "Edit Profil", 
      href: "/profile/edit",
      description: "Ubah informasi pribadi Anda",
      color: "emerald"
    },
    { 
      icon: Heart, 
      label: "Destinasi Favorit", 
      href: "/profile/favorites",
      description: "Kelola destinasi yang Anda sukai",
      color: "red"
    },
    { 
      icon: Bell, 
      label: "Notifikasi", 
      href: "/profile/notifications",
      description: "Atur preferensi notifikasi",
      color: "blue"
    },
    { 
      icon: HelpCircle, 
      label: "Bantuan & FAQ", 
      href: "/profile/help",
      description: "Dapatkan bantuan dan informasi",
      color: "orange"
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="animate-pulse">
          {/* Hero shimmer */}
          <div className="h-[400px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
          
          {/* Content shimmer */}
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-2xl h-24"></div>
                ))}
              </div>
              <div className="space-y-6">
                <div className="bg-gray-200 rounded-2xl h-64"></div>
                <div className="bg-gray-200 rounded-2xl h-32"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[400px] bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
          <div className="space-y-4 text-white max-w-4xl">
            <div className="flex items-center space-x-2">
              <Camera className="w-6 h-6" />
              <span className="text-sm font-medium tracking-wider uppercase">Profil Pengguna</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Selamat Datang,<br />{data?.full_name}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl leading-relaxed">
              Kelola profil dan preferensi Anda untuk pengalaman terbaik di Taman Nasional Alas Purwo
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Profile Info & Menu */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Info Card */}
            <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Informasi Profil</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Nama Lengkap</label>
                      <p className="text-gray-900 text-lg">{data?.full_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Email</label>
                      <p className="text-gray-900">{data?.email}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Role</label>
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-emerald-600" />
                        <span className="capitalize text-gray-900">{data?.role?.name || "visitor"}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Bergabung Sejak</label>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <span className="text-gray-900">
                          {new Date(data?.created_on || "").toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Menu Options */}
            <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Pengaturan Akun</h2>
                </div>
                
                <div className="grid gap-4">
                  {menuItems.map(({ icon: Icon, label, href, description, color }) => (
                    <Button
                      key={label}
                      variant="ghost"
                      className="w-full justify-start p-6 h-auto hover:bg-gray-50 transition-all duration-300 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md"
                      onClick={() => (window.location.href = href)}
                    >
                      <div className="flex items-center space-x-4 w-full">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          color === 'emerald' ? 'bg-emerald-100' :
                          color === 'red' ? 'bg-red-100' :
                          color === 'blue' ? 'bg-blue-100' :
                          'bg-orange-100'
                        }`}>
                          <Icon className={`w-6 h-6 ${
                            color === 'emerald' ? 'text-emerald-600' :
                            color === 'red' ? 'text-red-600' :
                            color === 'blue' ? 'text-blue-600' :
                            'text-orange-600'
                          }`} />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="font-semibold text-gray-900">{label}</h3>
                          <p className="text-sm text-gray-600">{description}</p>
                        </div>
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Actions & Stats */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Quick Actions Card */}
              <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mb-4">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Aksi Cepat
                    </h3>
                    <p className="text-gray-600">
                      Akses fitur utama dengan mudah
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Button
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 rounded-lg shadow-lg"
                      onClick={() => (window.location.href = "/destinations")}
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Jelajahi Destinasi
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-semibold py-3 rounded-lg"
                      onClick={() => (window.location.href = "/booking")}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Pesan Tiket
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Account Stats Card */}
              <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
                <CardContent className="p-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Statistik Akun
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Status Akun</span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        Aktif
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Kunjungan</span>
                      <span className="font-semibold text-gray-900">-</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Destinasi Favorit</span>
                      <span className="font-semibold text-gray-900">-</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Logout Card */}
              <Card className="border-red-200 bg-red-50/50 rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <LogOut className="w-4 h-4 mr-2 text-red-600" />
                    Keluar dari Akun
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Pastikan Anda telah menyimpan semua perubahan sebelum keluar
                  </p>
                  <Button
                    variant="outline"
                    className="w-full border-red-200 text-red-700 hover:bg-red-100 font-semibold"
                    onClick={() => {
                      localStorage.removeItem("token");
                      window.location.href = "/login";
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Keluar Sekarang
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Mulai Petualangan Anda
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Jelajahi keindahan alam Taman Nasional Alas Purwo dan buat kenangan tak terlupakan
          </p>
          <Button
            size="lg"
            className="bg-white text-emerald-600 hover:bg-gray-100 font-semibold px-8 py-6 text-lg rounded-full shadow-xl"
            onClick={() => (window.location.href = "/destinations")}
          >
            <MapPin className="w-5 h-5 mr-2" />
            Jelajahi Destinasi
          </Button>
        </div>
      </div>
    </div>
  );
}
