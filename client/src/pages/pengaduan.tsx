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
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* --- Header --- */}
      <div className="relative h-[280px] md:h-[360px] overflow-hidden rounded-2xl">
        <img
          src="/assets/hero.png"
          alt="Pengaduan Masyarakat"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white p-4">
          <Megaphone className="w-12 h-12 mb-4 text-white" />
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Pengaduan Masyarakat</h1>
          <p className="text-lg opacity-90 max-w-2xl">
            Sampaikan laporan Anda secara langsung. Kerahasiaan informasi dijamin secara hukum.
          </p>
        </div>
      </div>

      {/* --- Form --- */}
      <Card>
        <CardContent className="p-6">
          {isSuccess ? (
            <div className="text-center py-10">
              <p className="text-green-600 font-medium text-lg">✅ Pengaduan telah dikirim!</p>
              <p className="text-gray-600 text-sm mt-2">
                Terima kasih telah membantu kami meningkatkan transparansi dan kualitas layanan.
              </p>
              <Link href="/">
                <Button className="mt-6" variant="outline">
                  ← Kembali ke Beranda
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="name">Nama Lengkap *</Label>
                <Input id="name" name="name" required value={form.name} onChange={handleChange} placeholder="Nama lengkap anda" />
                <p className="text-xs text-gray-500 mt-1">
                  Kerahasiaan informasi anda dijamin secara hukum, kami tidak akan menggunakan informasi pribadi anda diluar kepentingan investigasi.
                </p>
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

              <Button
                type="submit"
                size="lg"
                disabled={isPending}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {isPending ? "Mengirim..." : (<><Send className="w-5 h-5 mr-2" /> Kirim Pengaduan</>)}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
