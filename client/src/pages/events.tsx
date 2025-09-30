import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowLeft, MapPin } from "lucide-react";
import { Link } from "wouter";
import type { News } from "@shared/schema";

export default function EventsPage() {
  const { data: allNews, isLoading } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  // Filter for events only
  const events = allNews?.filter(item => item.category === 'event') || [];

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventStatus = (eventDate: Date | string | null) => {
    if (!eventDate) return { text: "Tidak diketahui", color: "bg-gray-100 text-gray-700" };
    
    const now = new Date();
    const event = new Date(eventDate);
    const diffTime = event.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 7) {
      return { text: "Segera Hadir", color: "bg-blue-100 text-blue-700" };
    } else if (diffDays > 0) {
      return { text: "Akan Datang", color: "bg-orange-100 text-orange-700" };
    } else if (diffDays === 0) {
      return { text: "Hari Ini", color: "bg-red-100 text-red-700" };
    } else if (diffDays >= -3) {
      return { text: "Berlangsung", color: "bg-yellow-100 text-yellow-700" };
    } else {
      return { text: "Selesai", color: "bg-green-100 text-green-700" };
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <div className="animate-pulse">
          <div className="bg-gray-200 rounded-2xl h-32 mb-6"></div>
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-56"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/" data-testid="link-back-home">
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900" data-testid="text-page-title">
                Event Taman Nasional
              </h1>
              <p className="text-gray-600" data-testid="text-page-subtitle">
                Kegiatan dan acara menarik di Taman Nasional Alas Purwo
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600" data-testid="text-upcoming-count">
              {events.filter(e => e.eventDate && new Date(e.eventDate) > new Date()).length}
            </div>
            <div className="text-sm text-gray-600">Event Mendatang</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600" data-testid="text-ongoing-count">
              {events.filter(e => {
                if (!e.eventDate) return false;
                const now = new Date();
                const event = new Date(e.eventDate);
                const diffDays = Math.ceil((event.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                return diffDays >= -3 && diffDays <= 0;
              }).length}
            </div>
            <div className="text-sm text-gray-600">Sedang Berlangsung</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600" data-testid="text-total-count">
              {events.length}
            </div>
            <div className="text-sm text-gray-600">Total Event</div>
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      <div className="space-y-6">
        {events.map((event) => {
          const status = getEventStatus(event.eventDate);
          return (
            <Card key={event.id} className="hover:shadow-lg transition-shadow" data-testid={`card-event-${event.id}`}>
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  {/* Image */}
                  {event.imageUrl && (
                    <div className="lg:w-1/3">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-48 lg:h-full object-cover rounded-t-xl lg:rounded-l-xl lg:rounded-t-none"
                        data-testid={`img-event-${event.id}`}
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-6 flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span 
                        className={`text-sm px-3 py-1 rounded-full font-medium ${status.color}`}
                        data-testid={`status-event-${event.id}`}
                      >
                        {status.text}
                      </span>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="w-4 h-4 mr-1" />
                        <span data-testid={`text-event-author-${event.id}`}>Admin Website</span>
                      </div>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-3" data-testid={`text-event-title-${event.id}`}>
                      {event.title}
                    </h2>

                    <p className="text-gray-600 mb-4" data-testid={`text-event-summary-${event.id}`}>
                      {event.summary}
                    </p>

                    <div className="text-sm text-gray-700 leading-relaxed mb-4" data-testid={`text-event-content-${event.id}`}>
                      {event.content}
                    </div>

                    {/* Event Details */}
                    <div className="space-y-2 mb-4">
                      {event.eventDate && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 text-teal-600" />
                          <span data-testid={`text-event-date-${event.id}`}>
                            {formatDate(event.eventDate)} • {formatTime(event.eventDate)}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-teal-600" />
                        <span data-testid={`text-event-location-${event.id}`}>
                          Taman Nasional Alas Purwo, Banyuwangi
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>Dipublikasikan {formatDate(event.publishDate)}</span>
                        </div>
                        
                        <Button size="sm" className="bg-teal-600 hover:bg-teal-700" data-testid={`button-event-info-${event.id}`}>
                          Info Lengkap
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {events.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Calendar className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Belum Ada Event</h3>
            <p className="text-gray-500">Event menarik akan ditampilkan di halaman ini.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}