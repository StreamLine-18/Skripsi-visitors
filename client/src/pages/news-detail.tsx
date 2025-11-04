import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { newsApi, type ApiResponse, type News } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User } from "lucide-react";

// === BASE CONFIG ===
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const SERVER_ROOT_URL = BASE_URL.endsWith("/api")
    ? BASE_URL.replace("/api", "")
    : BASE_URL;

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

const getFullImageUrl = (path: string) => {
    if (!SERVER_ROOT_URL || !path)
        return "https://placehold.co/1200x600/EEE/31343C?text=No+Image";
    if (path.startsWith("http")) return path;
    const clean = path.replace("/public", "");
    const normalized = clean.startsWith("/") ? clean.slice(1) : clean;
    return `${SERVER_ROOT_URL}/${normalized}`;
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
            {/* === HERO IMAGE === */}
            <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden ">
                <img
                    src={getFullImageUrl(news.image_url)}
                    alt={news.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 pb-14 md:pb-20 px-6 md:px-10">
                    <div className="max-w-5xl mx-auto space-y-4 text-white">
                        <Link href="/news">
                            <Button
                                size="sm"
                                className="bg-white/80 hover:bg-emerald-50 text-emerald-700 font-medium shadow-md backdrop-blur-md rounded-full px-6 border border-emerald-100 transition-all"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
                            </Button>
                        </Link>
                        <h1 className="text-3xl md:text-5xl font-bold leading-snug drop-shadow-xl">
                            {news.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-5 text-sm text-white/90">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 opacity-90" />
                                <span className="font-medium">{news.author_name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 opacity-90" />
                                <span>{formatDate(news.published_at)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* === CONTENT === */}
            <section className="max-w-4xl mx-auto px-4 -mt-10 md:-mt-20 relative z-10 pb-20">
                {/* Card hanya untuk desktop */}
                <div className="hidden md:block">
                    <Card className="border-0 shadow-xl rounded-3xl bg-white overflow-hidden mt-8">
                        <CardContent className="p-0">
                            {/* === ARTICLE TEXT === */}
                            <article className="px-6 py-10 md:px-12 md:py-14">
                                <div className="text-gray-700 text-lg leading-relaxed space-y-6">
                                    {news.content.split(/\r?\n/).map((p, i) => {
                                        const trimmed = p.trim();
                                        if (!trimmed) return null;

                                        // Paragraf pertama -> huruf awal besar
                                        if (i === 0) {
                                            const firstChar = trimmed.charAt(0);
                                            const rest = trimmed.slice(1);
                                            return (
                                                <p key={i} className="text-justify">
                                                    <span className="float-left text-5xl font-bold text-emerald-600 mr-3 leading-none">
                                                        {firstChar}
                                                    </span>
                                                    {rest}
                                                </p>
                                            );
                                        }

                                        // Paragraf lain -> normal
                                        return (
                                            <p key={i} className="text-justify">
                                                {trimmed}
                                            </p>
                                        );
                                    })}
                                </div>
                            </article>


                            {/* === FOOTER INFO === */}
                            <footer className="border-t border-gray-100 bg-gradient-to-br from-emerald-50/60 to-gray-50 px-6 py-8 md:px-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                        <User className="w-6 h-6 text-emerald-700" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Ditulis oleh</div>
                                        <div className="font-semibold text-gray-900">
                                            {news.author_name}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-sm text-gray-500 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-emerald-600" />
                                    <span>Diperbarui {formatDate(news.updated_on)}</span>
                                </div>
                            </footer>
                        </CardContent>
                    </Card>
                </div>

                {/* Flat layout untuk mobile */}
                <div className="block md:hidden mt-16 space-y-8">
                    <article className="text-gray-700 text-base leading-relaxed space-y-5 px-2">
                        {news.content.split(/\r?\n/).map((p, i) => {
                            const trimmed = p.trim();
                            if (!trimmed) return null;

                            if (i === 0) {
                                // paragraf pertama — kasih huruf besar
                                const firstChar = trimmed.charAt(0);
                                const rest = trimmed.slice(1);
                                return (
                                    <p key={i} className="text-justify">
                                        <span className="float-left text-4xl font-bold text-emerald-600 mr-2 leading-none">
                                            {firstChar}
                                        </span>
                                        {rest}
                                    </p>
                                );
                            }

                            // paragraf berikutnya normal
                            return (
                                <p key={i} className="text-justify">
                                    {trimmed}
                                </p>
                            );
                        })}
                    </article>


                    <div className="border-t border-gray-100 bg-gradient-to-br from-emerald-50/60 to-gray-50 px-4 py-6 rounded-2xl">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <User className="w-4 h-4 text-emerald-600" />
                                <span>{news.author_name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4 text-emerald-600" />
                                <span>{formatDate(news.updated_on)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA BUTTON */}
                <div className="mt-10 text-center">
                    <Link href="/news">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-full px-8 py-6 text-lg shadow-md transition-all">
                            Lihat Berita Lainnya
                        </Button>
                    </Link>
                </div>
            </section>

        </div>
    );
}
