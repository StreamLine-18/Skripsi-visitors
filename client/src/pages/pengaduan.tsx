import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Megaphone, Send } from "lucide-react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";

export default function ComplaintPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    complaint_type: "",
    gender: "",
    status: "",
    phone: "",
    description: "",
    priority: "",
  });

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/complaints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Gagal mengirim pengaduan");
      return res.json();
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[400px] bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/hero.png')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 mb-6 -ml-2 rounded-lg w-fit"
            >
              ← Kembali
            </Button>
          </Link>
          
          <div className="space-y-4 text-white max-w-4xl">
            <div className="flex items-center space-x-2">
              <Megaphone className="w-6 h-6" />
              <span className="text-sm font-medium tracking-wider uppercase">Pengaduan Masyarakat</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Saluran Pengaduan<br />Elektronik
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl leading-relaxed">
              Sampaikan keluhan, saran, atau laporan Anda secara langsung. Kerahasiaan informasi dijamin penuh sesuai hukum yang berlaku
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-4 py-16">

        <Card className="border-0 shadow-2xl rounded-2xl overflow-hidden">
          <CardContent className="p-8 md:p-12">
            {isSuccess ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Megaphone className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Pengaduan Terkirim!</h2>
                <p className="text-gray-600 text-lg mb-2">
                  Pengaduan Anda telah berhasil dikirim
                </p>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  Tim kami akan menindaklanjuti pengaduan Anda. Terima kasih atas partisipasi Anda
                </p>
                <Link href="/">
                  <Button size="lg" className="bg-orange-600 hover:bg-orange-700 px-8">
                    Kembali ke Beranda
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Personal Information */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Megaphone className="w-5 h-5 text-orange-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Informasi Pengadu</h2>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Nama Lengkap *</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      required 
                      value={form.name} 
                      onChange={handleChange} 
                      placeholder="Nama lengkap anda"
                      className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-lg"
                    />
                    <p className="text-xs text-gray-500">
                      Kerahasiaan informasi anda dijamin secara hukum sesuai peraturan yang berlaku
                    </p>
                  </div>
                </div>

              <div>
                <Label htmlFor="email">Alamat Email *</Label>
                <Input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="email@gmail.com" />
              </div>

              <div>
                <Label htmlFor="complaint_type">Jenis Pengaduan *</Label>
                <Input id="complaint_type" name="complaint_type" required value={form.complaint_type} onChange={handleChange} placeholder="Contoh: Pelayanan, Kebersihan, Fasilitas, dll." />
              </div>

              <div>
                <Label htmlFor="gender">Jenis Kelamin *</Label>
                <select
                  id="gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-gray-300 p-2"
                >
                  <option value="">Pilih jenis kelamin</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div>
                <Label htmlFor="status">Status *</Label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-gray-300 p-2"
                >
                  <option value="">Pilih status</option>
                  <option value="Pelajar">Pelajar</option>
                  <option value="Mahasiswa">Mahasiswa</option>
                  <option value="Peneliti">Peneliti</option>
                  <option value="Mancanegara">Mancanegara</option>
                  <option value="Umum">Umum</option>
                </select>
              </div>

              <div>
                <Label htmlFor="phone">No. Telp / WA *</Label>
                <Input id="phone" name="phone" required value={form.phone} onChange={handleChange} placeholder="0812xxxxxxx" />
                <p className="text-xs text-gray-500 mt-1">
                  Nomor yang dapat dihubungi untuk tindak lanjut laporan.
                </p>
              </div>

              <div>
                <Label htmlFor="description">Deskripsi *</Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Jelaskan masalah atau pengaduan anda di sini..."
                />
              </div>

              <div>
                <Label htmlFor="priority">Prioritas *</Label>
                <select
                  id="priority"
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-gray-300 p-2"
                >
                  <option value="">Pilih tingkat prioritas</option>
                  <option value="5">Sangat tinggi</option>
                  <option value="4">4</option>
                  <option value="3">3</option>
                  <option value="2">2</option>
                  <option value="1">Sangat rendah</option>
                </select>
              </div>

                <div className="pt-8 border-t border-gray-200">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isPending}
                    className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold py-6 text-lg rounded-lg shadow-lg"
                  >
                    {isPending ? "Mengirim..." : (<><Send className="w-5 h-5 mr-2" /> Kirim Pengaduan</>)}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
