import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History as HistoryIcon, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { bookingApi } from "@/lib/api";

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
        return "bg-green-100 text-green-700";
      case "expired":
        return "bg-gray-100 text-gray-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "success":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "used":
        return "Selesai";
      case "expired":
        return "Kadaluarsa";
      case "success":
        return "Sudah Dibayar";
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
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Tidak Dapat Memuat Data
            </h3>
            <p className="text-gray-600 mb-4">
              {error instanceof Error ? error.message : "Terjadi kesalahan saat memuat riwayat"}
            </p>
            {!token && (
              <Button onClick={() => (window.location.href = "/login")}>
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
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // === Main UI ===
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center space-x-3 mb-2">
            <HistoryIcon className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Riwayat Pemesanan</h2>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">Semua</option>
                <option value="pending">Menunggu Pembayaran</option>
                <option value="success">Berhasil</option>
                <option value="used">Selesai</option>
                <option value="expired">Kadaluarsa</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">Periode</label>
              <select
                value={timeRange}
                onChange={(e) => handleTimeRangeChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="7">7 Hari Terakhir</option>
                <option value="30">30 Hari Terakhir</option>
                <option value="365">Tahun Ini</option>
                <option value="9999">Semua</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking List */}
      {bookings.length > 0 ? (
        <Card>
          <CardContent className="p-6 space-y-4">
            {isFetching && (
              <div className="text-center py-2 text-sm text-gray-500">Memuat data...</div>
            )}
            {bookings.map((b: any) => (
              <div
                key={b.id_booking}
                className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all"
              >
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-gray-900">
                    Pemesan: {b.leader_name || "Tanpa Nama"}
                  </p>
                  <p className="text-xs text-gray-500">No. HP: {b.leader_phone || "-"}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {formatDate(b.created_on)}
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                      b.status
                    )}`}
                  >
                    {getStatusText(b.status)}
                  </span>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    Rp {Number(b.total_amount).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <HistoryIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak Ada Riwayat</h3>
            <p className="text-gray-600">Coba ubah filter status atau periode untuk menampilkan data.</p>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || isFetching}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Sebelumnya
          </Button>
          <span className="text-sm text-gray-600">
            Halaman <strong>{pagination.page}</strong> dari {pagination.total_pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= pagination.total_pages || isFetching}
            onClick={() => setPage((p) => Math.min(p + 1, pagination.total_pages))}
          >
            Berikutnya
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
