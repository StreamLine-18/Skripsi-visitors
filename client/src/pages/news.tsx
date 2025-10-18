import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { newsApi, type ApiResponse, type News } from "@/lib/api";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
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
  const pageSize = 5; // Tentukan berapa banyak item per halaman

  const { data: apiResponse, isLoading, error } = useQuery<ApiResponse<News[]>>({
    queryKey: ["news", page, pageSize], // Tambahkan page dan pageSize ke queryKey
    queryFn: () => newsApi.getAllNews({ page, pageSize }), // Panggil API dengan parameter paginasi
  });
  console.log("API Response:", apiResponse);

  const news = apiResponse?.data;
  const paginationData = apiResponse?.pagination;

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && (!paginationData || newPage <= paginationData.total_pages)) {
      setPage(newPage);
      window.scrollTo(0, 0); // Scroll ke atas saat ganti halaman
    }
  };


  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <div className="animate-pulse">
          <div className="bg-gray-200 rounded-2xl h-32 mb-6"></div>
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-48"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <Card>
          <CardContent className="p-6 text-center text-red-600">
            <h2 className="text-lg font-semibold">Gagal Memuat Data</h2>
            <p>{error.message}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/" data-testid="link-back-home">
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900" data-testid="text-page-title">
                Berita Terkini
              </h1>
              <p className="text-gray-600" data-testid="text-page-subtitle">
                Informasi dan perkembangan terbaru dari Taman Nasional Alas Purwo
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* News Articles */}
      <div className="space-y-6">
        {news && news.length > 0 ? (
          news.map((article) => (
            <Card key={article.id_news} className="hover:shadow-lg transition-shadow" data-testid={`card-news-${article.id_news}`}>
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* --- MULAI PERUBAHAN --- */}
                  {article.image_url && (
                    <div className="md:w-1/3 lg:w-1/4 flex-shrink-0">
                      <div className="aspect-video md:aspect-square relative">
                        <img
                          src={getFullImageUrl(article.image_url)}
                          alt={article.title}
                          className="absolute h-full w-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
                          data-testid={`img-news-${article.id_news}`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span data-testid={`text-news-date-${article.id_news}`}>
                            {formatDate(article.published_at)}
                          </span>
                        </div>

                        <div className="flex items-center text-sm text-gray-500">
                          <User className="w-4 h-4 mr-1" />
                          <span data-testid={`text-news-author-${article.id_news}`}>
                            {article.author_name}
                          </span>
                        </div>
                      </div>

                      <h2
                        className="text-xl font-bold text-gray-900 mb-3"
                        data-testid={`text-news-title-${article.id_news}`}
                      >
                        {article.title}
                      </h2>

                      <p
                        className="text-gray-600 mb-4 line-clamp-3"
                        data-testid={`text-news-summary-${article.id_news}`}
                      >
                        {stripHtml(article.content)}
                      </p>
                    </div>

                    {/* Bagian ini selalu di bawah */}
                    <div className="pt-4 border-t border-gray-100 mt-4">
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>Diperbarui pada {formatDate(article.updated_on)}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          // Empty State
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Calendar className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Belum Ada Berita</h3>
              <p className="text-gray-500">Berita terbaru akan ditampilkan di halaman ini.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination Controls */}
      {paginationData && paginationData.total_pages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => { e.preventDefault(); handlePageChange(page - 1); }}
                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {/* Logic to render page numbers could be more complex, this is a simple version */}
            {[...Array(paginationData.total_pages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }}
                  isActive={page === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => { e.preventDefault(); handlePageChange(page + 1); }}
                className={page >= paginationData.total_pages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

