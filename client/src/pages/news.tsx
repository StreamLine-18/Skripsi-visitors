import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowLeft, Newspaper, Camera, Star } from "lucide-react";
import { Link } from "wouter";
import { newsApi, type ApiResponse, type News } from "@/lib/api";
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

const stripHtml = (html: string): string => {
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  } catch (e) {
    return html;
  }
};

export default function NewsPage() {
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const { data: apiResponse, isLoading, error } = useQuery<ApiResponse<News[]>>({
    queryKey: ["news", page, pageSize],
    queryFn: () => newsApi.getAllNews({ page, pageSize }),
  });

  const news = apiResponse?.data;
  const paginationData = apiResponse?.pagination;

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && (!paginationData || newPage <= paginationData.total_pages)) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
          <div className="animate-pulse">
            <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl h-32 md:h-40 mb-6 md:mb-8"></div>
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl h-80"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-0 shadow-xl rounded-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Newspaper className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Gagal Memuat Data</h2>
            <p className="text-gray-600">{error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const featuredNews = news?.[0];
  const regularNews = news?.slice(1);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="relative h-[400px] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920')] bg-cover bg-center opacity-20"></div>
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
              <span className="text-sm font-medium tracking-wider uppercase">Tetap Terhubung</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight" data-testid="text-page-title">
              Berita & Informasi<br />Taman Nasional Alas Purwo
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl" data-testid="text-page-subtitle">
              Dapatkan informasi terkini tentang perkembangan, kegiatan, dan berita penting dari kawasan konservasi
            </p>
          </div>
        </div>
      </div>

      {/* News Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Berita Terbaru
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Ikuti perkembangan terbaru dan informasi penting dari Taman Nasional Alas Purwo
          </p>
        </div>

        {/* Featured News Card (First Article) */}
        {featuredNews && (
          <Link href={`/news/${featuredNews.id_news}`}>
            <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl mb-12 cursor-pointer" data-testid={`card-news-${featuredNews.id_news}`}>
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Image Section */}
                  <div className="relative overflow-hidden aspect-video md:aspect-auto">
                    <img
                      src={getFullImageUrl(featuredNews.image_url)}
                      alt={featuredNews.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      data-testid={`img-news-${featuredNews.id_news}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center space-x-1">
                        <Star className="w-3 h-3 text-blue-500 fill-blue-500" />
                        <span>Berita Utama</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8 md:p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <div className="flex items-center text-sm text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                          <Calendar className="w-3.5 h-3.5 mr-1.5" />
                          <span data-testid={`text-news-date-${featuredNews.id_news}`}>
                            {formatDate(featuredNews.published_at)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="w-3.5 h-3.5 mr-1.5" />
                          <span data-testid={`text-news-author-${featuredNews.id_news}`}>
                            {featuredNews.author_name}
                          </span>
                        </div>
                      </div>

                      <h2
                        className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors"
                        data-testid={`text-news-title-${featuredNews.id_news}`}
                      >
                        {featuredNews.title}
                      </h2>

                      <p
                        className="text-gray-600 mb-6 line-clamp-4 leading-relaxed"
                        data-testid={`text-news-summary-${featuredNews.id_news}`}
                      >
                        {stripHtml(featuredNews.content)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3.5 h-3.5 mr-1.5" />
                        <span>Diperbarui {formatDate(featuredNews.updated_on)}</span>
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
                        Baca Selengkapnya
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}

        {/* Regular News Grid */}
        {regularNews && regularNews.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularNews.map((article) => (
              <Link key={article.id_news} href={`/news/${article.id_news}`}>
                <Card
                  className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-xl bg-white cursor-pointer"
                  data-testid={`card-news-${article.id_news}`}
                >
                  <CardContent className="p-0">
                    {/* Image */}
                    {article.image_url && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={getFullImageUrl(article.image_url)}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          data-testid={`img-news-${article.id_news}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                        
                        {/* Date Badge */}
                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                          {formatDate(article.published_at)}
                        </div>

                        {/* Title Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">
                            {article.title}
                          </h3>
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-5">
                      <p
                        className="text-gray-600 text-sm line-clamp-3 mb-4"
                        data-testid={`text-news-summary-${article.id_news}`}
                      >
                        {stripHtml(article.content)}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center text-xs text-gray-500">
                          <User className="w-3 h-3 mr-1.5" />
                          <span data-testid={`text-news-author-${article.id_news}`}>
                            {article.author_name}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold -mr-2"
                        >
                          Baca Selengkapnya
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {(!news || news.length === 0) && (
          <Card className="border-0 shadow-xl rounded-2xl">
            <CardContent className="p-16 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Newspaper className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Belum Ada Berita</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Berita terbaru dan informasi penting akan segera hadir untuk Anda.
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
                        onClick={(e) => { e.preventDefault(); handlePageChange(page - 1); }}
                        className={`rounded-xl ${page <= 1 ? "pointer-events-none opacity-50" : "hover:bg-blue-50 hover:text-blue-700"}`}
                      />
                    </PaginationItem>

                    {[...Array(paginationData.total_pages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }}
                          isActive={page === i + 1}
                          className={`rounded-xl ${page === i + 1 ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" : "hover:bg-blue-50 hover:text-blue-700"}`}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => { e.preventDefault(); handlePageChange(page + 1); }}
                        className={`rounded-xl ${page >= paginationData.total_pages ? "pointer-events-none opacity-50" : "hover:bg-blue-50 hover:text-blue-700"}`}
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
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Tetap Terhubung dengan Kami
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Dapatkan informasi terbaru tentang kegiatan dan perkembangan di Taman Nasional Alas Purwo
          </p>
          <Link href="/destinations">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-6 text-lg rounded-full shadow-xl"
            >
              Jelajahi Destinasi
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}