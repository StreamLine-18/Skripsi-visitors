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
    { icon: Edit, label: "Edit Profil", href: "/profile/edit" },
    { icon: Heart, label: "Destinasi Favorit", href: "/profile/favorites" },
    { icon: Bell, label: "Notifikasi", href: "/profile/notifications" },
    { icon: HelpCircle, label: "Bantuan & FAQ", href: "/profile/help" },
  ];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Header shimmer */}
        <div className="relative overflow-hidden rounded-2xl h-36 bg-gray-200">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-100 via-emerald-50 to-emerald-100 animate-pulse"></div>
        </div>

        {/* Menu shimmer */}
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-14 rounded-xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Profile Header */}
      <Card className="overflow-hidden border border-gray-100 shadow-sm">
        <div className="gradient-primary text-white p-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{data?.full_name}</h2>
              <p className="opacity-90">{data?.email}</p>
              <p className="text-sm opacity-75 capitalize">
                Role: {data?.role?.name || "visitor"}
              </p>
              <p className="text-sm opacity-75">
                Bergabung sejak{" "}
                {new Date(data?.created_on || "").toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Menu Options */}
      <Card className="shadow-sm border border-gray-100">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Pengaturan Akun
          </h3>
          <div className="space-y-3">
            {menuItems.map(({ icon: Icon, label, href }) => (
              <Button
                key={label}
                variant="ghost"
                className="w-full justify-between p-4 h-auto hover:bg-emerald-50 transition-colors"
                onClick={() => (window.location.href = href)}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5 text-emerald-500" />
                  <span className="text-gray-700 font-medium">{label}</span>
                </div>
                <svg
                  className="w-4 h-4 text-gray-400"
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
              </Button>
            ))}

            <Button
              variant="ghost"
              className="w-full justify-between p-4 h-auto hover:bg-red-50 transition-colors"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
            >
              <div className="flex items-center space-x-3">
                <LogOut className="w-5 h-5 text-red-500" />
                <span className="text-red-600 font-medium">Keluar</span>
              </div>
              <svg
                className="w-4 h-4 text-gray-400"
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
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
