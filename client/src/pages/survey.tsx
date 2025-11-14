import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BarChart3, Send } from "lucide-react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";

export default function SurveyPage() {
  const [form, setForm] = useState({
    tanggal_survei: "",
    jam_survei: "",
    lokasi_pelayanan: "",
    disabilitas: "",
    jenis_disabilitas: "",
    gender: "",
    usia: "",
    pendidikan: "",
    pekerjaan: "",
    jenis_pelayanan: "",
    tanggal_pelayanan: "",
    jam_pelayanan: "",
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    q6a: "",
    q6b: "",
    q7a: "",
    q7b: "",
    q8: "",
    q9a: "",
    q9b: "",
    saran: "",
  });

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/survey`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Gagal mengirim survei");
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
      <div className="relative h-[400px] bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 overflow-hidden">
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
              <BarChart3 className="w-6 h-6" />
              <span className="text-sm font-medium tracking-wider uppercase">Survei Kepuasan</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Survei Kepuasan<br />Masyarakat
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl leading-relaxed">
              Bantu kami meningkatkan kualitas pelayanan Taman Nasional Alas Purwo dengan memberikan penilaian dan masukan Anda
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
                  <BarChart3 className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Terima Kasih!</h2>
                <p className="text-gray-600 text-lg mb-2">
                  Survei Anda telah berhasil dikirim
                </p>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  Masukan Anda sangat berharga untuk meningkatkan kualitas pelayanan kami
                </p>
                <Link href="/">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 px-8">
                    Kembali ke Beranda
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                {/* SECTION I */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Informasi Responden</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Tanggal Survei *</Label>
                      <Input 
                        type="date" 
                        name="tanggal_survei" 
                        required 
                        onChange={handleChange}
                        className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Jam Survei *</Label>
                      <select 
                        name="jam_survei" 
                        required 
                        onChange={handleChange} 
                        className="w-full h-12 border border-gray-200 rounded-lg px-3 focus:border-emerald-500 focus:ring-emerald-500"
                      >
                        <option value="">Pilih jam</option>
                        <option value="08.00 - 12.00">08.00 - 12.00</option>
                        <option value="13.00 - 17.00">13.00 - 17.00</option>
                      </select>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Dimana anda mengakses unit pelayanan Anda? *</Label>
                      <Input 
                        name="lokasi_pelayanan" 
                        required 
                        onChange={handleChange} 
                        placeholder="Contoh: Kantor TNAP, website, aplikasi..."
                        className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
                      />
                    </div>

                  <div>
                    <Label>Apakah Anda penyandang disabilitas? *</Label>
                    <select name="disabilitas" required onChange={handleChange} className="w-full border rounded-md p-2">
                      <option value="">Pilih</option>
                      <option value="Ya">Ya</option>
                      <option value="Tidak">Tidak</option>
                    </select>
                  </div>

                  <div>
                    <Label>Jika Ya, jenis disabilitas (bisa kosong)</Label>
                    <Input name="jenis_disabilitas" onChange={handleChange} placeholder="Tuna netra, rungu, daksa, dll." />
                  </div>

                  <div>
                    <Label>Jenis Kelamin *</Label>
                    <select name="gender" required onChange={handleChange} className="w-full border rounded-md p-2">
                      <option value="">Pilih</option>
                      <option value="L">L</option>
                      <option value="P">P</option>
                    </select>
                  </div>

                  <div>
                    <Label>Usia *</Label>
                    <Input name="usia" required onChange={handleChange} placeholder="Contoh: 25" />
                  </div>

                  <div>
                    <Label>Pendidikan Terakhir *</Label>
                    <select name="pendidikan" required onChange={handleChange} className="w-full border rounded-md p-2">
                      <option value="">Pilih</option>
                      <option value="SD">SD/Sederajat</option>
                      <option value="SMP">SMP/Sederajat</option>
                      <option value="SMA">SMA/Sederajat</option>
                      <option value="D1/D2/D3">D1/D2/D3</option>
                      <option value="D4/S1">D4/S1</option>
                      <option value="S2">S2</option>
                      <option value="S3">S3</option>
                    </select>
                  </div>

                  <div>
                    <Label>Pekerjaan *</Label>
                    <select name="pekerjaan" required onChange={handleChange} className="w-full border rounded-md p-2">
                      {["PNS","TNI","POLRI","Swasta","Wiraswasta","IRT","Pelajar/Mahasiswa","Petani/Nelayan","Freelance","Tidak Bekerja","Pensiunan"].map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <Label>Jenis Pelayanan yang Anda akses *</Label>
                    <Input name="jenis_pelayanan" required onChange={handleChange} placeholder="Contoh: SIMAKSI, Informasi Kawasan, IUPJWA, dll." />
                  </div>

                  <div>
                    <Label>Tanggal menerima produk pelayanan *</Label>
                    <Input type="date" name="tanggal_pelayanan" required onChange={handleChange} />
                  </div>

                  <div>
                    <Label>Jam menerima produk pelayanan *</Label>
                    <select name="jam_pelayanan" required onChange={handleChange} className="w-full border rounded-md p-2">
                      <option value="">Pilih</option>
                      <option value="08.00 – 12.00">08.00 – 12.00</option>
                      <option value="13.00 – 17.00">13.00 – 17.00</option>
                      <option value=">17.00">Lebih dari 17.00</option>
                    </select>
                  </div>
                </div>
              </div>

                {/* SECTION II */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Send className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Penilaian Pelayanan</h2>
                  </div>
                {[
                  ["q1", "Kesesuaian persyaratan pelayanan dengan informasi", "Tidak Sesuai", "Kurang Sesuai", "Sesuai", "Sangat Sesuai"],
                  ["q2", "Kemudahan prosedur pelayanan", "Tidak Mudah", "Kurang Mudah", "Mudah", "Sangat Mudah"],
                  ["q3", "Kesesuaian waktu penyelesaian dengan informasi", "Tidak Sesuai", "Kurang Sesuai", "Sesuai", "Sangat Sesuai"],
                  ["q4", "Kesesuaian biaya pelayanan", "Tidak Sesuai", "Kurang Sesuai", "Sesuai", "Sangat Sesuai"],
                  ["q5", "Kesesuaian produk pelayanan", "Tidak Sesuai", "Kurang Sesuai", "Sesuai", "Sangat Sesuai"],
                  ["q6a", "Kecepatan respon sistem pelayanan", "Tidak Cepat", "Kurang Cepat", "Cepat", "Sangat Cepat"],
                  ["q6b", "Kemampuan petugas pelayanan", "Tidak Baik", "Kurang Baik", "Baik", "Sangat Baik"],
                  ["q7a", "Kemudahan fitur aplikasi", "Tidak Mudah", "Kurang Mudah", "Mudah", "Sangat Mudah"],
                  ["q7b", "Perilaku petugas pelayanan", "Tidak Baik", "Kurang Baik", "Baik", "Sangat Baik"],
                  ["q8", "Ketersediaan media pengaduan/saran", "Tidak Baik", "Kurang Baik", "Baik", "Sangat Baik"],
                  ["q9a", "Kualitas isi/konten layanan", "Tidak Baik", "Kurang Baik", "Baik", "Sangat Baik"],
                  ["q9b", "Ketersediaan sarana & prasarana", "Tidak Baik", "Kurang Baik", "Baik", "Sangat Baik"],
                ].map(([key, question, ...options]) => (
                  <div key={key}>
                    <Label className="font-medium">{question} *</Label>
                    <select name={key} required onChange={handleChange} className="w-full border rounded-md p-2 mt-1">
                      <option value="">Pilih jawaban</option>
                      {options.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                ))}

                <div>
                  <Label>Saran / Masukan *</Label>
                  <Textarea name="saran" rows={4} required onChange={handleChange} placeholder="Tuliskan pendapat atau saran anda..." />
                </div>
              </div>

                <div className="pt-8 border-t border-gray-200">
                  <Button 
                    type="submit" 
                    disabled={isPending} 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-6 text-lg rounded-lg shadow-lg"
                  >
                    {isPending ? "Mengirim..." : (<><Send className="w-5 h-5 mr-2" /> Kirim Survei</>)}
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
