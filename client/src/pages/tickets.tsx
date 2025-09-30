import { useQuery } from "@tanstack/react-query";
import TicketCard from "@/components/ticket-card";
import { Card, CardContent } from "@/components/ui/card";
import { Ticket as TicketIcon, Calendar } from "lucide-react";
import type { Ticket, Attraction } from "@shared/schema";

type TicketWithAttraction = Ticket & { attraction?: Attraction };

export default function Tickets() {
  const { data: tickets, isLoading } = useQuery<TicketWithAttraction[]>({
    queryKey: ["/api/tickets"],
  });

  const activeTickets = tickets?.filter(ticket => ticket.status === 'active') || [];
  const upcomingTickets = tickets?.filter(ticket => 
    ticket.status === 'active' && new Date(ticket.visitDate) > new Date()
  ) || [];

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <div className="animate-pulse">
          <div className="bg-gray-200 rounded-2xl h-64 mb-6"></div>
          <div className="bg-gray-200 rounded-2xl h-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Active Tickets */}
      {activeTickets.length > 0 && (
        <Card className="overflow-hidden">
          <div className="gradient-primary text-white p-6">
            <div className="flex items-center space-x-3 mb-2">
              <TicketIcon className="w-6 h-6" />
              <h2 className="text-xl font-bold">TIKET AKTIF</h2>
            </div>
            <p className="text-sm opacity-90">Tiket yang sudah dipesan dan siap digunakan</p>
          </div>
          
          <CardContent className="p-6">
            <div className="space-y-4">
              {activeTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} showQR={true} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Tickets */}
      {upcomingTickets.length > 0 && activeTickets.length === 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Calendar className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Tiket Mendatang</h3>
            </div>
            <div className="space-y-4">
              {upcomingTickets.map((ticket) => (
                <div key={ticket.id} className="border border-gray-200 rounded-xl p-4 hover:border-teal-300 transition-colors">
                  <div className="flex items-center space-x-4">
                    {ticket.attraction && (
                      <img 
                        src={ticket.attraction.imageUrl} 
                        alt={ticket.attraction.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{ticket.attraction?.name}</h4>
                      <p className="text-sm text-gray-600">{ticket.attraction?.category} Experience</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-teal-600 font-medium">
                          {formatDate(ticket.visitDate)}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          Rp {parseInt(ticket.totalAmount).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {(!tickets || tickets.length === 0) && (
        <Card>
          <CardContent className="p-12 text-center">
            <TicketIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Tiket</h3>
            <p className="text-gray-600 mb-6">Anda belum memiliki tiket. Mulai jelajahi destinasi menarik di Alas Purwo!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
