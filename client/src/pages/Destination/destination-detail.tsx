import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MapPin,
  Compass,
  Camera,
  Info,
  Ticket,
  Share2,
} from "lucide-react";
import { destinationApi, type ApiResponse, type Destination } from "@/lib/api";

import { getFullImageUrl } from "@/lib/image-utils";

export default function AttractionDetail() {
  const { slug } = useParams();

  const {
    data: apiResponse,
    isLoading,
    error,
  } = useQuery<ApiResponse<Destination>>({
    queryKey: ["destination"],
    queryFn: () => destinationApi.getDestination(slug || ""),
    enabled: !!slug,
  });

  const destination = apiResponse?.data;

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

  if (error || !destination) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="max-w-md mx-4 shadow-xl">
          <CardContent className="p-8 text-center">
            <Compass className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Destinasi Tidak Ditemukan
            </h1>
            <p className="text-gray-600 mb-6">
              Maaf, destinasi yang Anda cari tidak tersedia.
            </p>
            <Link href="/destinations">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Lihat Semua Destinasi
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Image */}
      <div className="relative h-[500px] bg-gray-900">
        <img
          src={getFullImageUrl(destination.image_url)}
          alt={destination.name}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        {/* Navigation */}
        <div className="absolute top-0 left-0 right-0 p-4 md:p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/destinations">
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
                Destinasi Wisata
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              {destination.name}
            </h1>
            <div className="flex items-center space-x-4 text-white/90">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">
                  Pintu {destination.gate?.name || "-"}
                </span>
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
            {/* Description Section */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Info className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Tentang Destinasi
                </h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <div 
                  className="text-gray-700 leading-relaxed text-lg"
                  dangerouslySetInnerHTML={{ __html: destination.description || destination.summary || "" }}
                />
              </div>
            </section>

            {/* Features Section */}
            {destination.features && (
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Fitur Unggulan
                </h3>
                <Card className="border-emerald-100 bg-emerald-50/30">
                  <CardContent className="p-6">
                    <div 
                      className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: destination.features }}
                    />
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Facilities Section */}
            {destination.facilities && (
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Fasilitas Tersedia
                </h3>
                <Card className="border-blue-100 bg-blue-50/30">
                  <CardContent className="p-6">
                    <div 
                      className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: destination.facilities }}
                    />
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Location Info */}
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Informasi Lokasi
              </h3>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Akses Melalui Pintu {destination.gate?.name || "-"}
                      </h4>
                      <p className="text-gray-600">
                        Destinasi ini dapat diakses melalui Pintu{" "}
                        {destination.gate?.name || "-"} Taman Nasional Alas
                        Purwo. Pastikan Anda membawa tiket masuk yang valid.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card className="shadow-xl border-0">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full mb-4">
                      <Ticket className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Pesan Tiket
                    </h3>
                    <p className="text-gray-600">
                      Nikmati pengalaman tak terlupakan di destinasi ini
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="bg-emerald-50 rounded-lg p-4 text-center">
                      <p className="text-sm text-emerald-700 font-medium mb-1">
                        Harga Tiket Masuk
                      </p>
                      <p className="text-xs text-emerald-600">
                        Sudah termasuk akses ke destinasi ini
                      </p>
                    </div>

                    <div className="border-t border-b border-gray-200 py-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Status</span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          {destination.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Pintu Masuk</span>
                        <span className="font-semibold text-gray-900">
                          {destination.gate?.name || "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link href="/booking">
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-6 text-lg shadow-lg"
                    >
                      Pesan Tiket Sekarang
                    </Button>
                  </Link>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    Dengan memesan, Anda menyetujui syarat dan ketentuan yang
                    berlaku
                  </p>
                </CardContent>
              </Card>

              {/* Additional Info Card */}
              <Card className="mt-6 border-amber-200 bg-amber-50/50">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Info className="w-4 h-4 mr-2 text-amber-600" />
                    Tips Berkunjung
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Datang lebih awal untuk menghindari keramaian</li>
                    <li>• Bawa kamera untuk mengabadikan momen</li>
                    <li>• Gunakan pakaian dan alas kaki yang nyaman</li>
                    <li>• Jaga kebersihan dan kelestarian alam</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Jelajahi Destinasi Lainnya
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Masih banyak keindahan alam yang menunggu untuk Anda eksplorasi
          </p>
          <Link href="/destinations">
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-emerald-600 hover:bg-gray-100 border-0 font-semibold px-8 py-6 text-lg"
            >
              <Compass className="w-5 h-5 mr-2" />
              Lihat Semua Destinasi
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
