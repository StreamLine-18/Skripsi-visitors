import { useQuery } from "@tanstack/react-query";
import { Play, Calendar, MapPin, Camera, Video, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import AttractionCard from "@/components/attraction-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Attraction, News, Gallery } from "@shared/schema";

export default function Home() {
  const { data: attractions, isLoading: attractionsLoading } = useQuery<Attraction[]>({
    queryKey: ["/api/attractions"],
  });

  const { data: news, isLoading: newsLoading } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  const { data: photos, isLoading: photosLoading } = useQuery<Gallery[]>({
    queryKey: ["/api/gallery/photos"],
  });

  const { data: videos, isLoading: videosLoading } = useQuery<Gallery[]>({
    queryKey: ["/api/gallery/videos"],
  });


  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('id-ID', {
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

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-br from-teal-600 via-green-600 to-emerald-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative h-full flex items-center justify-center text-center text-white p-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-hero-title">
              Selamat Datang di Alas Purwo
            </h1>
            <p className="text-lg md:text-xl mb-6 opacity-90" data-testid="text-hero-subtitle">
              Hutan Pertama Jawa - Jelajahi Keindahan Alam yang Menakjubkan
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/attractions" data-testid="link-explore-attractions">
                <Button 
                  size="lg" 
                  className="bg-white text-teal-700 hover:bg-gray-100 font-semibold"
                  data-testid="button-explore-attractions"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Jelajahi Destinasi
                </Button>
              </Link>
              <Link href="/gallery" data-testid="link-view-gallery">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-teal-700"
                  data-testid="button-view-gallery"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Lihat Galeri
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Berita Terkini */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900" data-testid="text-news-title">Berita Terkini</h2>
              <Link href="/news" data-testid="link-news-more">
                <Button variant="ghost" className="text-teal-600 font-medium text-sm p-0" data-testid="button-news-more">
                  Lainnya <ExternalLink className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            
            {newsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-xl h-32 mb-3"></div>
                    <div className="space-y-2">
                      <div className="bg-gray-200 h-3 w-20 rounded"></div>
                      <div className="bg-gray-200 h-4 w-full rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {news?.slice(0, 4).map((item) => (
                  <div key={item.id} className="group cursor-pointer" data-testid={`card-news-${item.id}`}>
                    <div className="relative overflow-hidden rounded-xl bg-gray-100 h-32 mb-3">
                      {item.imageUrl && (
                        <img 
                          src={item.imageUrl} 
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      <div className="absolute top-2 left-2">
                        <span className="text-xs bg-black/70 text-white px-2 py-1 rounded-full" data-testid={`text-news-date-${item.id}`}>
                          {formatDate(item.eventDate || item.publishDate)}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500" data-testid={`text-news-author-${item.id}`}>Oleh Admin Website</p>
                      <h3 className="font-semibold text-sm text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-2" data-testid={`text-news-title-${item.id}`}>
                        {item.title}
                      </h3>
                      <p className="text-xs text-teal-600 font-medium cursor-pointer" data-testid={`link-news-read-${item.id}`}>
                        selengkapnya →
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Galeri Foto */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900" data-testid="text-photo-gallery-title">Galeri Foto</h2>
              <Link href="/gallery" data-testid="link-photo-gallery-more">
                <Button variant="ghost" className="text-teal-600 font-medium text-sm p-0" data-testid="button-photo-gallery-more">
                  Lainnya <ExternalLink className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            
            {photosLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg h-24 md:h-28"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {photos?.slice(0, 6).map((photo) => (
                  <div key={photo.id} className="group cursor-pointer" data-testid={`img-photo-${photo.id}`}>
                    <div className="relative overflow-hidden rounded-lg bg-gray-100 h-24 md:h-28">
                      <img 
                        src={photo.thumbnailUrl || photo.url} 
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Galeri Video */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900" data-testid="text-video-gallery-title">Galeri Video</h2>
              <Link href="/gallery" data-testid="link-video-gallery-more">
                <Button variant="ghost" className="text-teal-600 font-medium text-sm p-0" data-testid="button-video-gallery-more">
                  Lainnya <ExternalLink className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            
            {videosLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-xl h-48"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videos?.slice(0, 2).map((video) => (
                  <div key={video.id} className="group cursor-pointer" data-testid={`video-${video.id}`}>
                    <div className="relative overflow-hidden rounded-xl bg-gray-100 h-48">
                      <img 
                        src={video.thumbnailUrl || video.url} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Play className="w-8 h-8 text-gray-700 ml-1" fill="currentColor" />
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-white font-semibold text-sm drop-shadow-lg" data-testid={`text-video-title-${video.id}`}>
                          {video.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Featured Attractions */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Destinasi Populer</h2>
              <Button variant="ghost" className="text-teal-600 font-medium text-sm p-0">
                Lihat Semua
              </Button>
            </div>
            
            {attractionsLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-xl h-48 mb-3"></div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <div className="bg-gray-200 h-4 w-20 rounded"></div>
                        <div className="bg-gray-200 h-4 w-12 rounded"></div>
                      </div>
                      <div className="bg-gray-200 h-3 w-full rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {attractions?.map((attraction) => (
                  <AttractionCard key={attraction.id} attraction={attraction} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Events */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900" data-testid="text-events-title">Event</h2>
              <Link href="/events" data-testid="link-events-more">
                <Button variant="ghost" className="text-teal-600 font-medium text-sm p-0" data-testid="button-events-more">
                  Lainnya <ExternalLink className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            
            {newsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex space-x-4 p-4 rounded-xl border border-gray-100">
                    <div className="w-20 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
                      <div className="bg-gray-200 h-3 w-full rounded"></div>
                      <div className="bg-gray-200 h-3 w-1/2 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {news?.filter(item => item.category === 'event').slice(0, 3).map((item) => {
                  const status = getEventStatus(item.eventDate);
                  return (
                    <div key={item.id} className="flex space-x-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors" data-testid={`card-event-${item.id}`}>
                      {item.imageUrl && (
                        <img 
                          src={item.imageUrl} 
                          alt={item.title}
                          className="w-20 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h3>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.summary}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-teal-600 font-medium">
                            {item.eventDate ? formatDate(item.eventDate) : formatDate(item.publishDate)}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>
                            {status.text}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
