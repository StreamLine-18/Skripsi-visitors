import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { newsApi, type ApiResponse, type News } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  User,
  Share2,
  Camera,
  Info,
  Newspaper,
} from "lucide-react";
import { getFullImageUrl } from "@/lib/image-utils";

// === HELPERS ===
const formatDate = (date: string | Date | undefined) => {
    if (!date) return "Tanggal tidak diketahui";
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return "Tanggal tidak diketahui";
    return d.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

// === MAIN COMPONENT ===
export default function NewsDetailPage() {
    const { id } = useParams();
    const { data: apiResponse, isLoading, error } = useQuery<ApiResponse<News>>({
        queryKey: ["newsDetail", id],
        queryFn: () => newsApi.getNewsById(id || ""),
        enabled: !!id,
    });

    const news = apiResponse?.data;

    if (isLoading)
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Memuat...
            </div>
        );

    if (error)
        return (
            <div className="min-h-screen flex items-center justify-center text-red-600">
                Gagal memuat data.
            </div>
        );

    if (!news) return null;

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section with Image */}
            <div className="relative h-[500px] bg-gray-900">
                <img
                    src={getFullImageUrl(news.image_url)}
                    alt={news.title}
                    className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                {/* Navigation */}
                <div className="absolute top-0 left-0 right-0 p-4 md:p-6">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <Link href="/news">
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
                                Berita Terkini
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                            {news.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-white/90">
                            <div className="flex items-center space-x-2">
                                <User className="w-5 h-5" />
                                <span className="text-lg">{news.author_name}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center space-x-2">
                                <Calendar className="w-5 h-5" />
                                <span className="text-lg">{formatDate(news.published_at)}</span>
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
                        {/* Article Content */}
                        <section>
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Info className="w-5 h-5 text-blue-600" />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                    Artikel Lengkap
                                </h2>
                            </div>
                            <div className="prose prose-lg max-w-none">
                                <div 
                                    className="text-gray-700 leading-relaxed text-lg"
                                    dangerouslySetInnerHTML={{ __html: news.content }}
                                />
                            </div>
                        </section>

                        {/* Author Info */}
                        <section>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Informasi Penulis
                            </h3>
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <User className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">
                                                {news.author_name}
                                            </h4>
                                            <p className="text-gray-600 text-sm mb-2">
                                                Penulis
                                            </p>
                                            <div className="flex items-center text-xs text-gray-500">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                <span>Dipublikasikan {formatDate(news.published_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>
                    </div>

                    {/* Right Column - News Info Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6">
                            <Card className="shadow-xl border-0">
                                <CardContent className="p-8">
                                    <div className="text-center mb-6">
                                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4">
                                            <Newspaper className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                            Berita Terkini
                                        </h3>
                                        <p className="text-gray-600">
                                            Informasi terbaru dari Taman Nasional Alas Purwo
                                        </p>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <div className="border-t border-b border-gray-200 py-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600">Penulis</span>
                                                <span className="font-semibold text-gray-900">
                                                    {news.author_name}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600">Tanggal</span>
                                                <span className="font-semibold text-gray-900">
                                                    {formatDate(news.published_at)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600">Status</span>
                                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                                    {news.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <Link href="/news">
                                        <Button
                                            size="lg"
                                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-6 text-lg shadow-lg"
                                        >
                                            Baca Berita Lainnya
                                        </Button>
                                    </Link>

                                    <p className="text-xs text-gray-500 text-center mt-4">
                                        Tetap terhubung dengan informasi terbaru
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Additional Info Card */}
                            <Card className="mt-6 border-amber-200 bg-amber-50/50">
                                <CardContent className="p-6">
                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                        <Info className="w-4 h-4 mr-2 text-amber-600" />
                                        Informasi Tambahan
                                    </h4>
                                    <ul className="space-y-2 text-sm text-gray-700">
                                        <li>• Artikel ini telah diverifikasi oleh tim editorial</li>
                                        <li>• Informasi dapat berubah sewaktu-waktu</li>
                                        <li>• Hubungi kami untuk informasi lebih lanjut</li>
                                        <li>• Bagikan artikel ini kepada teman Anda</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Jelajahi Berita Lainnya
                    </h2>
                    <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                        Dapatkan informasi terbaru dan berita menarik lainnya dari Taman Nasional Alas Purwo
                    </p>
                    <Link href="/news">
                        <Button
                            size="lg"
                            variant="outline"
                            className="bg-white text-blue-600 hover:bg-gray-100 border-0 font-semibold px-8 py-6 text-lg"
                        >
                            <Newspaper className="w-5 h-5 mr-2" />
                            Lihat Semua Berita
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
