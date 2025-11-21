import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BarChart3, Send } from "lucide-react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { surveyApi } from "@/lib/api";

export default function SurveyPage() {
  const [form, setForm] = useState({
    survey_date: new Date().toISOString().split('T')[0],
    survey_time: "",
    access_location: "",
    is_disabled: "false",
    disability_type: "",
    gender: "",
    age: "",
    education: "",
    occupation: "",
    service_type: "",
    service_received_date: "",
    service_received_time: "",
    q1_requirement_match: "",
    q2_procedure_ease: "",
    q3_time_match: "",
    q4_cost_match: "",
    q5_product_match: "",
    q6a_app_speed: "",
    q6b_staff_competence: "",
    q7a_app_ease: "",
    q7b_staff_behavior: "",
    q8_complaint_channel: "",
    q9a_app_content: "",
    q9b_facilities: "",
    q10_feedback: "",
  });

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        age: parseInt(form.age),
        is_disabled: form.is_disabled === "true",
        q1_requirement_match: parseInt(form.q1_requirement_match),
        q2_procedure_ease: parseInt(form.q2_procedure_ease),
        q3_time_match: parseInt(form.q3_time_match),
        q4_cost_match: parseInt(form.q4_cost_match),
        q5_product_match: parseInt(form.q5_product_match),
        q6a_app_speed: parseInt(form.q6a_app_speed),
        q6b_staff_competence: parseInt(form.q6b_staff_competence),
        q7a_app_ease: parseInt(form.q7a_app_ease),
        q7b_staff_behavior: parseInt(form.q7b_staff_behavior),
        q8_complaint_channel: parseInt(form.q8_complaint_channel),
        q9a_app_content: parseInt(form.q9a_app_content),
        q9b_facilities: parseInt(form.q9b_facilities),
      };
      
      return surveyApi.submitSurvey(payload);
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
                        name="survey_date" 
                        value={form.survey_date}
                        required 
                        onChange={handleChange}
                        className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Waktu Pelayanan Anda *</Label>
                      <select 
                        name="survey_time" 
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
                      <Label className="text-sm font-semibold text-gray-700">Dimana anda mengakses unit pelayanan? *</Label>
                      <Input 
                        name="access_location" 
                        required 
                        onChange={handleChange} 
                        placeholder="Contoh: Kantor TNAP, website, aplikasi..."
                        className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Apakah Anda penyandang disabilitas? *</Label>
                      <select name="is_disabled" required onChange={handleChange} className="w-full h-12 border border-gray-200 rounded-lg px-3 focus:border-emerald-500 focus:ring-emerald-500">
                        <option value="">Pilih</option>
                        <option value="false">Tidak</option>
                        <option value="true">Ya</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Jenis disabilitas (jika ada)</Label>
                      <Input 
                        name="disability_type" 
                        onChange={handleChange} 
                        placeholder="Tuna netra, rungu, daksa, dll."
                        className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Jenis Kelamin *</Label>
                      <select name="gender" required onChange={handleChange} className="w-full h-12 border border-gray-200 rounded-lg px-3 focus:border-emerald-500 focus:ring-emerald-500">
                        <option value="">Pilih</option>
                        <option value="L">Laki-laki</option>
                        <option value="P">Perempuan</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Usia *</Label>
                      <Input 
                        type="number" 
                        name="age" 
                        required 
                        onChange={handleChange} 
                        placeholder="Contoh: 25"
                        className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Pendidikan Terakhir *</Label>
                      <select name="education" required onChange={handleChange} className="w-full h-12 border border-gray-200 rounded-lg px-3 focus:border-emerald-500 focus:ring-emerald-500">
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

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Pekerjaan *</Label>
                      <select name="occupation" required onChange={handleChange} className="w-full h-12 border border-gray-200 rounded-lg px-3 focus:border-emerald-500 focus:ring-emerald-500">
                        <option value="">Pilih</option>
                        {["PNS","TNI","POLRI","Swasta","Wiraswasta","IRT","Pelajar/Mahasiswa","Petani/Nelayan","Freelance","Tidak Bekerja","Pensiunan"].map((v) => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Jenis Pelayanan yang Anda akses *</Label>
                      <Input 
                        name="service_type" 
                        required 
                        onChange={handleChange} 
                        placeholder="Contoh: SIMAKSI, Informasi Kawasan, IUPJWA, dll."
                        className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Tanggal menerima produk pelayanan *</Label>
                      <Input 
                        type="date" 
                        name="service_received_date" 
                        required 
                        onChange={handleChange}
                        className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Jam menerima produk pelayanan *</Label>
                      <select name="service_received_time" required onChange={handleChange} className="w-full h-12 border border-gray-200 rounded-lg px-3 focus:border-emerald-500 focus:ring-emerald-500">
                        <option value="">Pilih</option>
                        <option value="08.00 – 12.00">08.00 – 12.00</option>
                        <option value="13.00 – 17.00">13.00 – 17.00</option>
                        <option value="Lebih dari 17.00">Lebih dari 17.00</option>
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
                  <div className="grid gap-6">
                    {[
                      ["q1_requirement_match", "Kesesuaian persyaratan pelayanan dengan informasi"],
                      ["q2_procedure_ease", "Kemudahan prosedur pelayanan"],
                      ["q3_time_match", "Kesesuaian waktu penyelesaian dengan informasi"],
                      ["q4_cost_match", "Kesesuaian biaya pelayanan"],
                      ["q5_product_match", "Kesesuaian produk pelayanan"],
                      ["q6a_app_speed", "Kecepatan respon sistem/aplikasi pelayanan"],
                      ["q6b_staff_competence", "Kemampuan/kompetensi petugas pelayanan"],
                      ["q7a_app_ease", "Kemudahan penggunaan fitur aplikasi"],
                      ["q7b_staff_behavior", "Perilaku/sikap petugas pelayanan"],
                      ["q8_complaint_channel", "Ketersediaan media pengaduan/saran"],
                      ["q9a_app_content", "Kualitas isi/konten layanan"],
                      ["q9b_facilities", "Ketersediaan sarana & prasarana"],
                    ].map(([key, question]) => (
                      <div key={key} className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">{question} *</Label>
                        <select 
                          name={key} 
                          required 
                          onChange={handleChange} 
                          className="w-full h-12 border border-gray-200 rounded-lg px-3 focus:border-emerald-500 focus:ring-emerald-500"
                        >
                          <option value="">Pilih jawaban</option>
                          <option value="1">1 - Tidak Baik</option>
                          <option value="2">2 - Kurang Baik</option>
                          <option value="3">3 - Baik</option>
                          <option value="4">4 - Sangat Baik</option>
                        </select>
                      </div>
                    ))}

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Saran / Masukan *</Label>
                      <Textarea 
                        name="q10_feedback" 
                        rows={4} 
                        required 
                        onChange={handleChange} 
                        placeholder="Tuliskan pendapat atau saran anda..."
                        className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
                      />
                    </div>
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
