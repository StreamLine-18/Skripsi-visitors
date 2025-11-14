import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Upload, Send } from "lucide-react";
import { Link } from "wouter";

const MAX_FILES = 10;
const MAX_SIZE = 100 * 1024 * 1024; // 100 MB

export default function WBSPage() {
  const [form, setForm] = useState({
    email: "",
    phone: "",
    gender: "",
    apa: "",
    dimana: "",
    kapan: "",
    siapa: "",
    bagaimana: "",
    bukti: "",
    deskripsi: "",
    priority: "",
  });

  const [files, setFiles] = useState<File[]>([]);
  const [fileErr, setFileErr] = useState<string>("");

  const prettyMax = useMemo(() => "100 MB", []);

  const { mutate, isPending, isSuccess, error } = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      files.forEach((f) => fd.append("attachments", f));

      const base = import.meta.env.VITE_API_BASE_URL || "";
      const res = await fetch(`${base}/wbs`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error("Gagal mengirim WBS");
      return res.json();
    },
  });

  const onChange =
    (name: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((s) => ({ ...s, [name]: e.target.value }));

  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileErr("");
    const list = e.target.files ? Array.from(e.target.files) : [];
    // merge with existing (keep newest last)
    const merged = [...files, ...list];

    if (merged.length > MAX_FILES) {
      setFileErr(`Maksimal ${MAX_FILES} file.`);
      return;
    }

    // size validation
    for (const f of merged) {
      if (f.size > MAX_SIZE) {
        setFileErr(`Ukuran file "${f.name}" melebihi ${prettyMax}.`);
        return;
      }
    }

    setFiles(merged);
  };

  const removeFile = (idx: number) => {
    setFiles((arr) => arr.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fileErr) return;
    mutate();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[400px] bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 overflow-hidden">
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
              <AlertTriangle className="w-6 h-6" />
              <span className="text-sm font-medium tracking-wider uppercase">Whistleblowing System</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Sistem Pelaporan<br />Pelanggaran (WBS)
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl leading-relaxed">
              Laporkan dugaan pelanggaran atau penyimpangan secara aman dan terpercaya. Kerahasiaan identitas Anda dijamin penuh
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
                  <AlertTriangle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Laporan Terkirim!</h2>
                <p className="text-gray-600 text-lg mb-2">
                  Laporan WBS Anda telah berhasil dikirim
                </p>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  Tim kami akan meninjau laporan Anda dengan serius. Terima kasih atas keberanian Anda
                </p>
                <Link href="/">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700 px-8">
                    Kembali ke Beranda
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10"> 
                {/* Contact Information */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Informasi Pelapor</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email">Alamat email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={onChange("email")}
                    placeholder="email@domain.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">No. telp/ WA *</Label>
                  <Input
                    id="phone"
                    required
                    value={form.phone}
                    onChange={onChange("phone")}
                    placeholder="0812xxxxxxx"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    No. Telp/ Nomor Whatsapp yg dapat dihubungi
                  </p>
                </div>
                <div>
                  <Label htmlFor="gender">Jenis Kelamin *</Label>
                  <select
                    id="gender"
                    required
                    value={form.gender}
                    onChange={onChange("gender")}
                    className="w-full rounded-md border border-gray-300 p-2"
                  >
                    <option value="">Pilih</option>
                    <option value="Laki - laki">Laki - laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="priority">Prioritas *</Label>
                  <select
                    id="priority"
                    required
                    value={form.priority}
                    onChange={onChange("priority")}
                    className="w-full rounded-md border border-gray-300 p-2"
                  >
                    <option value="">Pilih prioritas</option>
                    <option value="5">Sangat tinggi</option>
                    <option value="4">4</option>
                    <option value="3">3</option>
                    <option value="2">2</option>
                    <option value="1">Sangat rendah</option>
                  </select>
                </div>
              </div>
                </div>

                {/* Report Details */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Send className="w-5 h-5 text-orange-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Detail Laporan</h2>
                  </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="apa">1. Apa *</Label>
                    <Input id="apa" required value={form.apa} onChange={onChange("apa")} placeholder="Apa dugaan pelanggarannya?" />
                  </div>
                  <div>
                    <Label htmlFor="dimana">2. Dimana *</Label>
                    <Input id="dimana" required value={form.dimana} onChange={onChange("dimana")} placeholder="Lokasi kejadian" />
                  </div>
                  <div>
                    <Label htmlFor="kapan">3. Kapan *</Label>
                    <Input id="kapan" required value={form.kapan} onChange={onChange("kapan")} placeholder="Tanggal/Jam peristiwa" />
                  </div>
                  <div>
                    <Label htmlFor="siapa">4. Siapa *</Label>
                    <Input id="siapa" required value={form.siapa} onChange={onChange("siapa")} placeholder="Pihak yang terlibat (jika diketahui)" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bagaimana">5. Bagaimana *</Label>
                  <Textarea
                    id="bagaimana"
                    required
                    rows={3}
                    value={form.bagaimana}
                    onChange={onChange("bagaimana")}
                    placeholder="Kronologi kejadian secara ringkas"
                  />
                </div>

                <div>
                  <Label htmlFor="bukti">6. Bukti</Label>
                  <Textarea
                    id="bukti"
                    rows={3}
                    value={form.bukti}
                    onChange={onChange("bukti")}
                    placeholder="Tautan/identifikasi bukti pendukung (opsional, selain file upload)"
                  />
                </div>

                <div>
                  <Label htmlFor="deskripsi">Deskripsi</Label>
                  <Textarea
                    id="deskripsi"
                    rows={4}
                    value={form.deskripsi}
                    onChange={onChange("deskripsi")}
                    placeholder="Detail tambahan yang perlu diketahui"
                  />
                </div>
              </div>

              {/* Upload Lampiran */}
              <div className="space-y-2">
                <Label>File Pendukung</Label>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 cursor-pointer hover:bg-gray-50">
                    <Upload className="w-4 h-4" />
                    <span>Pilih File</span>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={onFiles}
                    />
                  </label>
                  <span className="text-sm text-gray-500">
                    Upload hingga {MAX_FILES} file. Maks {prettyMax} per file.
                  </span>
                </div>

                {!!fileErr && <p className="text-sm text-red-600">{fileErr}</p>}

                {files.length > 0 && (
                  <ul className="mt-2 space-y-2">
                    {files.map((f, i) => (
                      <li key={i} className="flex items-center justify-between rounded-md border p-2 text-sm">
                        <span className="truncate max-w-[70%]">{f.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500">{(f.size / (1024 * 1024)).toFixed(1)} MB</span>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(i)}>
                            Hapus
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Error submit */}
              {error && (
                <p className="text-sm text-red-600">
                  {error instanceof Error ? error.message : "Terjadi kesalahan."}
                </p>
              )}

                <div className="pt-8 border-t border-gray-200">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isPending || !!fileErr}
                    className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-6 text-lg rounded-lg shadow-lg"
                  >
                    {isPending ? "Mengirim..." : (<><Send className="w-5 h-5 mr-2" /> Kirim Laporan WBS</>)}
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
