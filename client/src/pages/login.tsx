import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { LogIn, ArrowLeft, Camera, Shield } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, isPending, error } = useMutation({
    mutationFn: async () => login(email, password),
    onSuccess: () => setLocation("/"),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative min-h-screen overflow-hidden -mt-[77px]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 via-teal-900/80 to-cyan-900/90"></div>
        
        <div className="relative min-h-screen flex items-center justify-center px-4 py-20 lg:py-8">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
            {/* Left Column - Welcome Content */}
            <div className="text-white space-y-4 lg:space-y-8 order-2 lg:order-1 hidden lg:block">
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
                  <span className="text-sm font-medium tracking-wider uppercase">Masuk ke Akun</span>
                </div>
                <h1 className="text-6xl font-bold leading-tight">
                  Selamat Datang<br />Kembali
                </h1>
                <p className="text-xl text-white/90 max-w-lg leading-relaxed">
                  Masuk ke akun Anda untuk menikmati layanan lengkap Taman Nasional Alas Purwo dan kelola perjalanan wisata Anda
                </p>
              </div>

              {/* <div className="grid grid-cols-2 gap-6 pt-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-1">Aman & Terpercaya</h3>
                  <p className="text-sm text-white/80">Data Anda dilindungi dengan enkripsi tingkat tinggi</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <LogIn className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-1">Akses Mudah</h3>
                  <p className="text-sm text-white/80">Kelola booking dan profil dengan mudah</p>
                </div>
              </div> */}
            </div>

            {/* Right Column - Login Form */}
            <div className="w-full max-w-md mx-auto order-1 lg:order-2">
              {/* Mobile Back Button */}
              <Link href="/" className="lg:hidden block mb-6">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 -ml-2 rounded-lg"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali
                </Button>
              </Link>

              <Card className="border-0 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-sm bg-white/95">
                <CardContent className="p-6 sm:p-8">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <LogIn className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Masuk ke Akun</h2>
                    <p className="text-sm text-gray-600">Silakan masukkan kredensial Anda</p>
                  </div>

                  <form onSubmit={onSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@email.com"
                        className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
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
                        placeholder="••••••••"
                        className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
                        required
                      />
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-600">
                          {error instanceof Error ? error.message : "Login gagal"}
                        </p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold h-12 text-base rounded-lg shadow-lg"
                      disabled={isPending}
                    >
                      {isPending ? "Memproses..." : (
                        <>
                          <LogIn className="w-5 h-5 mr-2" /> 
                          Masuk Sekarang
                        </>
                      )}
                    </Button>

                    <div className="text-center pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        Belum punya akun?{" "}
                        <Link href="/register" className="text-emerald-600 font-semibold hover:text-emerald-700">
                          Daftar Sekarang
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
