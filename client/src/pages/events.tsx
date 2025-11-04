import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowLeft, MapPin, CalendarCheck } from "lucide-react";
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
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const SERVER_ROOT_URL = BASE_URL.endsWith("/api") ? BASE_URL.replace("/api", "") : BASE_URL;

const formatDate = (date: Date | string | undefined) => {
  if (!date) return "Tanggal tidak diketahui";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Tanggal tidak valid";
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatTime = (date: Date | string | undefined) => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getFullImageUrl = (relativePath: string): string => {
  if (!SERVER_ROOT_URL || !relativePath) {
    return "https://placehold.co/600x400/EEE/31343C?text=No+Image";
  }
  if (relativePath.startsWith("http")) return relativePath;
  const cleanedPath = relativePath.replace("/public", "");
  const finalPath = cleanedPath.startsWith("/") ? cleanedPath.slice(1) : cleanedPath;
  return `${SERVER_ROOT_URL}/${finalPath}`;
};

const getEventStatus = (eventDate: Date | string | null | undefined) => {
  if (!eventDate) return { text: "Unknown", color: "bg-gray-100 text-gray-700" };
  const now = new Date();
  const event = new Date(eventDate);
  const diffDays = Math.ceil((event.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays > 7) return { text: "Segera Hadir", color: "bg-emerald-100 text-emerald-700" };
  if (diffDays > 0) return { text: "Akan Datang", color: "bg-teal-100 text-teal-700" };
  if (diffDays === 0) return { text: "Hari Ini", color: "bg-orange-100 text-orange-700" };
  if (diffDays >= -3) return { text: "Berlangsung", color: "bg-yellow-100 text-yellow-700" };
  return { text: "Selesai", color: "bg-gray-100 text-gray-700" };
};

export default function EventsPage() {
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const { data: apiResponse, isLoading, error } = useQuery<ApiResponse<Event[]>>({
    queryKey: ["events", page, pageSize],
    queryFn: () => eventApi.getAllEvents({ page, pageSize }),
  });

  const events = apiResponse?.data;
  const paginationData = apiResponse?.pagination;

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && (!paginationData || newPage <= paginationData.total_pages)) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 animate-pulse p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl h-32"></div>
          <div className="grid md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl h-80"></div>
            ))}
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
        <Card className="max-w-md shadow-lg border-0 rounded-2xl">
          <CardContent className="p-8 text-center text-gray-700">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Gagal Memuat Data</h2>
            <p>{error.message}</p>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
         {/* Modern Header - Clean Design */}
                <div className="relative overflow-hidden">
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur rounded-3xl">
                        <CardContent className="p-6 md:p-8">
                            <Link href="/" data-testid="link-back-home">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 mb-4 -ml-2 rounded-lg"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Kembali
                                </Button>
                            </Link>

                            <div className="flex items-start justify-between">
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                            <CalendarCheck className="w-6 h-6 text-white" />
                                        </div>
                                        {/* <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-100 to-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                                            Terbaru
                                        </span> */}
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900" data-testid="text-page-title">
                                        Events
                                    </h1>
                                    <p className="text-gray-600 text-base md:text-lg max-w-2xl" data-testid="text-page-subtitle">
                                        Temukan kegiatan terbaru yang berlangsung di Taman Nasional Alas Purwo.
                                    </p>
                                </div>

                                {/* <div className="hidden md:block">
                                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-100 rounded-2xl flex items-center justify-center shadow-md">
                                        <MapPin className="w-8 h-8 text-emerald-600" />
                                    </div>
                                </div> */}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                
        {/* Event List */}
        {events && events.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {events.map((event) => {
              const status = getEventStatus(event.event_date);
              return (
                <Card
                  key={event.id_event}
                  className="group overflow-hidden border-0 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-white"
                >
                  <CardContent className="p-0 flex flex-col">
                    <div className="relative overflow-hidden aspect-video">
                      <img
                        src={getFullImageUrl(event.image_url)}
                        alt={event.title}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full shadow ${status.color}`}
                        >
                          {status.text}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col justify-between flex-1 bg-gradient-to-br from-white to-emerald-50/30">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                          {event.title}
                        </h3>
                        <div
                          className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: event.content }}
                        ></div>
                        <div className="space-y-2 mb-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-emerald-600" />
                            {formatDate(event.event_date)} • {formatTime(event.event_date)}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
                            {event.location}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center border-t border-gray-100 pt-3 mt-auto">
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3.5 h-3.5 mr-1.5" />
                          Dipublikasikan {formatDate(event.published_at)}
                        </div>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6">
                          Info Lengkap
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-0 shadow-xl rounded-3xl">
            <CardContent className="p-16 text-center bg-gradient-to-br from-gray-50 to-emerald-50/30">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Calendar className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Belum Ada Event</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Event menarik akan segera ditampilkan di halaman ini. Nantikan informasi terbaru!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {paginationData && paginationData.total_pages > 1 && (
          <div className="flex justify-center pt-8">
            <Card className="border-0 shadow-xl rounded-2xl">
              <CardContent className="p-2">
                <Pagination>
                  <PaginationContent className="gap-1">
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(page - 1);
                        }}
                        className={`rounded-xl ${
                          page <= 1
                            ? "pointer-events-none opacity-50"
                            : "hover:bg-emerald-50 hover:text-emerald-700"
                        }`}
                      />
                    </PaginationItem>

                    {[...Array(paginationData.total_pages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(i + 1);
                          }}
                          isActive={page === i + 1}
                          className={`rounded-xl ${
                            page === i + 1
                              ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                              : "hover:bg-emerald-50 hover:text-emerald-700"
                          }`}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(page + 1);
                        }}
                        className={`rounded-xl ${
                          page >= paginationData.total_pages
                            ? "pointer-events-none opacity-50"
                            : "hover:bg-emerald-50 hover:text-emerald-700"
                        }`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
