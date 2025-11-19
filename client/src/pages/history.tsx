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

  // Check if booking is expired
  const isBookingExpired = (booking: any) => {
    if (booking.status !== "Success") return false;
    if (!booking.expired_at) return false;
    return new Date(booking.expired_at) < new Date();
  };

  const getStatusColor = (booking: any) => {
    // Check if expired first
    if (isBookingExpired(booking)) {
      return "bg-red-100 text-red-700 border-red-200";
    }
    
    const status = booking.status;
    if (!status) return "bg-gray-100 text-gray-700 border-gray-200";
    
    switch (status.toLowerCase()) {
      case "used":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "expired":
        return "bg-red-100 text-red-700 border-red-200";
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "success":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (booking: any) => {
    // Check if expired first
    if (isBookingExpired(booking)) {
      return <XCircle className="w-4 h-4" />;
    }
    
    const status = booking.status;
    if (!status) return <AlertCircle className="w-4 h-4" />;
    
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

  const getStatusText = (booking: any) => {
    // Check if expired first
    if (isBookingExpired(booking)) {
      return "Kadaluarsa";
    }
    
    const status = booking.status;
    if (!status) return "Status Tidak Diketahui";
    
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[300px] bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
          <div className="space-y-4 text-white">
            <div className="flex items-center space-x-2">
              <History className="w-6 h-6" />
              <span className="text-sm font-medium tracking-wider uppercase">Riwayat Transaksi</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Riwayat Pemesanan
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl leading-relaxed">
              Kelola dan pantau semua transaksi pemesanan tiket Anda di Taman Nasional Alas Purwo
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        {/* Filter Card */}
        <Card className="border-0 shadow-xl rounded-2xl bg-white overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Filter className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Filter Riwayat</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1.5 text-emerald-600" />
                  Status Pemesanan
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full h-12 border border-gray-200 bg-white rounded-lg px-4 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                >
                  <option value="all">Semua Status</option>
                  <option value="pending">Menunggu Pembayaran</option>
                  <option value="success">Berhasil Dibayar</option>
                  <option value="used">Selesai</option>
                  <option value="expired">Kadaluarsa</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5 text-emerald-600" />
                  Rentang Waktu
                </label>
                <select
                  value={timeRange}
                  onChange={(e) => handleTimeRangeChange(e.target.value)}
                  className="w-full h-12 border border-gray-200 bg-white rounded-lg px-4 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                >
                  <option value="7">7 Hari Terakhir</option>
                  <option value="30">30 Hari Terakhir</option>
                  <option value="365">Tahun Ini</option>
                  <option value="9999">Semua Waktu</option>
                </select>
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
          <div className="space-y-6">
            {bookings.map((b: any) => (
              <Link key={b.id_booking} href={`/history/${b.id_booking}`} className="block">
                <Card
                  className="group border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden bg-white cursor-pointer"
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row items-stretch">
                      {/* Left Accent Bar */}
                      <div className={`w-full md:w-2 h-2 md:h-auto ${getStatusColor(b).split(' ')[0]}`}></div>

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
                              className={`flex items-center space-x-2 px-3 py-2 rounded-xl border ${getStatusColor(b)} font-semibold text-sm shadow-sm`}
                            >
                              {getStatusIcon(b)}
                              <span>{getStatusText(b)}</span>
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
            <CardContent className="p-12 md:p-16 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <History className="w-12 h-12 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Tidak Ada Riwayat</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                Coba ubah filter status atau periode untuk menampilkan data pemesanan Anda.
              </p>
              <Link href="/booking">
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-lg">
                  Pesan Tiket Sekarang
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {pagination && pagination.total_pages > 1 && (
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                <Button
                  variant="outline"
                  size="default"
                  disabled={page <= 1 || isFetching}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className="w-full md:w-auto rounded-lg border-2 hover:bg-emerald-50 hover:border-emerald-300 disabled:opacity-50 px-6 py-3"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Sebelumnya
                </Button>

                <div className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg">
                  <span className="text-sm text-gray-700">Halaman</span>
                  <span className="text-lg font-bold text-emerald-700">{pagination.page}</span>
                  <span className="text-sm text-gray-700">dari {pagination.total_pages}</span>
                </div>

                <Button
                  variant="outline"
                  size="default"
                  disabled={page >= pagination.total_pages || isFetching}
                  onClick={() => setPage((p) => Math.min(p + 1, pagination.total_pages))}
                  className="w-full md:w-auto rounded-lg border-2 hover:bg-emerald-50 hover:border-emerald-300 disabled:opacity-50 px-6 py-3"
                >
                  Berikutnya
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Rencanakan Kunjungan Berikutnya
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Jelajahi keindahan alam Taman Nasional Alas Purwo dan buat kenangan tak terlupakan
          </p>
          <Link href="/destinations">
            <Button
              size="lg"
              className="bg-white text-emerald-600 hover:bg-gray-100 font-semibold px-8 py-6 text-lg rounded-full shadow-xl"
            >
              Jelajahi Destinasi
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}