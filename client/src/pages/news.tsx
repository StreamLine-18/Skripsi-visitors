import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import type { News } from "@shared/schema";

export default function NewsPage() {
  const { data: news, isLoading } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getEventStatus = (eventDate: Date | string | null) => {
    if (!eventDate) return { text: "Tidak diketahui", color: "bg-gray-100 text-gray-700" };
    
    const now = new Date();
    const event = new Date(eventDate);
    const diffTime = event.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return { text: "Akan Datang", color: "bg-blue-100 text-blue-700" };
    } else if (diffDays === 0) {
      return { text: "Hari Ini", color: "bg-orange-100 text-orange-700" };
    } else if (diffDays >= -3) {
      return { text: "Berlangsung", color: "bg-orange-100 text-orange-700" };
    } else {
      return { text: "Selesai", color: "bg-green-100 text-green-700" };
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <div className="animate-pulse">
          <div className="bg-gray-200 rounded-2xl h-32 mb-6"></div>
          <div className="space-y-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-48"></div>
            ))}
          </div>
        </div>
      </div>
    );
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
        {news?.map((article) => {
          const status = getEventStatus(article.eventDate);
          return (
            <Card key={article.id} className="hover:shadow-lg transition-shadow" data-testid={`card-news-${article.id}`}>
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  {article.imageUrl && (
                    <div className="md:w-1/3 lg:w-1/4">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-48 md:h-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-t-none"
                        data-testid={`img-news-${article.id}`}
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-6 flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span data-testid={`text-news-date-${article.id}`}>
                          {formatDate(article.eventDate || article.publishDate)}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="w-4 h-4 mr-1" />
                        <span data-testid={`text-news-author-${article.id}`}>Admin Website</span>
                      </div>

                      {article.eventDate && (
                        <span 
                          className={`text-xs px-2 py-1 rounded-full ${status.color}`}
                          data-testid={`status-news-${article.id}`}
                        >
                          {status.text}
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-3" data-testid={`text-news-title-${article.id}`}>
                      {article.title}
                    </h2>

                    <p className="text-gray-600 mb-4" data-testid={`text-news-summary-${article.id}`}>
                      {article.summary}
                    </p>

                    <div className="text-sm text-gray-700 leading-relaxed" data-testid={`text-news-content-${article.id}`}>
                      {article.content}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>Dipublikasikan {formatDate(article.publishDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {news && news.length === 0 && (
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
  );
}