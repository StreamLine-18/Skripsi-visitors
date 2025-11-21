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
  ArrowLeft,
  Camera,
  Info,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  const [, params] = useRoute("/history/:id");
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
  const isUsed = booking.status === "Used";
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

    const formatDateLong = (dateStr: string | number | Date) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      hour:"2-digit",
      minute:"2-digit",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // === Status Style Map ===
  const getStatusConfig = () => {
    if (isUsed)
      return {
        bg: "bg-gradient-to-br from-purple-50 to-indigo-50",
        border: "border-purple-200",
        icon: <CheckCircle2 className="w-6 h-6 text-purple-600" />,
        text: "Tiket Telah Digunakan",
        textColor: "text-purple-700",
      };
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[300px] bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
          <Link href="/history">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 mb-6 -ml-2 rounded-lg w-fit"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Riwayat
            </Button>
          </Link>
          
          <div className="space-y-4 text-white">
            <div className="flex items-center space-x-2">
              <Camera className="w-6 h-6" />
              <span className="text-sm font-medium tracking-wider uppercase">Detail Pemesanan</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Informasi Booking
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl leading-relaxed">
              Detail lengkap pemesanan tiket Anda di Taman Nasional Alas Purwo
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        {/* Status Card */}
        <Card className={`${statusConfig.bg} ${statusConfig.border} border-2 rounded-2xl shadow-xl overflow-hidden`}>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white rounded-xl shadow-md">{statusConfig.icon}</div>
                <div>
                  <h2 className={`text-2xl md:text-3xl font-bold ${statusConfig.textColor}`}>
                    {statusConfig.text}
                  </h2>
                  <p className="text-sm text-gray-600 mt-2">
                    ID Booking: <span className="font-mono font-semibold">{booking.id_booking}</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {booking.expired_at && isPaid && (
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Berlaku hingga {formatDateLong(booking.expired_at)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Leader Info */}
            <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-5">
                  <h2 className="text-white text-xl font-bold flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    {booking.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) === 1 
                      ? "Informasi Pengunjung" 
                      : "Informasi Pemimpin Rombongan"}
                  </h2>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-700">Nama Lengkap</p>
                      <p className="text-lg text-gray-900">{booking.leader_name}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-700">Jenis Kelamin</p>
                      <p className="text-lg text-gray-900">{booking.leader_gender}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-700">No. Telepon</p>
                      <p className="text-lg text-gray-900">{booking.leader_phone}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-700">Kewarganegaraan</p>
                      <p className="text-lg text-gray-900">{booking.leader_nationality}</p>
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-2">
                      <p className="text-sm font-semibold text-gray-700">Identitas</p>
                      <p className="text-lg text-gray-900">
                        {booking.leader_id_type} - {booking.leader_id_number}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Visit Date */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 border-2 rounded-2xl shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-white rounded-xl shadow-md">
                    <Calendar className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 font-semibold mb-2">
                      Tanggal Kunjungan
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-gray-900">
                      {booking.visit_date ? formatDate(booking.visit_date) : "-"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ticket List */}
            <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-5">
                  <h2 className="text-white text-xl font-bold flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Ticket className="w-5 h-5" />
                    </div>
                    Detail Tiket
                  </h2>
                </div>
                <div className="p-8 space-y-4">
                  {booking.items?.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-base mb-1">{item.gate_name} - {item.category_name}</p>
                        <p className="text-sm text-gray-600">
                          Rp {Number(item.price).toLocaleString("id-ID")} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold">
                          Rp {(Number(item.price) * item.quantity).toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Payment Card */}
              <Card className="border-0 shadow-2xl rounded-2xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mb-4">
                      <CreditCard className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Total Pembayaran
                    </h3>
                    <p className="text-4xl font-bold text-emerald-600">
                      Rp {Number(booking.total_amount).toLocaleString("id-ID")}
                    </p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {isPaymentExpired && (
                      <Button
                        onClick={handleRetryPayment}
                        disabled={isPaying}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-6 text-lg rounded-lg shadow-lg"
                      >
                        {isPaying ? "Memproses..." : "Bayar Lagi"}
                      </Button>
                    )}

                    {isPending && (
                      <Button
                        onClick={handleRetryPayment}
                        disabled={isPaying}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-6 text-lg rounded-lg shadow-lg"
                      >
                        {isPaying ? "Memproses..." : "Lanjutkan Pembayaran"}
                      </Button>
                    )}

                    {isPaid && !isUsed && (
                      <Link href="/tickets">
                        <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-6 text-lg rounded-lg shadow-lg">
                          Lihat Tiket Saya
                        </Button>
                      </Link>
                    )}

                    {isUsed && (
                      <div className="w-full p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl shadow-sm">
                        <div className="flex items-center justify-center gap-3 mb-3">
                          <h4 className="text-lg font-bold text-purple-700">Tiket Telah Digunakan</h4>
                        </div>
                        <p className="text-sm text-center text-purple-600">
                          Digunakan pada <span className="font-semibold">{formatDateLong(booking.used_at || booking.created_on)}</span>
                        </p>
                      </div>
                    )}

                    <Button
                      variant="outline"
                      className="w-full border-2 border-gray-200 hover:bg-gray-50 font-semibold py-3"
                    >
                      Hubungi Customer Service
                    </Button>
                  </div>

                  <div className="pt-6 border-t border-gray-200 space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Dibuat</span>
                      <span className="font-semibold text-gray-900">
                        {formatDateLong(booking.created_on)}
                      </span>
                    </div>
                    {booking.paid_at && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Dibayar</span>
                        <span className="font-semibold text-gray-900">
                          {formatDateLong(booking.paid_at)}
                        </span>
                      </div>
                    )}
                    {booking.used_at && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Digunakan</span>
                        <span className="font-semibold text-gray-900">
                          {formatDateLong(booking.used_at)}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Info Card */}
              <Card className="border-amber-200 bg-amber-50/50 rounded-2xl">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Info className="w-4 h-4 mr-2 text-amber-600" />
                    Informasi Penting
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Simpan bukti pembayaran Anda</li>
                    <li>• Tunjukkan tiket saat memasuki kawasan</li>
                    <li>• Tiket berlaku sesuai tanggal kunjungan</li>
                    <li>• Hubungi CS jika ada kendala</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Rencanakan Kunjungan Berikutnya
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Jelajahi destinasi lain dan buat pengalaman wisata yang tak terlupakan
          </p>
          <Link href="/destinations">
            <Button
              size="lg"
              className="bg-white text-emerald-600 hover:bg-gray-100 font-semibold px-8 py-6 text-lg rounded-full shadow-xl"
            >
              <MapPin className="w-5 h-5 mr-2" />
              Jelajahi Destinasi
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
