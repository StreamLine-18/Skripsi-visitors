import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowLeft, MapPin } from "lucide-react";
import { Link } from "wouter";
import { eventApi, type ApiResponse, type Event } from "@/lib/api";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// --- Environment Variable & Helper Functions ---
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const SERVER_ROOT_URL = BASE_URL.endsWith('/api') ? BASE_URL.replace('/api', '') : BASE_URL;

const formatDate = (date: Date | string | undefined) => {
  if (!date) return 'Tanggal tidak diketahui';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Tanggal tidak valid';
  return d.toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
};

const formatTime = (date: Date | string | undefined) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getFullImageUrl = (relativePath: string): string => {
  if (!SERVER_ROOT_URL || !relativePath) {
    return 'https://placehold.co/600x400/EEE/31343C?text=No+Image';
  }
  if (relativePath.startsWith('http')) {
    return relativePath;
  }
  const cleanedPath = relativePath.replace('/public', '');
  const finalPath = cleanedPath.startsWith('/') ? cleanedPath.slice(1) : cleanedPath;
  return `${SERVER_ROOT_URL}/${finalPath}`;
};

const getEventStatus = (eventDate: Date | string | null | undefined) => {
  if (!eventDate) return { text: "Unknown", color: "bg-gray-100 text-gray-700" };
  const now = new Date();
  const event = new Date(eventDate);
  if (isNaN(event.getTime())) return { text: "Invalid Date", color: "bg-red-100 text-red-700" };
  const diffTime = event.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 7) return { text: "Segera Hadir", color: "bg-blue-100 text-blue-700" };
  if (diffDays > 0) return { text: "Akan Datang", color: "bg-orange-100 text-orange-700" };
  if (diffDays === 0) return { text: "Hari Ini", color: "bg-red-100 text-red-700" };
  if (diffDays >= -3) return { text: "Berlangsung", color: "bg-yellow-100 text-yellow-700" };
  return { text: "Selesai", color: "bg-green-100 text-green-700" };
};

export default function events() {
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const { data: apiResponse, isLoading, error } = useQuery<ApiResponse<Event[]>>({
    queryKey: ['events', page, pageSize],
    queryFn: () => eventApi.getAllEvents({ page, pageSize }),
  });

  const events = apiResponse?.data;
  const paginationData = apiResponse?.pagination;

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && (!paginationData || newPage <= paginationData.total_pages)) {
      setPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  const upcomingEventsCount = events?.filter(e => e.event_date && new Date(e.event_date) > new Date()).length || 0;
  const ongoingEventsCount = events?.filter(e => {
    if (!e.event_date) return false;
    const now = new Date();
    const event = new Date(e.event_date);
    const diffDays = Math.ceil((event.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= -3 && diffDays <= 0;
  }).length || 0;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <div className="animate-pulse">
          <div className="bg-gray-200 rounded-2xl h-32 mb-6"></div>
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (<div key={i} className="bg-gray-200 rounded-xl h-56"></div>))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4"><Card><CardContent className="p-6 text-center text-red-600"><h2 className="text-lg font-semibold">Gagal Memuat Data</h2><p>{error.message}</p></CardContent></Card></div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/"><Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900"><ArrowLeft className="w-5 h-5" /></Button></Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Event Taman Nasional</h1>
              <p className="text-gray-600">Kegiatan dan acara menarik di Taman Nasional Alas Purwo</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-blue-600">{upcomingEventsCount}</div><div className="text-sm text-gray-600">Event Mendatang</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-orange-600">{ongoingEventsCount}</div><div className="text-sm text-gray-600">Sedang Berlangsung</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-gray-600">{paginationData?.total_records || 0}</div><div className="text-sm text-gray-600">Total Event</div></CardContent></Card>
      </div>

      {/* Events List */}
      <div className="space-y-6">
        {events && events.length > 0 ? (
          events.map((event) => {
            const status = getEventStatus(event.event_date);
            return (
              <Card key={event.id_event} className="hover:shadow-lg transition-shadow" data-testid={`card-event-${event.id_event}`}>
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    {event.image_url && (
                      <div className="lg:w-1/3 flex-shrink-0">
                        <div className="aspect-video lg:aspect-square relative">
                          <img
                            src={getFullImageUrl(event.image_url)}
                            alt={event.title}
                            className="absolute h-full w-full object-cover rounded-t-xl lg:rounded-l-xl lg:rounded-tr-none"
                            data-testid={`img-event-${event.id_event}`}
                          />
                        </div>
                      </div>
                    )}
                    <div className="p-6 flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <span className={`text-sm px-3 py-1 rounded-full font-medium ${status.color}`}>
                            {status.text}
                          </span>
                          <div className="flex items-center text-sm text-gray-500">
                            <User className="w-4 h-4 mr-1" />
                            <span>{event.author_name}</span>
                          </div>
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h2>

                        <div
                          className="text-gray-600 mb-4 line-clamp-3 prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: event.content }}
                        ></div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2 text-teal-600" />
                            <span>
                              {formatDate(event.event_date)} • {formatTime(event.event_date)}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2 text-teal-600" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* 👇 Always sticks at the bottom */}
                      <div className="pt-2 border-t border-gray-100 mt-auto">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>Dipublikasikan {formatDate(event.published_at)}</span>
                          </div>
                          <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                            Info Lengkap
                          </Button>
                        </div>
                      </div>
                    </div>

                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card><CardContent className="p-12 text-center"><div className="text-gray-400 mb-4"><Calendar className="w-12 h-12 mx-auto" /></div><h3 className="text-lg font-semibold text-gray-600 mb-2">Belum Ada Event</h3><p className="text-gray-500">Event menarik akan ditampilkan di halaman ini.</p></CardContent></Card>
        )}
      </div>

      {/* Pagination Controls */}
      {paginationData && paginationData.total_pages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem><PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(page - 1); }} className={page <= 1 ? "pointer-events-none opacity-50" : ""} /></PaginationItem>
            {[...Array(paginationData.total_pages)].map((_, i) => (<PaginationItem key={i}><PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }} isActive={page === i + 1}>{i + 1}</PaginationLink></PaginationItem>))}
            <PaginationItem><PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(page + 1); }} className={page >= paginationData.total_pages ? "pointer-events-none opacity-50" : ""} /></PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

