import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, Compass, ArrowLeft, Newspaper, TrendingUp, Landmark, Sunrise, Sunset, Mountain, CompassIcon } from "lucide-react";
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
                                            <CompassIcon className="w-6 h-6 text-white" />
                                        </div>
                                        {/* <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-100 to-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                                            Terbaru
                                        </span> */}
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900" data-testid="text-page-title">
                                        Destinasi Wisata
                                    </h1>
                                    <p className="text-gray-600 text-base md:text-lg max-w-2xl" data-testid="text-page-subtitle">
                                        Temukan Destinasi Menarik di Alas Purwo
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

                {/* Destinations Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {destinations.map((d) => (
                        <Card
                            key={d.id_destination}
                            className="group flex flex-col overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-500 rounded-2xl bg-white"
                            style={{ height: "360px" }} // fixed card height
                        >
                            {/* Image */}
                            <div className="relative h-40 overflow-hidden flex-shrink-0">
                                <img
                                    src={getFullImageUrl(d.image_url)}
                                    alt={d.name}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute top-3 left-3 bg-white/90 text-gray-800 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                                    {d.gate?.name ? `Pintu ${d.gate.name}` : "Tanpa Pintu"}
                                </div>
                            </div>

                            {/* Content */}
                            <CardContent className="flex flex-col justify-between flex-1 p-5">
                                <div className="space-y-2">
                                    <h2 className="text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                                        {d.name}
                                    </h2>
                                    <p className="text-gray-600 text-sm line-clamp-2">{d.summary}</p>
                                </div>

                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <MapPin className="w-4 h-4 mr-1 text-emerald-600" />
                                        {`Pintu ${d.gate?.name || "-"}`}
                                    </div>
                                    <Button
                                        variant="link"
                                        size="sm"
                                        className="text-emerald-600 hover:text-emerald-700 font-medium p-0"
                                    >
                                        Detail →
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Empty State */}
                {destinations.length === 0 && (
                    <Card className="border-0 shadow-xl rounded-3xl">
                        <CardContent className="p-16 text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <Compass className="w-10 h-10 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Belum Ada Destinasi</h3>
                            <p className="text-gray-600 max-w-md mx-auto">
                                Destinasi populer akan segera ditampilkan di halaman ini.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
