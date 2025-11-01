import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useLocation } from "wouter";
import { UserPlus } from "lucide-react";

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-teal-50 to-emerald-100 px-4">
      <div className="text-center mb-8">
        <img src="/assets/logo.png" alt="Logo" className="w-20 h-20 mx-auto mb-4 drop-shadow-md" />
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">Buat Akun Baru</h1>
        <p className="text-gray-600 text-base md:text-lg max-w-md mx-auto">
          Bergabung dan nikmati kemudahan layanan Taman Nasional Alas Purwo 
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-5 border border-gray-100"
      >
        <div>
          <Label htmlFor="name" className="text-gray-700 font-medium">Nama Lengkap</Label>
          <Input
            id="name"
            value={full_name}
            onChange={(e) => setName(e.target.value)}
            placeholder="contoh: Name"
            className="mt-1 border-gray-300 focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contoh: user@email.com"
            className="mt-1 border-gray-300 focus:border-green-500 focus:ring-green-500"
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
            placeholder="minimal 8 karakter"
            className="mt-1 border-gray-300 focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
            {error instanceof Error ? error.message : "Registrasi gagal"}
          </p>
        )}

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 rounded-lg transition-all shadow-md"
          disabled={isPending}
        >
          {isPending ? "Memproses..." : (
            <div className="flex items-center justify-center gap-2">
              <UserPlus className="w-5 h-5" /> Daftar Sekarang
            </div>
          )}
        </Button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-emerald-700 font-medium hover:underline">
            Masuk Sekarang
          </Link>
        </p>
      </form>
    </div>
  );
}
