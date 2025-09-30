import { Calendar, Clock, MapPin } from "lucide-react";
import QRCode from "./qr-code";
import type { Ticket, Attraction } from "@shared/schema";

interface TicketCardProps {
  ticket: Ticket & { attraction?: Attraction };
  showQR?: boolean;
}

export default function TicketCard({ ticket, showQR = false }: TicketCardProps) {
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-orange-500 text-white';
      case 'used':
        return 'bg-green-500 text-white';
      case 'expired':
        return 'bg-gray-500 text-white';
      case 'cancelled':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'used':
        return 'Selesai';
      case 'expired':
        return 'Kadaluarsa';
      case 'cancelled':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  return (
    <div className="ticket-card">
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {ticket.attraction && (
              <img 
                src={ticket.attraction.imageUrl} 
                alt={ticket.attraction.name} 
                className="w-16 h-16 rounded-xl object-cover"
              />
            )}
            <div>
              <h3 className="font-bold text-lg">{ticket.attraction?.name || 'Unknown Attraction'}</h3>
              <p className="text-sm opacity-90">{ticket.attraction?.category || 'Experience'}</p>
            </div>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(ticket.status)}`}>
            {getStatusText(ticket.status)}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-xs opacity-75 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Tanggal Kunjungan
            </p>
            <p className="font-semibold">{formatDate(ticket.visitDate)}</p>
          </div>
          <div>
            <p className="text-xs opacity-75">Nama Pengunjung</p>
            <p className="font-semibold">{ticket.visitorName}</p>
          </div>
          <div>
            <p className="text-xs opacity-75 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Waktu Masuk
            </p>
            <p className="font-semibold">{ticket.attraction?.operatingHours || '08:00 - 16:00 WIB'}</p>
          </div>
          <div>
            <p className="text-xs opacity-75">Total Pembayaran</p>
            <p className="font-semibold">Rp {parseInt(ticket.totalAmount).toLocaleString('id-ID')}</p>
          </div>
        </div>
        
        {showQR && (
          <div className="bg-white rounded-xl p-4 text-center">
            <p className="text-gray-700 text-sm mb-3 font-medium">Scan QR code ini di pintu masuk</p>
            <QRCode value={ticket.qrCode} size={192} />
            <p className="text-gray-600 text-xs mt-3">
              <span>{ticket.ticketNumber}</span><br />
              Dicetak: <span>{formatDate(ticket.purchaseDate)}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
