import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users, Ticket } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const HOLIDAY_API = import.meta.env.HOLIDAY_API || "";

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

// === UI ===
const wrapperCls = "max-w-7xl mx-auto p-4 space-y-6";
const sectionTitleCls = "text-lg font-semibold text-gray-900 mb-3";

export default function BookingPage() {
  const CLIENT_KEY = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
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

  // === detect holiday & set day type ===
  useEffect(() => {
    if (!departDate) return;
    (async () => {
      const holiday = await checkIsHoliday(departDate);
      const detected = detectDayType(departDate, holiday);
      setDayType(detected);
    })();
  }, [departDate]);

  // === auto pick ticket when nationality/gate/date change ===
  useEffect(() => {
    if (!ticketsQuery.data || !leader.nationality || !selectedGate) return;

    const base = ticketsQuery.data.find(
      (t) =>
        t.gate.name === selectedGate &&
        t.category.name === leader.nationality &&
        t.dayType.name === dayType
    );

    if (base) {
      setTickets([{ id_ticket_price: base.id_ticket_price, quantity: 1 }]);
    } else {
      setTickets([]);
    }
  }, [leader.nationality, selectedGate, dayType, ticketsQuery.data]);

  const totalPrice = useMemo(() => {
    if (!ticketsQuery.data || tickets.length === 0) return 0;
    return tickets.reduce((sum, t) => {
      const price = ticketsQuery.data.find((p) => p.id_ticket_price === t.id_ticket_price)?.price;
      return sum + Number(price || 0) * t.quantity;
    }, 0);
  }, [tickets, ticketsQuery.data]);

  // === Create Booking Mutation ===
  const createBooking = useMutation({
    mutationFn: async () => {
      if (!leader.name) throw new Error("Nama wajib diisi");
      if (!leader.nationality) throw new Error("Pilih kebangsaan");
      if (!departDate) throw new Error("Pilih tanggal kunjungan");
      if (!selectedGate) throw new Error("Pilih gerbang");
      if (tickets.length === 0) throw new Error("Tidak ada tiket yang sesuai");

      const payload: CreateBookingPayload = {
        leader,
        ticketOrders: tickets,
      };

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      const token = localStorage.getItem("access_token");
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const resp = await fetch(`${BASE_URL}/public/bookings`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const json = await resp.json();
      if (!resp.ok) throw new Error(json?.meta?.message || "Gagal membuat booking");
      return { token: json.data.payment_token, id_booking: json.data.id_booking };
    },
    onSuccess: ({ token, id_booking }) => {
      // @ts-ignore
      if (!window.snap?.pay) {
        alert("Midtrans Snap belum siap. Muat ulang halaman.");
        return;
      }
      // @ts-ignore
      window.snap.pay(token, {
        onSuccess: () => (window.location.href = `/payment/success?id=${id_booking}`),
        onPending: () => (window.location.href = `/payment/pending?id=${id_booking}`),
        onError: () => (window.location.href = `/payment/failed?id=${id_booking}`),
      });
    },
  });

  // === UI ===
  return (
    <div className={wrapperCls}>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
        Booking Taman Nasional Alas Purwo
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Leader */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className={sectionTitleCls}>Data Ketua Kelompok</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600">Nama Ketua</label>
                  <input
                    className="mt-1 w-full rounded-lg border-gray-200"
                    value={leader.name}
                    onChange={(e) => setLeader({ ...leader, name: e.target.value })}
                    placeholder="Nama lengkap"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Jenis Kelamin</label>
                  <select
                    className="mt-1 w-full rounded-lg border-gray-200"
                    value={leader.gender}
                    onChange={(e) => setLeader({ ...leader, gender: e.target.value })}
                  >
                    <option value="">Pilih...</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Kebangsaan</label>
                  <select
                    className="mt-1 w-full rounded-lg border-gray-200"
                    value={leader.nationality}
                    onChange={(e) =>
                      setLeader({ ...leader, nationality: e.target.value as Leader["nationality"] })
                    }
                  >
                    <option value="">Pilih...</option>
                    <option value="Nusantara">Nusantara</option>
                    <option value="Mancanegara">Mancanegara</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Nomor Telepon</label>
                  <input
                    className="mt-1 w-full rounded-lg border-gray-200"
                    value={leader.phone}
                    onChange={(e) => setLeader({ ...leader, phone: e.target.value })}
                    placeholder="08123456789"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Jenis Identitas</label>
                  <select
                    className="mt-1 w-full rounded-lg border-gray-200"
                    value={leader.idType}
                    onChange={(e) =>
                      setLeader({ ...leader, idType: e.target.value as Leader["idType"] })}
                  >
                    <option value="">Pilih...</option>
                    <option value="KTP">KTP</option>
                    <option value="SIM">SIM</option>
                    <option value="PASSPORT">Paspor</option>
                    <option value="KTM">KTM</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600">Nomor Identitas</label>
                  <input
                    className="mt-1 w-full rounded-lg border-gray-200"
                    value={leader.idNumber}
                    onChange={(e) => setLeader({ ...leader, idNumber: e.target.value })}
                    placeholder="Masukkan nomor identitas"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gate & Date */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className={sectionTitleCls}>Pilih Gerbang & Tanggal</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Gerbang Masuk</label>
                  <select
                    value={selectedGate}
                    onChange={(e) => setSelectedGate(e.target.value)}
                    className="mt-1 w-full rounded-lg border-gray-200"
                  >
                    <option value="">Pilih gerbang</option>
                    {gatesQuery.data?.map((g) => (
                      <option key={g.id_gate} value={g.name}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Tanggal Kunjungan</label>
                  <input
                    type="date"
                    value={departDate}
                    onChange={(e) => setDepartDate(e.target.value)}
                    className="mt-1 w-full rounded-lg border-gray-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Jenis Hari: <span className="font-medium">{dayType}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tickets */}
          {/* Tickets */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className={sectionTitleCls}>Tiket Dipilih</h2>
              {tickets.length === 0 ? (
                <p className="text-gray-500 text-sm">Tidak ada tiket yang tersedia.</p>
              ) : (
                <div className="space-y-2">
                  {tickets.map((t, i) => {
                    const info = ticketsQuery.data?.find(
                      (p) => p.id_ticket_price === t.id_ticket_price
                    );
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between text-sm border-b py-2"
                      >
                        <div>
                          <p className="font-medium">
                            {info?.gate.name} • {info?.category.name} • {info?.dayType.name}
                          </p>
                          <p className="text-gray-600 text-xs">
                            Rp{Number(info?.price).toLocaleString("id-ID")} / orang
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
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
                            className="w-16 text-center border border-gray-200 rounded-md"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setTickets((prev) => prev.filter((_, idx) => idx !== i))
                            }
                          >
                            Hapus
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tambah Tiket Lawan */}
              {!tickets.some(
                (t) =>
                  ticketsQuery.data?.find((p) => p.id_ticket_price === t.id_ticket_price)?.category.name !==
                  leader.nationality
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
                    disabled={!leader.nationality || !selectedGate}
                  >
                    + Tambah Tiket
                  </Button>
                )}
            </CardContent>
          </Card>

        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-6">
            <Card className="shadow-sm border-gray-100">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                    <Ticket className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ringkasan</p>
                    <p className="font-semibold text-gray-900">Pembayaran</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> {selectedGate || "-"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> {departDate || "-"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" /> Total: Rp{totalPrice.toLocaleString("id-ID")}
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-white text-green-700 hover:bg-gray-200 border border-teal-200"
                  onClick={() => createBooking.mutate()}
                  disabled={createBooking.isPending}
                >
                  {createBooking.isPending ? "Memproses..." : "Lanjut ke Pembayaran"}
                </Button>

                {createBooking.isError && (
                  <p className="text-sm text-red-600">
                    {(createBooking.error as Error)?.message || "Terjadi kesalahan"}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
