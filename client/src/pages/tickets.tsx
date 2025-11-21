import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Ticket as TicketIcon, 
  Calendar, 
  CheckCircle2, 
  Clock,
  MapPin,
  QrCode,
  Sparkles,
  Download,
  User
} from "lucide-react";
import { bookingApi } from "@/lib/api";
import { QRCodeSVG } from "qrcode.react";

export default function Tickets() {
  const token = localStorage.getItem("token") ?? "";

  const { data, isLoading } = useQuery({
    queryKey: ["bookings-tickets"],
    queryFn: async () => {
      const res = await bookingApi.getAllBookings(
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    },
    enabled: !!token,
  });

  // Filter tickets: only active, unused, and not expired
  const activeTickets = data?.filter(
    (booking: any) => 
      booking.status === "Success" && 
      booking.used_at === null &&
      booking.expired_at && new Date(booking.expired_at) > new Date()
  ) || [];

  const hasTickets = data && data.length > 0;
  const hasActiveTickets = activeTickets.length > 0;

  const formatDate = (date: Date | string) => {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

    const formatDateLong = (date: Date | string) => {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleDateString('id-ID', {
      hour: 'numeric',
      minute: 'numeric',
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-6">
            <div className="bg-gray-200 rounded-2xl h-64"></div>
            <div className="bg-gray-200 rounded-2xl h-32"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[300px] bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
          <div className="space-y-4 text-white">
            <div className="flex items-center space-x-2">
              <TicketIcon className="w-6 h-6" />
              <span className="text-sm font-medium tracking-wider uppercase">Tiket Saya</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Kelola Tiket Anda
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl leading-relaxed">
              Lihat dan kelola semua tiket kunjungan Anda di Taman Nasional Alas Purwo
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        {/* Active Tickets */}
        {activeTickets.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  Tiket Aktif
                </h2>
                <p className="text-gray-600 mt-1">Tiket yang siap digunakan untuk kunjungan Anda</p>
              </div>
              <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                {activeTickets.length} Tiket
              </span>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {activeTickets.map((booking: any) => (
                <Card key={booking.id_booking} className="border-0 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow">
                  {/* Ticket Header */}
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white relative">
                    <div className="absolute top-0 right-0 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-bl-2xl">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <TicketIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs opacity-90 uppercase tracking-wide">Tiket Masuk</p>
                        <p className="font-bold text-lg">Taman Nasional Alas Purwo</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs opacity-90">Berlaku hingga</p>
                        <p className="font-semibold">{formatDateLong(booking.expired_at)}</p>
                      </div>
                      <div className="px-3 py-1 bg-emerald-400/30 rounded-lg backdrop-blur-sm">
                        <span className="text-xs font-bold uppercase">Valid</span>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Left: QR Code */}
                      <div className="flex flex-col items-center justify-center bg-white border-2 border-dashed border-gray-300 rounded-xl p-6">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <QRCodeSVG 
                            value={booking.id_booking} 
                            size={160}
                            level="H"
                            includeMargin={false}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-3 text-center">
                          Tunjukkan QR ini saat masuk
                        </p>
                      </div>

                      {/* Right: Ticket Info */}
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">ID Booking</p>
                          <p className="font-mono text-sm font-semibold text-gray-900 break-all">
                            {booking.id_booking.substring(0, 18)}...
                          </p>
                        </div>

                        <div className="flex items-start gap-3">
                          <User className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500">
                              {booking.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) === 1 
                                ? "Nama Pengunjung" 
                                : "Pemimpin Rombongan"}
                            </p>
                            <p className="font-semibold text-gray-900">{booking.leader_name}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500">Tanggal Pembayaran</p>
                            <p className="font-semibold text-gray-900 text-sm">
                              {formatDate(booking.visit_date || booking.created_on)}
                            </p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Total Pembayaran</p>
                          <p className="text-2xl font-bold text-emerald-600">
                            Rp {Number(booking.total_amount).toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Ticket Items */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <p className="text-sm font-semibold text-gray-700 mb-3">Detail Tiket:</p>
                      <div className="space-y-2">
                        {booking.items?.map((item: any, idx: number) => {
                          return (
                            <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                              <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-lg flex-shrink-0">
                                <span className="text-lg font-bold text-emerald-700">{item.quantity}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 text-sm truncate">{item.gate_name} - {item.day_type_name}</p>
                                <p className="text-xs text-gray-500">{item.category_name}</p>
                              </div>
                              <TicketIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex gap-3">
                      <Link href={`/history/${booking.id_booking}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          Lihat Detail
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => {
                          const canvas = document.querySelector(`canvas[data-id="${booking.id_booking}"]`) as HTMLCanvasElement;
                          if (canvas) {
                            const url = canvas.toDataURL();
                            const link = document.createElement('a');
                            link.download = `ticket-${booking.id_booking}.png`;
                            link.href = url;
                            link.click();
                          }
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State - No Tickets at All */}
        {!hasTickets && (
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-16 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mb-6">
                <TicketIcon className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Belum Ada Tiket</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Anda belum memiliki tiket. Mulai jelajahi destinasi menarik di Taman Nasional Alas Purwo!
              </p>
              <Link href="/destinations">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-full shadow-xl">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Jelajahi Destinasi
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Empty State - Has Tickets but All Used/Expired */}
        {hasTickets && !hasActiveTickets && (
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-16 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6">
                <Clock className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Tidak Ada Tiket Aktif</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Semua tiket Anda sudah digunakan atau kadaluarsa. Lihat riwayat pemesanan atau pesan tiket baru!
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/history">
                  <Button variant="outline" size="lg" className="px-8 py-6 text-lg rounded-full">
                    Lihat Riwayat
                  </Button>
                </Link>
                <Link href="/destinations">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-full shadow-xl">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Pesan Tiket Baru
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Call to Action Section */}
      {activeTickets.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-16 mt-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Rencanakan Petualangan Berikutnya
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Masih banyak destinasi menakjubkan yang menunggu untuk dijelajahi
            </p>
            <Link href="/destinations">
              <Button
                size="lg"
                className="bg-white text-emerald-600 hover:bg-gray-100 font-semibold px-8 py-6 text-lg rounded-full shadow-xl"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Lihat Destinasi Lainnya
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
