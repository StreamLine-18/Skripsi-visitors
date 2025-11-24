import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  User,
  Share2,
  Camera,
  Info,
} from "lucide-react";
import { eventApi, type ApiResponse, type Event } from "@/lib/api";

import { getFullImageUrl } from "@/lib/image-utils";

// --- Helper Functions ---

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

const getEventStatus = (eventDate: Date | string | null | undefined) => {
  if (!eventDate) return { text: "Unknown", color: "bg-gray-100 text-gray-700" };
  const now = new Date();
  const event = new Date(eventDate);
  const diffDays = Math.ceil((event.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays > 7) return { text: "Segera Hadir", color: "bg-emerald-100 text-emerald-700" };
  if (diffDays > 0) return { text: "Akan Datang", color: "bg-orange-100 text-orange-700" };
  if (diffDays === 0) return { text: "Hari Ini", color: "bg-red-100 text-red-700" };
  if (diffDays >= -3) return { text: "Berlangsung", color: "bg-yellow-100 text-yellow-700" };
  return { text: "Selesai", color: "bg-gray-100 text-gray-700" };
};

export default function EventDetail() {
  const { slug } = useParams();

  const {
    data: apiResponse,
    isLoading,
    error,
  } = useQuery<ApiResponse<Event>>({
    queryKey: ["event", slug],
    queryFn: () => eventApi.getEvent(slug || ""),
    enabled: !!slug,
  });

  const event = apiResponse?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white animate-pulse">
        <div className="bg-gray-200 h-[500px] w-full"></div>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="space-y-6">
            <div className="bg-gray-200 h-8 w-3/4 rounded"></div>
            <div className="bg-gray-200 h-4 w-full rounded"></div>
            <div className="bg-gray-200 h-4 w-2/3 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="max-w-md mx-4 shadow-xl">
          <CardContent className="p-8 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Event Tidak Ditemukan
            </h1>
            <p className="text-gray-600 mb-6">
              Maaf, event yang Anda cari tidak tersedia.
            </p>
            <Link href="/events">
              <Button className="bg-orange-600 hover:bg-orange-700">
                Lihat Semua Event
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const status = getEventStatus(event.event_date);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Image */}
      <div className="relative h-[500px] bg-gray-900">
        <img
          src={getFullImageUrl(event.image_url)}
          alt={event.title}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        {/* Navigation */}
        <div className="absolute top-0 left-0 right-0 p-4 md:p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/events">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Bagikan
            </Button>
          </div>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-2 mb-4">
              <Camera className="w-5 h-5 text-white" />
              <span className="text-white/90 text-sm font-medium uppercase tracking-wider">
                Event & Kegiatan
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span className="text-lg">
                  {formatDate(event.event_date)}
                </span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span className="text-lg">
                  {formatTime(event.event_date)}
                </span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">{event.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Event Content */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Info className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Tentang Event
                </h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <div
                  className="text-gray-700 leading-relaxed text-lg whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: event.content }}
                />
              </div>
            </section>

            {/* Event Details */}
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Detail Event
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-orange-100 bg-orange-50/30">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Tanggal & Waktu
                        </h4>
                        <p className="text-gray-700 mb-1">
                          {formatDate(event.event_date)}
                        </p>
                        <p className="text-gray-600 text-sm">
                          Pukul {formatTime(event.event_date)} WIB
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-100 bg-blue-50/30">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Lokasi
                        </h4>
                        <p className="text-gray-700">
                          {event.location}
                        </p>
                        <p className="text-gray-600 text-sm">
                          Taman Nasional Alas Purwo
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Author Info */}
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Informasi Penyelenggara
              </h3>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {event.author_name}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Dipublikasikan pada {formatDate(event.published_at)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Right Column - Event Info Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card className="shadow-xl border-0">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full mb-4">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {event.title}
                    </h3>
                    <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${status.color}`}>
                      {status.text}
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="border-t border-b border-gray-200 py-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Tanggal</span>
                        <span className="font-semibold text-gray-900">
                          {formatDate(event.event_date)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Waktu</span>
                        <span className="font-semibold text-gray-900">
                          {formatTime(event.event_date)} WIB
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Lokasi</span>
                        <span className="font-semibold text-gray-900 text-right">
                          {event.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* <Link href="/booking">
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold py-6 text-lg shadow-lg"
                    >
                      Daftar Sekarang
                    </Button>
                  </Link> */}

                  <p className="text-xs text-gray-500 text-center mt-4">
                    Pastikan Anda memiliki tiket masuk taman nasional
                  </p>
                </CardContent>
              </Card>

              {/* Additional Info Card */}
              <Card className="mt-6 border-amber-200 bg-amber-50/50">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Info className="w-4 h-4 mr-2 text-amber-600" />
                    Informasi Penting
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Harap datang 30 menit sebelum acara dimulai</li>
                    <li>• Bawa identitas diri yang masih berlaku</li>
                    <li>• Patuhi protokol kesehatan yang berlaku</li>
                    <li>• Hubungi penyelenggara jika ada pertanyaan</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Jelajahi Event Lainnya
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Temukan lebih banyak kegiatan menarik di Taman Nasional Alas Purwo
          </p>
          <Link href="/events">
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-orange-600 hover:bg-gray-100 border-0 font-semibold px-8 py-6 text-lg"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Lihat Semua Event
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}