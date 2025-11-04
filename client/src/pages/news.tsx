import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowLeft, Newspaper, TrendingUp } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
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
                      <Newspaper className="w-6 h-6 text-white" />
                    </div>
                    {/* <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-100 to-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                      Terbaru
                    </span> */}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900" data-testid="text-page-title">
                    Berita Terkini
                  </h1>
                  <p className="text-gray-600 text-base md:text-lg max-w-2xl" data-testid="text-page-subtitle">
                    Informasi dan perkembangan terbaru dari Taman Nasional Alas Purwo
                  </p>
                </div>

                <div className="hidden md:block">
                  {/* <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-100 rounded-2xl flex items-center justify-center shadow-md">
                    <TrendingUp className="w-8 h-8 text-emerald-600" />
                  </div> */}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured News Card (First Article) */}
        {featuredNews && (
          <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl" data-testid={`card-news-${featuredNews.id_news}`}>
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
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full shadow-lg">
                      Berita Terbaru
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 md:p-10 flex flex-col justify-between bg-gradient-to-br from-white to-emerald-50/30">
                  <div>
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <div className="flex items-center text-sm text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
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
                      className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight"
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
                    <Link href={`/news/${featuredNews.id_news}`}>
                      <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6">
                        Baca Selengkapnya
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Regular News Grid */}
        {regularNews && regularNews.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {regularNews.map((article) => (
              <Card
                key={article.id_news}
                className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl bg-white"
                data-testid={`card-news-${article.id_news}`}
              >
                <CardContent className="p-0">
                  {/* Image */}
                  {article.image_url && (
                    <div className="relative overflow-hidden aspect-video">
                      <img
                        src={getFullImageUrl(article.image_url)}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        data-testid={`img-news-${article.id_news}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <div className="flex items-center text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span data-testid={`text-news-date-${article.id_news}`}>
                          {formatDate(article.published_at)}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <User className="w-3 h-3 mr-1" />
                        <span data-testid={`text-news-author-${article.id_news}`}>
                          {article.author_name}
                        </span>
                      </div>
                    </div>

                    <h3
                      className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors"
                      data-testid={`text-news-title-${article.id_news}`}
                    >
                      {article.title}
                    </h3>

                    <p
                      className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed"
                      data-testid={`text-news-summary-${article.id_news}`}
                    >
                      {stripHtml(article.content)}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center text-xs text-gray-400">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>Diperbarui {formatDate(article.updated_on)}</span>
                      </div>
                      <Link href={`/news/${article.id_news}`}>
                                            <Button
                        variant="ghost"
                        size="sm"
                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full px-4"
                      >
                        Baca →
                      </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {(!news || news.length === 0) && (
          <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
            <CardContent className="p-16 text-center bg-gradient-to-br from-gray-50 to-emerald-50/30">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Newspaper className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Belum Ada Berita</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Berita terbaru akan ditampilkan di halaman ini. Nantikan informasi menarik dari kami!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Modern Pagination */}
        {paginationData && paginationData.total_pages > 1 && (
          <div className="flex justify-center pt-8">
            <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
              <CardContent className="p-2">
                <Pagination>
                  <PaginationContent className="gap-1">
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => { e.preventDefault(); handlePageChange(page - 1); }}
                        className={`rounded-xl ${page <= 1 ? "pointer-events-none opacity-50" : "hover:bg-emerald-50 hover:text-emerald-700"}`}
                      />
                    </PaginationItem>

                    {[...Array(paginationData.total_pages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }}
                          isActive={page === i + 1}
                          className={`rounded-xl ${page === i + 1 ? "bg-gradient-to-r from-emerald-600 to-emerald-600 text-white shadow-lg" : "hover:bg-emerald-50 hover:text-emerald-700"}`}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => { e.preventDefault(); handlePageChange(page + 1); }}
                        className={`rounded-xl ${page >= paginationData.total_pages ? "pointer-events-none opacity-50" : "hover:bg-emerald-50 hover:text-emerald-700"}`}
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