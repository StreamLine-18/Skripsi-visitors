import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useLocation } from "wouter";
import { LogIn } from "lucide-react";

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-teal-50 to-emerald-100 px-4">
      {/* Logo + Title */}
      <div className="text-center mb-8">
        <img src="/assets/logo.png" alt="Logo" className="w-20 h-20 mx-auto mb-4 drop-shadow-md" />
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">Selamat Datang Kembali</h1>
        <p className="text-gray-600 text-base md:text-lg max-w-md mx-auto">
          Masuk untuk menjelajahi dan menikmati layanan digital Taman Nasional Alas Purwo 
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={onSubmit}
        className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-5 border border-gray-100"
      >
        <div>
          <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            className="mt-1 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
            required
          />
        </div>

        <div>
          <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="mt-1 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
            required
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
            {error instanceof Error ? error.message : "Login gagal"}
          </p>
        )}

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 rounded-lg transition-all shadow-md"
          disabled={isPending}
        >
          {isPending ? "Memproses..." : (
            <div className="flex items-center justify-center gap-2">
              <LogIn className="w-5 h-5" /> Masuk Sekarang
            </div>
          )}
        </Button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Belum punya akun?{" "}
          <Link href="/register" className="text-teal-700 font-medium hover:underline">
            Daftar Sekarang
          </Link>
        </p>
      </form>
    </div>
  );
}
