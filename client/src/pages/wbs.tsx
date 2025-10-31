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
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* Hero */}
      <div className="relative h-[260px] md:h-[320px] overflow-hidden rounded-2xl">
        <img
          src="/assets/hero.png"
          alt="Whistleblowing System"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white p-4">
          <AlertTriangle className="w-12 h-12 mb-3 text-white" />
          <h1 className="text-3xl md:text-4xl font-bold">Whistleblowing System (WBS)</h1>
          <p className="opacity-90 max-w-2xl">
            Laporkan dugaan pelanggaran secara aman. Kerahasiaan identitas Anda dilindungi.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          {isSuccess ? (
            <div className="text-center py-10">
              <p className="text-green-600 font-semibold text-lg">✅ Laporan WBS terkirim!</p>
              <p className="text-gray-600 text-sm mt-2">
                Tim kami akan meninjau laporan Anda. Terima kasih atas keberanian dan kontribusi Anda.
              </p>
              <Link href="/">
                <Button className="mt-6" variant="outline">← Kembali ke Beranda</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Kontak & Gender */}
              <div className="grid md:grid-cols-2 gap-4">
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

              {/* Unsur Pengaduan (6W) */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">Unsur Pengaduan</h2>

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

              <Button
                type="submit"
                size="lg"
                disabled={isPending || !!fileErr}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {isPending ? "Mengirim..." : (<><Send className="w-5 h-5 mr-2" /> Kirim Laporan WBS</>)}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
