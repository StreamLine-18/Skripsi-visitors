import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ChevronLeft, ChevronRight, Filter, Calendar, Receipt, CheckCircle2, XCircle, AlertCircle, History } from "lucide-react";
import { bookingApi } from "@/lib/api";
import { Link } from "wouter";

export default function HistoryPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeRange, setTimeRange] = useState("30");
  const [page, setPage] = useState(1);

  // Safe localStorage access
  const token = typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";

  // Capitalize for backend
  const getBackendStatus = (status: string) =>
    status === "all" ? undefined : status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["bookings-history", page, token, statusFilter, timeRange],
    queryFn: async () => {
      if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

      const options = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const params = {
        page,
        status: getBackendStatus(statusFilter),
        range: timeRange !== "9999" ? timeRange : undefined,
      };
      const res = await bookingApi.getAllBookings(params, options);

      // Pastikan return formatnya konsisten
      if (!res || !res.data) throw new Error("Response API tidak valid");
      return res;
    },
    placeholderData: keepPreviousData,
    retry: false,
  });

  const bookings = data?.data ?? [];
  const pagination = data?.pagination ?? null;

  // === Helpers ===
  const formatDate = (date: string | null) => {
    if (!date) return "Tanggal belum ditentukan";
    const d = new Date(date);
    return d.toLocaleString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "used":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "expired":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "success":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "used":
        return <CheckCircle2 className="w-4 h-4" />;
      case "expired":
        return <XCircle className="w-4 h-4" />;
      case "success":
        return <CheckCircle2 className="w-4 h-4" />;
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "used":
        return "Telah Digunakan";
      case "expired":
        return "Kadaluarsa";
      case "success":
        return "Berhasil Dibayar";
      case "pending":
        return "Menunggu Pembayaran";
      default:
        return status;
    }
  };


  // === Filter Handlers ===
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    setPage(1);
  };

  // === Error State ===
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/30 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-0 shadow-xl rounded-2xl">
          <CardContent className="p-10 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Tidak Dapat Memuat Data
            </h3>
            <p className="text-gray-600 mb-6">
              {error instanceof Error ? error.message : "Terjadi kesalahan saat memuat riwayat"}
            </p>
            {!token && (
              <Button
                onClick={() => (window.location.href = "/login")}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-full px-8 shadow-lg"
              >
                Login Sekarang
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // === Loading Skeleton ===
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-6">
          <div className="animate-pulse space-y-6">
            <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl h-40"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl h-28"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // === Main UI ===
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-6">
        {/* Header Card */}
        <Card className="border-0 shadow-lg rounded-2xl bg-white overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <History className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Riwayat Pemesanan</h1>
                <p className="text-gray-600 text-sm md:text-base">Kelola dan pantau semua transaksi Anda</p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 md:p-6 space-y-4">
              <div className="flex items-center space-x-2 text-emerald-700 mb-3">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-semibold">Filter Data</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1.5 text-emerald-600" />
                    Status Pemesanan
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full border-2 border-emerald-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm hover:border-emerald-300"
                  >
                    <option value="all">Semua Status</option>
                    <option value="pending">Menunggu Pembayaran</option>
                    <option value="success">Berhasil Dibayar</option>
                    <option value="used">Selesai</option>
                    <option value="expired">Kadaluarsa</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2 flex items-center">
                    <Calendar className="w-4 h-4 mr-1.5 text-emerald-600" />
                    Rentang Waktu
                  </label>
                  <select
                    value={timeRange}
                    onChange={(e) => handleTimeRangeChange(e.target.value)}
                    className="w-full border-2 border-emerald-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm hover:border-emerald-300"
                  >
                    <option value="7">7 Hari Terakhir</option>
                    <option value="30">30 Hari Terakhir</option>
                    <option value="365">Tahun Ini</option>
                    <option value="9999">Semua Waktu</option>
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading Indicator */}
        {isFetching && (
          <div className="text-center py-3">
            <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
              <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-gray-600">Memuat data...</span>
            </div>
          </div>
        )}

        {/* Booking List */}
        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((b: any) => (
              <Link key={b.id_booking} href={`/history/${b.id_booking}`} className="block">
                <Card
                  className="group border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden bg-white cursor-pointer"
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row items-stretch">
                      {/* Left Accent Bar */}
                      <div className={`w-full md:w-2 h-2 md:h-auto ${getStatusColor(b.status).split(' ')[0]}`}></div>

                      {/* Content */}
                      <div className="flex-1 p-5 md:p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                          {/* Left Info */}
                          <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Receipt className="w-5 h-5 text-emerald-600" />
                              </div>
                              <div>
                                <p className="text-base md:text-lg font-bold text-gray-900">
                                  {b.leader_name || "Tanpa Nama"}
                                </p>
                                <p className="text-sm text-gray-500">
                                  No. HP: {b.leader_phone || "-"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 text-sm text-gray-500 pl-13">
                              <Clock className="w-4 h-4" />
                              <span>{formatDate(b.created_on)}</span>
                            </div>
                          </div>

                          {/* Right Info */}
                          <div className="flex flex-row md:flex-col items-start md:items-end space-x-4 md:space-x-0 md:space-y-3">
                            <div
                              className={`flex items-center space-x-2 px-3 py-2 rounded-xl border ${getStatusColor(b.status)} font-semibold text-sm shadow-sm`}
                            >
                              {getStatusIcon(b.status)}
                              <span>{getStatusText(b.status)}</span>
                            </div>

                            <div className="text-right">
                              <p className="text-xs text-gray-500 mb-1">Total Pembayaran</p>
                              <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                Rp {Number(b.total_amount).toLocaleString("id-ID")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-12 md:p-16 text-center bg-gradient-to-br from-gray-50 to-emerald-50/30">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-emerald-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <History className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Tidak Ada Riwayat</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Coba ubah filter status atau periode untuk menampilkan data pemesanan Anda.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {pagination && pagination.total_pages > 1 && (
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                <Button
                  variant="outline"
                  size="default"
                  disabled={page <= 1 || isFetching}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className="w-full md:w-auto rounded-xl border-2 hover:bg-emerald-50 hover:border-emerald-300 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Sebelumnya
                </Button>

                <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl">
                  <span className="text-sm text-gray-700">Halaman</span>
                  <span className="text-lg font-bold text-emerald-700">{pagination.page}</span>
                  <span className="text-sm text-gray-700">dari {pagination.total_pages}</span>
                </div>

                <Button
                  variant="outline"
                  size="default"
                  disabled={page >= pagination.total_pages || isFetching}
                  onClick={() => setPage((p) => Math.min(p + 1, pagination.total_pages))}
                  className="w-full md:w-auto rounded-xl border-2 hover:bg-emerald-50 hover:border-emerald-300 disabled:opacity-50"
                >
                  Berikutnya
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}