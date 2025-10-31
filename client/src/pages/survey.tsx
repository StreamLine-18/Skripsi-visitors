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
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="relative h-[280px] md:h-[360px] overflow-hidden rounded-2xl">
        <img
          src="/assets/hero.png"
          alt="Survei Kepuasan Masyarakat"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white p-4">
          <BarChart3 className="w-12 h-12 mb-4 text-white" />
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Survei Kepuasan Masyarakat</h1>
          <p className="text-lg opacity-90 max-w-2xl">
            Kami menghargai waktu Anda untuk membantu meningkatkan pelayanan Taman Nasional Alas Purwo.
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardContent className="p-6 space-y-6">
          {isSuccess ? (
            <div className="text-center py-10">
              <p className="text-green-600 font-semibold text-lg">✅ Terima kasih telah mengisi survei!</p>
              <p className="text-gray-600 text-sm mt-2">
                Jawaban Anda akan membantu kami dalam meningkatkan mutu pelayanan publik.
              </p>
              <Link href="/">
                <Button className="mt-6" variant="outline">← Kembali ke Beranda</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* SECTION I */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">I. Informasi Responden</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Tanggal Survei *</Label>
                    <Input type="date" name="tanggal_survei" required onChange={handleChange} />
                  </div>

                  <div>
                    <Label>Jam Survei *</Label>
                    <select name="jam_survei" required onChange={handleChange} className="w-full border rounded-md p-2">
                      <option value="">Pilih jam</option>
                      <option value="08.00 - 12.00">08.00 - 12.00</option>
                      <option value="13.00 - 17.00">13.00 - 17.00</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <Label>Dimana anda mengakses unit pelayanan Anda? *</Label>
                    <Input name="lokasi_pelayanan" required onChange={handleChange} placeholder="Contoh: Kantor TNAP, website, aplikasi..." />
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
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">II. Pendapat Responden tentang Pelayanan</h2>
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

              <Button type="submit" disabled={isPending} size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white">
                {isPending ? "Mengirim..." : (<><Send className="w-5 h-5 mr-2" /> Kirim Survei</>)}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
