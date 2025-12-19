import { Button } from "@/components/ui/button";
import { Home, Search, MapPin, Compass } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center">
          {/* 404 Illustration */}
          <div className="relative mb-8">
            <div className="text-[200px] md:text-[280px] font-bold text-emerald-100 leading-none select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                <Compass className="w-16 h-16 md:w-20 md:h-20 text-white" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Halaman Tidak Ditemukan
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
              Sepertinya Anda tersesat. Halaman yang Anda cari tidak ada atau telah dipindahkan.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-8 py-6 text-lg rounded-full shadow-xl w-full sm:w-auto"
              >
                <Home className="w-5 h-5 mr-2" />
                Kembali ke Beranda
              </Button>
            </Link>
            <Link href="/destinations">
              <Button 
                variant="outline"
                size="lg" 
                className="border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-semibold px-8 py-6 text-lg rounded-full w-full sm:w-auto"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Jelajahi Destinasi
              </Button>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Atau coba halaman Berikut:</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/news">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-emerald-600">
                  Berita
                </Button>
              </Link>
              <Link href="/events">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-emerald-600">
                  Event
                </Button>
              </Link>
              <Link href="/survey">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-emerald-600">
                  Survei
                </Button>
              </Link>
              <Link href="/complaint">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-emerald-600">
                  Pengaduan
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
