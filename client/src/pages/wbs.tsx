import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Upload, Send } from "lucide-react";
import { Link } from "wouter";
import { wbsApi } from "@/lib/api";

const MAX_FILES = 10;
const MAX_SIZE = 100 * 1024 * 1024; // 100 MB

export default function WBSPage() {
  const [form, setForm] = useState({
    email: "",
    phone: "",
    gender: "",
    what: "",
    where: "",
    when: "",
    who: "",
    how: "",
    evidence: "",
    description: "",
    priority: "",
  });

  const [files, setFiles] = useState<File[]>([]);
  const [fileErr, setFileErr] = useState<string>("");

  const prettyMax = useMemo(() => "100 MB", []);

  const { mutate, isPending, isSuccess, error } = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      files.forEach((f) => fd.append("files", f));

      return wbsApi.submitReport(fd);
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
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Alamat Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={onChange("email")}
                        placeholder="email@domain.com"
                        className="h-12 border-gray-200 focus:border-red-500 focus:ring-red-500 rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">No. Telp / WA *</Label>
                      <Input
                        id="phone"
                        required
                        value={form.phone}
                        onChange={onChange("phone")}
                        placeholder="0812xxxxxxx"
                        className="h-12 border-gray-200 focus:border-red-500 focus:ring-red-500 rounded-lg"
                      />
                      <p className="text-xs text-gray-500">
                        Nomor yang dapat dihubungi untuk tindak lanjut
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender" className="text-sm font-semibold text-gray-700">Jenis Kelamin *</Label>
                      <select
                        id="gender"
                        required
                        value={form.gender}
                        onChange={onChange("gender")}
                        className="w-full h-12 border border-gray-200 rounded-lg px-3 focus:border-red-500 focus:ring-red-500"
                      >
                        <option value="">Pilih</option>
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority" className="text-sm font-semibold text-gray-700">Prioritas *</Label>
                      <select
                        id="priority"
                        required
                        value={form.priority}
                        onChange={onChange("priority")}
                        className="w-full h-12 border border-gray-200 rounded-lg px-3 focus:border-red-500 focus:ring-red-500"
                      >
                        <option value="">Pilih prioritas</option>
                        <option value="SangatTinggi">Sangat Tinggi</option>
                        <option value="Tinggi">Tinggi</option>
                        <option value="Sedang">Sedang</option>
                        <option value="Rendah">Rendah</option>
                        <option value="SangatRendah">Sangat Rendah</option>
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

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="what" className="text-sm font-semibold text-gray-700">1. Apa yang terjadi? *</Label>
                      <Input 
                        id="what" 
                        required 
                        value={form.what} 
                        onChange={onChange("what")} 
                        placeholder="Apa dugaan pelanggarannya?"
                        className="h-12 border-gray-200 focus:border-red-500 focus:ring-red-500 rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="where" className="text-sm font-semibold text-gray-700">2. Dimana kejadian? *</Label>
                      <Input 
                        id="where" 
                        required 
                        value={form.where} 
                        onChange={onChange("where")} 
                        placeholder="Lokasi kejadian"
                        className="h-12 border-gray-200 focus:border-red-500 focus:ring-red-500 rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="when" className="text-sm font-semibold text-gray-700">3. Kapan kejadian? *</Label>
                      <Input 
                        id="when" 
                        required 
                        value={form.when} 
                        onChange={onChange("when")} 
                        placeholder="Tanggal/Jam peristiwa"
                        className="h-12 border-gray-200 focus:border-red-500 focus:ring-red-500 rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="who" className="text-sm font-semibold text-gray-700">4. Siapa yang terlibat? *</Label>
                      <Input 
                        id="who" 
                        required 
                        value={form.who} 
                        onChange={onChange("who")} 
                        placeholder="Pihak yang terlibat (jika diketahui)"
                        className="h-12 border-gray-200 focus:border-red-500 focus:ring-red-500 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="how" className="text-sm font-semibold text-gray-700">5. Bagaimana kejadian? *</Label>
                    <Textarea
                      id="how"
                      required
                      rows={4}
                      value={form.how}
                      onChange={onChange("how")}
                      placeholder="Kronologi kejadian secara ringkas"
                      className="border-gray-200 focus:border-red-500 focus:ring-red-500 rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="evidence" className="text-sm font-semibold text-gray-700">6. Bukti yang ada *</Label>
                    <Textarea
                      id="evidence"
                      required
                      rows={3}
                      value={form.evidence}
                      onChange={onChange("evidence")}
                      placeholder="Jelaskan bukti yang Anda miliki (dokumen, foto, rekaman, dll)"
                      className="border-gray-200 focus:border-red-500 focus:ring-red-500 rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Deskripsi Tambahan</Label>
                    <Textarea
                      id="description"
                      rows={4}
                      value={form.description}
                      onChange={onChange("description")}
                      placeholder="Detail tambahan yang perlu diketahui (opsional)"
                      className="border-gray-200 focus:border-red-500 focus:ring-red-500 rounded-lg"
                    />
                  </div>
              </div>

                {/* Upload Lampiran */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Upload className="w-5 h-5 text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">File Pendukung</h2>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">Upload Bukti (Opsional)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
                      <label className="cursor-pointer">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <Upload className="w-6 h-6 text-red-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Klik untuk upload atau drag & drop
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              JPG, PNG, WEBP, PDF, DOC, DOCX (Maks {prettyMax} per file)
                            </p>
                            <p className="text-xs text-gray-500">
                              Maksimal {MAX_FILES} file
                            </p>
                          </div>
                        </div>
                        <input
                          type="file"
                          multiple
                          accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx"
                          className="hidden"
                          onChange={onFiles}
                        />
                      </label>
                    </div>

                    {!!fileErr && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{fileErr}</p>
                      </div>
                    )}

                    {files.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-gray-700">File yang dipilih ({files.length}):</p>
                        <ul className="space-y-2">
                          {files.map((f, i) => (
                            <li key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
                                  <Upload className="w-4 h-4 text-red-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-gray-900 truncate">{f.name}</p>
                                  <p className="text-xs text-gray-500">{(f.size / (1024 * 1024)).toFixed(2)} MB</p>
                                </div>
                              </div>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeFile(i)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                              >
                                Hapus
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
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
