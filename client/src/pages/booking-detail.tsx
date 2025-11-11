import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Clock,
  User,
  Ticket,
  CreditCard,
  XCircle,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  Phone,
  Globe,
  Users,
  CreditCard as IdCard,
} from "lucide-react";
import { bookingApi } from "@/lib/api";
import { useMidtransSnap } from "@/hooks/use-midtrans-snap";

declare global {
  interface Window {
    snap?: {
      pay: (token: string, options: any) => void;
    };
  }
}

export default function BookingDetailPage() {
  const [match, params] = useRoute("/history/:id");
  const [isPaying, setIsPaying] = useState(false);
  const bookingId = params?.id;

  const token = localStorage.getItem("token") ?? "";
  useMidtransSnap(false); // load Snap sandbox

  // === Fetch Booking Detail ===
  const { data, isLoading, isError } = useQuery({
    queryKey: ["booking-detail", bookingId],
    queryFn: async () => {
      const res = await bookingApi.getBookingById(bookingId!, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!bookingId && !!token,
  });

  if (isLoading)
    return <div className="text-center py-20 text-gray-500">Memuat detail...</div>;
  if (isError)
    return (
      <div className="text-center py-20 text-red-500">
        Gagal memuat detail booking.
      </div>
    );

  if (!data)
    return <div className="text-center py-20 text-gray-500">Data booking tidak ditemukan.</div>;

  const booking = data;
  const now = new Date();

  const isPaymentExpired = booking.status === "Expired";
  const isTicketExpired =
    booking.status === "Success" &&
    booking.expired_at &&
    new Date(booking.expired_at) < now;
  const isPaid = booking.status === "Success" && !isTicketExpired;
  const isPending = booking.status === "Pending";

  // === Format Helpers ===
  const formatDate = (dateStr: string | number | Date) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateShort = (dateStr: string | number | Date) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // === Status Style Map ===
  const getStatusConfig = () => {
    if (isPaymentExpired)
      return {
        bg: "bg-gradient-to-br from-red-50 to-red-100",
        border: "border-red-200",
        icon: <XCircle className="w-6 h-6 text-red-600" />,
        text: "Pembayaran Kadaluarsa",
        textColor: "text-red-700",
      };
    if (isTicketExpired)
      return {
        bg: "bg-gradient-to-br from-red-50 to-red-100",
        border: "border-red-300",
        icon: <AlertCircle className="w-6 h-6 text-red-600" />,
        text: "Tiket Kadaluarsa",
        textColor: "text-red-700",
      };
    if (isPaid)
      return {
        bg: "bg-gradient-to-br from-emerald-50 to-teal-50",
        border: "border-emerald-200",
        icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
        text: "Pembayaran Berhasil",
        textColor: "text-emerald-700",
      };
    if (isPending)
      return {
        bg: "bg-gradient-to-br from-amber-50 to-orange-50",
        border: "border-amber-200",
        icon: <Clock className="w-6 h-6 text-amber-600" />,
        text: "Menunggu Pembayaran",
        textColor: "text-amber-700",
      };
    return {
      bg: "bg-gradient-to-br from-gray-50 to-gray-100",
      border: "border-gray-300",
      icon: <AlertCircle className="w-6 h-6 text-gray-600" />,
      text: booking.status,
      textColor: "text-gray-700",
    };
  };

  const statusConfig = getStatusConfig();

  // === Retry Payment ===
  const handleRetryPayment = async () => {
    try {
      setIsPaying(true);
      const res = await bookingApi.retryPayment(booking.id_booking, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const tokenSnap = res.data?.transactionToken;
      if (!tokenSnap) {
        alert("Token pembayaran tidak ditemukan.");
        return;
      }

      if (!window.snap?.pay) {
        alert("Midtrans belum siap, coba reload halaman.");
        return;
      }

      window.snap.pay(tokenSnap, {
        onSuccess: () => window.location.reload(),
        onPending: () => window.location.reload(),
        onError: () => alert("Terjadi kesalahan pembayaran."),
        onClose: () => console.log("🟡 Popup ditutup oleh user"),
      });
    } catch (err: any) {
      console.error(err);
      alert("Gagal memproses ulang pembayaran.");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 backdrop-blur-sm bg-white/90">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/history" className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Kembali ke Riwayat Pemesanan</span>
          </Link>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Status Card */}
        <div className={`${statusConfig.bg} ${statusConfig.border} border-2 rounded-3xl p-8 shadow-lg`}>
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-2xl shadow-md">{statusConfig.icon}</div>
              <div>
                <h1 className={`text-2xl font-bold ${statusConfig.textColor}`}>
                  {statusConfig.text}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  ID Booking:{" "}
                  <span className="font-mono text-xs">{booking.id_booking}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {booking.paid_at && (
              <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-gray-700">
                  Dibayar {formatDateShort(booking.paid_at)}
                </span>
              </div>
            )}
            {booking.expired_at && isPaid && (
              <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow-sm">
                <Clock className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-gray-700">
                  Berlaku hingga {formatDateShort(booking.expired_at)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Leader Info */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
                <h2 className="text-white font-semibold flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informasi Pemimpin Rombongan
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Nama Lengkap</p>
                    <p className="font-semibold text-gray-900">{booking.leader_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Jenis Kelamin</p>
                    <p className="font-semibold text-gray-900">{booking.leader_gender}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">No. Telepon</p>
                    <p className="font-semibold text-gray-900">{booking.leader_phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Kewarganegaraan</p>
                    <p className="font-semibold text-gray-900">{booking.leader_nationality}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Identitas</p>
                    <p className="font-semibold text-gray-900">
                      {booking.leader_id_type} - {booking.leader_id_number}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visit Date */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-md border-2 border-indigo-100 p-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white rounded-2xl shadow-sm">
                  <Calendar className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-indigo-600 font-medium mb-1">
                    Tanggal Kunjungan
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatDate(booking.visit_date || booking.created_on)}
                  </p>
                </div>
              </div>
            </div>

            {/* Ticket List */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
                <h2 className="text-white font-semibold flex items-center gap-2">
                  <Ticket className="w-5 h-5" />
                  Detail Tiket
                </h2>
              </div>
              <div className="p-6 space-y-3">
                {booking.items?.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{item.type}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Rp {Number(item.price).toLocaleString("id-ID")} × {item.quantity}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold">
                      {item.quantity}x
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl p-6 text-white sticky top-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <CreditCard className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium opacity-90">Total Pembayaran</p>
              </div>
              <p className="text-4xl font-bold mb-6">
                Rp {Number(booking.total_amount).toLocaleString("id-ID")}
              </p>

              <div className="space-y-3">
                {isPaymentExpired && (
                  <button
                    onClick={handleRetryPayment}
                    disabled={isPaying}
                    className="w-full bg-white text-emerald-600 hover:bg-gray-50 disabled:opacity-50 py-3 px-6 rounded-xl font-semibold shadow-lg transition-all transform hover:scale-105 active:scale-95"
                  >
                    {isPaying ? "Memproses..." : "Bayar Lagi"}
                  </button>
                )}

                {isPending && (
                  <button
                    onClick={handleRetryPayment}
                    className="w-full bg-white text-emerald-600 hover:bg-gray-50 py-3 px-6 rounded-xl font-semibold shadow-lg transition-all transform hover:scale-105 active:scale-95"
                  >
                    Lanjutkan Pembayaran
                  </button>
                )}

                {isPaid && (
                  <Link href="/tickets">
                    <button className="w-full bg-white text-emerald-600 hover:bg-gray-50 py-3 px-6 rounded-xl font-semibold shadow-lg transition-all transform hover:scale-105 active:scale-95">
                      Lihat Tiket Saya
                    </button>
                  </Link>
                )}

                <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white py-3 px-6 rounded-xl font-semibold border-2 border-white/30 transition-all">
                  Hubungi Customer Service
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-white/20 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="opacity-80">Dibuat</span>
                  <span className="font-medium">
                    {formatDateShort(booking.created_on)}
                  </span>
                </div>
                {booking.paid_at && (
                  <div className="flex justify-between">
                    <span className="opacity-80">Dibayar</span>
                    <span className="font-medium">
                      {formatDateShort(booking.paid_at)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
