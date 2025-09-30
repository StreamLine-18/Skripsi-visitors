import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History as HistoryIcon, CheckCircle } from "lucide-react";
import type { Ticket, Attraction } from "@shared/schema";

type TicketWithAttraction = Ticket & { attraction?: Attraction };

export default function History() {
  const { data: tickets, isLoading } = useQuery<TicketWithAttraction[]>({
    queryKey: ["/api/tickets"],
  });

  // Filter untuk history (tiket yang sudah digunakan atau kadaluarsa)
  const historyTickets = tickets?.filter(ticket => 
    ticket.status === 'used' || ticket.status === 'expired' || 
    (ticket.status === 'active' && new Date(ticket.visitDate) < new Date())
  ) || [];

  const filterOptions = [
    { label: "Bulan Ini", active: true },
    { label: "Minggu Ini", active: false },
    { label: "Tahun Ini", active: false },
  ];

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'used':
        return 'bg-green-100 text-green-700';
      case 'expired':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-green-100 text-green-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'used':
        return 'Selesai';
      case 'expired':
        return 'Kadaluarsa';
      default:
        return 'Selesai';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <div className="animate-pulse">
          <div className="bg-gray-200 rounded-2xl h-32 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-20"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Filter Tabs */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <HistoryIcon className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Riwayat Tiket</h2>
          </div>
          <div className="flex space-x-2">
            {filterOptions.map((option) => (
              <Button
                key={option.label}
                variant={option.active ? "default" : "outline"}
                size="sm"
                className={option.active ? "bg-teal-600 hover:bg-teal-700" : ""}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* History List */}
      {historyTickets.length > 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {historyTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center space-x-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  {ticket.attraction && (
                    <img 
                      src={ticket.attraction.imageUrl} 
                      alt={ticket.attraction.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{ticket.attraction?.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(ticket.status)}`}>
                        {getStatusText(ticket.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{ticket.attraction?.category} Experience</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-500">
                        08:00 - 16:00, {formatDate(ticket.visitDate)}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        Rp {parseInt(ticket.totalAmount).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <HistoryIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Riwayat</h3>
            <p className="text-gray-600">Riwayat kunjungan Anda akan muncul di sini setelah menggunakan tiket.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
