import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users, Ticket, Plus, Trash2 } from "lucide-react";
import { useMidtransSnap } from "@/hooks/use-midtrans-snap";

// === Config ===
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const HOLIDAY_API = import.meta.env.VITE_HOLIDAY_API || "";
const CLIENT_KEY = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;

// === Utils ===
async function checkIsHoliday(dateStr: string): Promise<boolean> {
  try {
    const res = await fetch(HOLIDAY_API);
    const holidays = await res.json();
    return holidays.some((h: any) => h.holiday_date === dateStr && h.is_national_holiday);
  } catch {
    return false;
  }
}

function detectDayType(date: string, isHoliday: boolean): "Weekday" | "Weekend" {
  const day = new Date(date).getDay();
  if (day === 0 || day === 6 || isHoliday) return "Weekend";
  return "Weekday";
}

// === Types ===
type Leader = {
  name: string;
  nationality: "Nusantara" | "Mancanegara" | "";
  idType: "KTP" | "Passport" | "KTM" | "SIM" | "Lainnya" | "";
  idNumber: string;
  phone: string;
  gender: string;
};

type TicketPrice = {
  id_ticket_price: string;
  price: string;
  gate: { name: string };
  category: { name: string };
  dayType: { name: string };
};

type TicketOrder = {
  id_ticket_price: string;
  quantity: number;
};

type CreateBookingPayload = {
  leader: Leader;
  ticketOrders: TicketOrder[];
};

// === Style Helpers ===
const inputCls =
  "mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all";
const labelCls = "block text-sm font-medium text-gray-700 mb-1";

export default function BookingPage() {
  // ✅ Load Midtrans Snap (false = sandbox)
  useMidtransSnap(false);

  const [leader, setLeader] = useState<Leader>({
    name: "",
    nationality: "",
    phone: "",
    gender: "",
    idType: "",
    idNumber: "",
  });
  const [departDate, setDepartDate] = useState("");
  const [dayType, setDayType] = useState<"Weekday" | "Weekend">("Weekday");
  const [tickets, setTickets] = useState<TicketOrder[]>([]);
  const [selectedGate, setSelectedGate] = useState("");

  // === Fetch Gates ===
  const gatesQuery = useQuery({
    queryKey: ["gates"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/public/gates`);
      const json = await res.json();
      if (!res.ok) throw new Error("Gagal memuat gerbang");
      return json.data as { id_gate: string; name: string }[];
    },
  });

  // === Fetch Tickets ===
  const ticketsQuery = useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/public/tickets?page=1&pageSize=100`);
      const json = await res.json();
      if (!res.ok) throw new Error("Gagal memuat tiket");
      return json.data as TicketPrice[];
    },
  });

  // === Detect Holiday ===
  useEffect(() => {
    if (!departDate) return;
    (async () => {
      const holiday = await checkIsHoliday(departDate);
      setDayType(detectDayType(departDate, holiday));
    })();
  }, [departDate]);

  // === Auto-select Ticket ===
  useEffect(() => {
    if (!ticketsQuery.data || !leader.nationality || !selectedGate) return;
    const base = ticketsQuery.data.find(
      (t) =>
        t.gate.name === selectedGate &&
        t.category.name === leader.nationality &&
        t.dayType.name === dayType
    );
    setTickets(base ? [{ id_ticket_price: base.id_ticket_price, quantity: 1 }] : []);
  }, [leader.nationality, selectedGate, dayType, ticketsQuery.data]);

  const totalPrice = useMemo(() => {
    if (!ticketsQuery.data || tickets.length === 0) return 0;
    return tickets.reduce((sum, t) => {
      const price = ticketsQuery.data.find((p) => p.id_ticket_price === t.id_ticket_price)?.price;
      return sum + Number(price || 0) * t.quantity;
    }, 0);
  }, [tickets, ticketsQuery.data]);

  // === Create Booking ===
  const createBooking = useMutation({
    mutationFn: async () => {
      if (!leader.name) throw new Error("Nama wajib diisi");
      if (!leader.nationality) throw new Error("Pilih kebangsaan");
      if (!departDate) throw new Error("Pilih tanggal kunjungan");
      if (!selectedGate) throw new Error("Pilih gerbang");
      if (tickets.length === 0) throw new Error("Tidak ada tiket yang sesuai");

      const payload: CreateBookingPayload = { leader, ticketOrders: tickets };
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      const token = localStorage.getItem("token");
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const resp = await fetch(`${BASE_URL}/public/bookings`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const json = await resp.json();
      console.log("Create Booking Response:", json);
      if (!resp.ok) throw new Error(json?.meta?.message || "Gagal membuat booking");
      return { token: json.data.transactionToken, id_booking: json.data.id_booking };
    },
    onSuccess: ({ token, id_booking }) => {
      const snap = (window as any).snap;
      if (!snap || typeof snap.pay !== "function") {
        alert("Layanan pembayaran sedang bermasalah. Silakan muat ulang halaman.");
        console.error("Midtrans Snap not available", snap);
        return;
      }

      snap.pay(token, {
        onSuccess: () => (window.location.href = `/ticket/success?id=${id_booking}`),
        onPending: () => (window.location.href = `/ticket/pending?id=${id_booking}`),
        onError: () => (window.location.href = `/ticket/failed?id=${id_booking}`),
      });
    },
  });

  // === UI ===
  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="pt-4 pb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Booking Tiket Taman Nasional Alas Purwo
        </h1>
        <p className="text-sm text-gray-600">
          Lengkapi data di bawah ini untuk memesan tiket kunjungan Anda
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Leader Data */}
          <Card className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Users className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Data Ketua Kelompok</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelCls}>Nama Ketua</label>
                  <input
                    className={inputCls}
                    value={leader.name}
                    onChange={(e) => setLeader({ ...leader, name: e.target.value })}
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div>
                  <label className={labelCls}>Jenis Kelamin</label>
                  <select
                    className={inputCls}
                    value={leader.gender}
                    onChange={(e) => setLeader({ ...leader, gender: e.target.value })}
                  >
                    <option value="">Pilih jenis kelamin</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className={labelCls}>Kebangsaan</label>
                  <select
                    className={inputCls}
                    value={leader.nationality}
                    onChange={(e) =>
                      setLeader({ ...leader, nationality: e.target.value as Leader["nationality"] })
                    }
                  >
                    <option value="">Pilih kebangsaan</option>
                    <option value="Nusantara">Nusantara</option>
                    <option value="Mancanegara">Mancanegara</option>
                  </select>
                </div>

                <div>
                  <label className={labelCls}>Nomor Telepon</label>
                  <input
                    className={inputCls}
                    value={leader.phone}
                    onChange={(e) => setLeader({ ...leader, phone: e.target.value })}
                    placeholder="Contoh: 08123456789"
                  />
                </div>

                <div>
                  <label className={labelCls}>Jenis Identitas</label>
                  <select
                    className={inputCls}
                    value={leader.idType}
                    onChange={(e) =>
                      setLeader({ ...leader, idType: e.target.value as Leader["idType"] })
                    }
                  >
                    <option value="">Pilih jenis identitas</option>
                    <option value="KTP">KTP</option>
                    <option value="SIM">SIM</option>
                    <option value="Passport">Paspor</option>
                    <option value="KTM">Kartu Mahasiswa</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className={labelCls}>Nomor Identitas</label>
                  <input
                    className={inputCls}
                    value={leader.idNumber}
                    onChange={(e) => setLeader({ ...leader, idNumber: e.target.value })}
                    placeholder="Masukkan nomor identitas sesuai dokumen"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gate & Date */}
          <Card className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Pilih Gerbang & Tanggal</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Gerbang Masuk</label>
                  <select
                    value={selectedGate}
                    onChange={(e) => setSelectedGate(e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Pilih gerbang masuk</option>
                    {gatesQuery.data?.map((g) => (
                      <option key={g.id_gate} value={g.name}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelCls}>Tanggal Kunjungan</label>
                  <input
                    type="date"
                    value={departDate}
                    onChange={(e) => setDepartDate(e.target.value)}
                    className={inputCls}
                    min={new Date().toISOString().split("T")[0]}
                  />
                  {departDate && (
                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                      <Calendar className="w-3 h-3" />
                      Jenis Hari: {dayType}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tickets */}
          <Card className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Tiket Dipilih</h2>
              </div>

              {tickets.length === 0 ? (
                <div className="text-center py-8 px-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Belum ada tiket yang tersedia.</p>
                  <p className="text-gray-400 text-xs mt-1">Pilih gerbang dan tanggal terlebih dahulu</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tickets.map((t, i) => {
                    const info = ticketsQuery.data?.find(
                      (p) => p.id_ticket_price === t.id_ticket_price
                    );
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-white hover:border-emerald-200 transition-all"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm mb-1">
                            {info?.gate.name} • {info?.category.name}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                              {info?.dayType.name}
                            </span>
                            <span className="text-sm font-medium text-emerald-600">
                              Rp {Number(info?.price).toLocaleString("id-ID")}
                            </span>
                            <span className="text-xs text-gray-500">per orang</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-600 font-medium">Jumlah:</label>
                            <input
                              type="number"
                              min={1}
                              value={t.quantity}
                              onChange={(e) =>
                                setTickets((prev) =>
                                  prev.map((x, idx) =>
                                    idx === i ? { ...x, quantity: Number(e.target.value) } : x
                                  )
                                )
                              }
                              className="w-16 text-center border border-gray-300 rounded-md py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setTickets((prev) => prev.filter((_, idx) => idx !== i))
                            }
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tambah Tiket Kategori Lain */}
              {leader.nationality &&
                selectedGate &&
                ticketsQuery.data &&
                !tickets.some(
                  (t) =>
                    ticketsQuery.data?.find((p) => p.id_ticket_price === t.id_ticket_price)
                      ?.category.name !== leader.nationality
                ) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      const alt = ticketsQuery.data?.find(
                        (p) =>
                          p.gate.name === selectedGate &&
                          p.category.name !== leader.nationality &&
                          p.dayType.name === dayType
                      );
                      if (alt)
                        setTickets((prev) => [
                          ...prev,
                          { id_ticket_price: alt.id_ticket_price, quantity: 1 },
                        ]);
                    }}
                    className="w-full border-dashed border-2 border-emerald-300 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-400"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Tiket Kategori Lain
                  </Button>
                )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-6">
            <Card className="shadow-lg border border-gray-200">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                    <Ticket className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Ringkasan</p>
                    <p className="text-lg font-bold text-gray-900">Pembayaran</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                    <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Gerbang Masuk</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedGate || "Belum dipilih"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                    <Calendar className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Tanggal Kunjungan</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {departDate
                          ? new Date(departDate).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "Belum dipilih"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                    <Users className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Jumlah Tiket</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {tickets.reduce((sum, t) => sum + t.quantity, 0)} orang
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-gray-600">Total Pembayaran</span>
                    <span className="text-2xl font-bold text-emerald-600">
                      Rp {totalPrice.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                    onClick={() => createBooking.mutate()}
                    disabled={createBooking.isPending || tickets.length === 0}
                  >
                    {createBooking.isPending ? "Memproses..." : "Lanjut ke Pembayaran"}
                  </Button>

                  {createBooking.isError && (
                    <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200">
                      <p className="text-sm text-red-600">
                        {(createBooking.error as Error)?.message || "Terjadi kesalahan"}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}