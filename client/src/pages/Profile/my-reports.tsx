import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  FileText,
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  User,
  Phone,
  Mail,
} from "lucide-react";
import { complaintApi } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { formatDateNoWeekday as formatDate } from "@/lib/date-utils";

export default function MyReportsPage() {
  const { token, user, isLoadingUser } = useAuth();

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["my-reports", user?.id_user],
    queryFn: async () => {
      const res = await complaintApi.getMyReports({}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token && !isLoadingUser && !!user,
  });


  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Baru":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          text: "text-blue-700",
          icon: <Clock className="w-4 h-4" />,
          label: "Baru",
        };
      case "Diproses":
        return {
          bg: "bg-amber-50",
          border: "border-amber-200",
          text: "text-amber-700",
          icon: <AlertCircle className="w-4 h-4" />,
          label: "Diproses",
        };
      case "Selesai":
        return {
          bg: "bg-emerald-50",
          border: "border-emerald-200",
          text: "text-emerald-700",
          icon: <CheckCircle2 className="w-4 h-4" />,
          label: "Selesai",
        };
      case "Ditolak":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-700",
          icon: <XCircle className="w-4 h-4" />,
          label: "Ditolak",
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-700",
          icon: <Clock className="w-4 h-4" />,
          label: status,
        };
    }
  };

  if (isLoading || isLoadingUser || isFetching) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-2xl h-48"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[300px] bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>

        <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
          <Link href="/profile">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 mb-6 -ml-2 rounded-lg w-fit"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Profil
            </Button>
          </Link>

          <div className="space-y-4 text-white">
            <div className="flex items-center space-x-2">
              <FileText className="w-6 h-6" />
              <span className="text-sm font-medium tracking-wider uppercase">Laporan Saya</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Riwayat Pengaduan
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl leading-relaxed">
              Pantau status dan perkembangan pengaduan yang telah Anda kirimkan
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {data && data.length > 0 ? (
          <div className="space-y-6">
            {data.map((report: any) => {
              const statusConfig = getStatusConfig(report.complaint_status);

              return (
                <Card key={report.id_pelaporan} className="border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
                  <CardContent className="p-0">
                    {/* Header */}
                    <div className={`${statusConfig.bg} ${statusConfig.border} border-b-2 px-6 py-4`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 bg-white rounded-lg shadow-sm ${statusConfig.text}`}>
                            {statusConfig.icon}
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-medium">ID Laporan</p>
                            <p className="font-mono text-sm font-semibold text-gray-900">
                              {report.id_pelaporan.substring(0, 18)}...
                            </p>
                          </div>
                        </div>
                        <div className={`px-4 py-2 ${statusConfig.bg} ${statusConfig.border} border rounded-full`}>
                          <span className={`text-sm font-bold ${statusConfig.text}`}>
                            {statusConfig.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <User className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500 font-semibold">Nama Pelapor</p>
                              <p className="text-gray-900 font-medium">{report.full_name}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500 font-semibold">Email</p>
                              <p className="text-gray-900">{report.email}</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500 font-semibold">No. Telepon</p>
                              <p className="text-gray-900">{report.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500 font-semibold">Tanggal Laporan</p>
                              <p className="text-gray-900">{formatDate(report.created_on)}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-2">Jenis Pengaduan</p>
                          <div className="flex flex-wrap gap-2">
                            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium">
                              {report.complaint_type}
                            </span>
                            <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${report.priority === 'SangatTinggi' ? 'bg-red-100 text-red-700' :
                              report.priority === 'Tinggi' ? 'bg-orange-100 text-orange-700' :
                                report.priority === 'Sedang' ? 'bg-yellow-100 text-yellow-700' :
                                  report.priority === 'Rendah' ? 'bg-blue-100 text-blue-700' :
                                    'bg-gray-100 text-gray-700'
                              }`}>
                              {report.priority === 'SangatTinggi' ? 'Sangat Tinggi' :
                                report.priority === 'SangatRendah' ? 'Sangat Rendah' :
                                  report.priority}
                            </span>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-2">Deskripsi</p>
                          <p className="text-gray-700 leading-relaxed">{report.description}</p>
                        </div>

                        {report.response && (
                          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                            <p className="text-sm font-semibold text-emerald-700 mb-2">Tanggapan</p>
                            <p className="text-gray-700 leading-relaxed">{report.response}</p>
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-emerald-200">
                              {report.responded_by && (
                                <p className="text-xs text-gray-600">
                                  <span className="font-semibold">Ditanggapi oleh:</span> {report.responded_by}
                                </p>
                              )}
                              {report.responded_at && (
                                <p className="text-xs text-gray-500">
                                  {formatDate(report.responded_at)}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-16 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full mb-6">
                <FileText className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Belum Ada Laporan</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Anda belum pernah mengirimkan pengaduan. Sampaikan keluhan atau saran Anda untuk membantu kami meningkatkan layanan.
              </p>
              <Link href="/complaint">
                <Button size="lg" className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-8 py-6 text-lg rounded-full shadow-xl">
                  <FileText className="w-5 h-5 mr-2" />
                  Buat Pengaduan
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
