import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowLeft, MapPin, Camera, Star } from "lucide-react";
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

import { getFullImageUrl } from "@/lib/image-utils";
import { formatDate, formatDateTimeFull as formatTime } from "@/lib/date-utils";

const getEventStatus = (eventDate: Date | string | null | undefined) => {
  if (!eventDate) return { text: "Unknown", color: "bg-gray-100 text-gray-700" };

  const now = new Date();
  const event = new Date(eventDate);

  // Normalize to midnight to avoid timezone + hour issues
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const eventDay = new Date(event.getFullYear(), event.getMonth(), event.getDate()).getTime();

  const diffDays = Math.floor((eventDay - today) / 86400000);

  if (diffDays > 7) return { text: "Segera Hadir", color: "text-emerald-700" };
  if (diffDays > 0) return { text: "Akan Datang", color: "text-teal-700" };
  if (diffDays === 0) return { text: "Hari Ini", color: "text-orange-700" };
  if (diffDays >= -3) return { text: "Berlangsung", color: "text-yellow-700" };
  return { text: "Selesai", color: "text-gray-700" };
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
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="relative h-[400px] bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
          <Link href="/" data-testid="link-back-home">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 mb-6 -ml-2 rounded-lg w-fit"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </Link>
          
          <div className="space-y-4 text-white">
            <div className="flex items-center space-x-2">
              <Camera className="w-6 h-6" />
              <span className="text-sm font-medium tracking-wider uppercase">Jangan Lewatkan</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight" data-testid="text-page-title">
              Event & Kegiatan<br />Taman Nasional Alas Purwo
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl" data-testid="text-page-subtitle">
              Ikuti berbagai kegiatan menarik dan event spesial yang diselenggarakan di kawasan konservasi
            </p>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Event Terbaru
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Bergabunglah dengan kegiatan edukatif dan rekreatif yang menginspirasi
          </p>
        </div>
                
        {/* Event List */}
        {events && events.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => {
              const status = getEventStatus(event.event_date);
              return (
                <Link key={event.id_event} href={`/events/${event.slug}`}>
                  <Card
                    className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-xl bg-white cursor-pointer"
                  >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={getFullImageUrl(event.image_url)}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    {/* Status Badge */}
                    <div className={`absolute top-4 right-4 backdrop-blur-sm text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center space-x-1 bg-gray-100 ${status.color}`}>
                      <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
                      <span>{status.text}</span>
                    </div>

                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">
                        {event.title}
                      </h3>
                      <div className="flex items-center text-white/90 text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{formatDate(event.event_date)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="p-5">
                    <div
                      className="text-gray-600 text-sm line-clamp-3 mb-4"
                      dangerouslySetInnerHTML={{ __html: event.content }}
                    ></div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1.5 text-orange-600" />
                        <span>{formatTime(event.event_date)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-1.5 text-orange-600" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center text-xs text-gray-500">
                        <span>Dipublikasikan</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 font-semibold -mr-2"
                      >
                        Info Lengkap
                      </Button>
                    </div>
                  </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <Card className="border-0 shadow-xl rounded-2xl">
            <CardContent className="p-16 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-12 h-12 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Belum Ada Event</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Event menarik dan kegiatan edukatif akan segera hadir untuk Anda ikuti.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {paginationData && paginationData.total_pages > 1 && (
          <div className="flex justify-center pt-12">
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardContent className="p-3">
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
                            : "hover:bg-orange-50 hover:text-orange-700"
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
                              ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg"
                              : "hover:bg-orange-50 hover:text-orange-700"
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
                            : "hover:bg-orange-50 hover:text-orange-700"
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

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Jangan Lewatkan Event Menarik
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Ikuti terus informasi terbaru tentang kegiatan dan event di Taman Nasional Alas Purwo
          </p>
          <Link href="/destinations">
            <Button
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-8 py-6 text-lg rounded-full shadow-xl"
            >
              Jelajahi Destinasi
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
