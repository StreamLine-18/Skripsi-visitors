import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { UserPlus, ArrowLeft, Camera, Shield, Users } from "lucide-react";

export default function RegisterPage() {
  const { register } = useAuth();
  const [, setLocation] = useLocation();
  const [full_name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, isPending, error } = useMutation({
    mutationFn: async () => register(full_name, email, password),
    onSuccess: () => setLocation("/"),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden -mt-[77px]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-indigo-900/80 to-purple-900/90"></div>
        
        <div className="relative h-full flex items-center justify-center px-4">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Welcome Content */}
            <div className="text-white space-y-8">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 mb-6 -ml-2 rounded-lg"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali ke Beranda
                </Button>
              </Link>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Camera className="w-6 h-6" />
                  <span className="text-sm font-medium tracking-wider uppercase">Bergabung dengan Kami</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Mulai Petualangan<br />Anda
                </h1>
                <p className="text-lg md:text-xl text-white/90 max-w-lg leading-relaxed">
                  Daftar sekarang untuk menikmati kemudahan booking, akses eksklusif, dan pengalaman terbaik di Taman Nasional Alas Purwo
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-1">Gratis & Aman</h3>
                  <p className="text-sm text-white/80">Pendaftaran gratis dengan keamanan data terjamin</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-1">Komunitas</h3>
                  <p className="text-sm text-white/80">Bergabung dengan ribuan wisatawan lainnya</p>
                </div>
              </div>
            </div>

            {/* Right Column - Register Form */}
            <div className="w-full max-w-md mx-auto">
              <Card className="border-0 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-sm bg-white/95">
                <CardContent className="p-8 md:p-10">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Buat Akun Baru</h2>
                    <p className="text-gray-600">Isi informasi di bawah untuk mendaftar</p>
                  </div>

                  <form onSubmit={onSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Nama Lengkap</Label>
                      <Input
                        id="name"
                        value={full_name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Masukkan nama lengkap Anda"
                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@email.com"
                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimal 8 karakter"
                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                        required
                      />
                      <p className="text-xs text-gray-500">Password harus minimal 8 karakter</p>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-600">
                          {error instanceof Error ? error.message : "Registrasi gagal"}
                        </p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-6 text-lg rounded-lg shadow-lg"
                      disabled={isPending}
                    >
                      {isPending ? "Memproses..." : (
                        <>
                          <UserPlus className="w-5 h-5 mr-2" /> 
                          Daftar Sekarang
                        </>
                      )}
                    </Button>

                    <div className="text-center pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        Sudah punya akun?{" "}
                        <Link href="/login" className="text-blue-600 font-semibold hover:text-blue-700">
                          Masuk Sekarang
                        </Link>
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
