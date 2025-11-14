import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Compass, ArrowLeft, Star, Clock, Camera } from "lucide-react";
import { Link } from "wouter";
import { destinationApi, type ApiResponse } from "@/lib/api";

// --- Environment Variables ---
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const SERVER_ROOT_URL = BASE_URL.endsWith('/api') ? BASE_URL.replace('/api', '') : BASE_URL;

// --- Helper Functions ---
const getFullImageUrl = (relativePath: string): string => {
    if (!SERVER_ROOT_URL || !relativePath)
        return "https://placehold.co/600x400/EEE/31343C?text=No+Image";
    if (relativePath.startsWith("http")) return relativePath;
    const cleanedPath = relativePath.replace("/public", "");
    const finalPath = cleanedPath.startsWith("/") ? cleanedPath.slice(1) : cleanedPath;
    return `${SERVER_ROOT_URL}/${finalPath}`;
};

export default function DestinationsPage() {
    const { data: apiResponse, isLoading, error } = useQuery<ApiResponse<any[]>>({
        queryKey: ["destinations"],
        queryFn: () => destinationApi.getAllDestination(),
    });

    const destinations = apiResponse?.data || [];

    if (isLoading)
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 animate-pulse">
                <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
                    <div className="bg-gray-200 rounded-3xl h-32 w-1/3"></div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-gray-200 h-60 rounded-3xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );

    if (error)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="max-w-md text-center shadow-xl border-0 rounded-3xl p-8">
                    <p className="text-red-600 font-semibold">Gagal memuat destinasi 😢</p>
                    <p className="text-gray-600">{error.message}</p>
                </Card>
            </div>
        );

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Banner */}
            <div className="relative h-[400px] bg-gradient-to-r from-emerald-600 via-green-600 to-cyan-600 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920')] bg-cover bg-center opacity-20"></div>
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
                            <span className="text-sm font-medium tracking-wider uppercase">Jelajahi Keindahan</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold leading-tight" data-testid="text-page-title">
                            Destinasi Wisata<br />Taman Nasional Alas Purwo
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 max-w-2xl" data-testid="text-page-subtitle">
                            Temukan pesona alam yang menakjubkan dan pengalaman tak terlupakan di setiap sudut Alas Purwo
                        </p>
                    </div>
                </div>
            </div>

            {/* Destinations Section */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Destinasi Populer
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Pilih destinasi favorit Anda dan mulai petualangan yang tak terlupakan
                    </p>
                </div>

                {/* Destinations Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {destinations.map((d) => (
                        <Link key={d.id_destination} href={`/destination/${d.slug}`}>
                            <Card
                                className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-xl bg-white cursor-pointer"
                            >
                                {/* Image */}
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={getFullImageUrl(d.image_url)}
                                        alt={d.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                                    
                                    {/* Badge */}
                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center space-x-1">
                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                        <span>Populer</span>
                                    </div>

                                    {/* Title Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-5">
                                        <h3 className="text-xl font-bold text-white mb-1 line-clamp-2">
                                            {d.name}
                                        </h3>
                                        <div className="flex items-center text-white/90 text-sm">
                                            <MapPin className="w-4 h-4 mr-1" />
                                            <span>Pintu {d.gate?.name || "-"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <CardContent className="p-5">
                                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                        {d.summary}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Clock className="w-4 h-4 mr-1.5" />
                                            <span>Buka Setiap Hari</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 font-semibold -mr-2"
                                        >
                                            Lihat Detail
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Empty State */}
                {destinations.length === 0 && (
                    <Card className="border-0 shadow-xl rounded-2xl">
                        <CardContent className="p-16 text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Compass className="w-12 h-12 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Belum Ada Destinasi</h3>
                            <p className="text-gray-600 max-w-md mx-auto">
                                Destinasi wisata yang menakjubkan akan segera hadir untuk Anda jelajahi.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Call to Action Section */}
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Siap Memulai Petualangan?
                    </h2>
                    <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                        Pesan tiket Anda sekarang dan nikmati keindahan alam Taman Nasional Alas Purwo
                    </p>
                    <Link href="/booking">
                        <Button
                            size="lg"
                            className="bg-white text-emerald-600 hover:bg-gray-100 font-semibold px-8 py-6 text-lg rounded-full shadow-xl"
                        >
                            Pesan Tiket Sekarang
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
