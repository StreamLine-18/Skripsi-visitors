import { useQuery } from "@tanstack/react-query";
import { Ticket, FileText, Clock, MapPin, Camera, Video, ExternalLink, AlertTriangle, BarChart3, Megaphone, Calendar, User } from "lucide-react";
import { Link } from "wouter";
import DestinationCard from "@/components/destination-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  newsApi,
  eventApi,
  type ApiResponse,
  type News,
  type Event,
  Destination,
  destinationApi,
} from "@/lib/api"; // Mengimpor semua dari api.ts yang telah kita siapkan

// --- Environment Variable & Helper Functions ---
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
// Dapatkan root URL server dengan menghapus '/api' jika ada
const SERVER_ROOT_URL = BASE_URL.endsWith('/api') ? BASE_URL.replace('/api', '') : BASE_URL;


const formatDate = (date: Date | string | undefined) => {
  if (!date) return 'Tanggal tidak diketahui';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Tanggal tidak valid';
  return d.toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
};

const getFullImageUrl = (relativePath: string): string => {

  if (!SERVER_ROOT_URL || !relativePath) {
    console.error('[DEBUG] Gagal membuat URL gambar: SERVER_ROOT_URL atau relativePath kosong.');
    return 'https://placehold.co/600x400/EEE/31343C?text=URL+Error';
  }
  if (relativePath.startsWith('http')) {
    return relativePath;
  }

  // Menggunakan logika yang Anda berikan: hapus '/public' dari path
  const cleanedPath = relativePath.replace('/public', '');
  // Pastikan tidak ada garis miring di awal path agar tidak jadi '//'
  const finalPath = cleanedPath.startsWith('/') ? cleanedPath.slice(1) : cleanedPath;

  const fullUrl = `${SERVER_ROOT_URL}/${finalPath}`;


  return fullUrl;
};

const stripHtml = (html: string): string => {
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  } catch (e) {
    return html;
  }
};

const getEventStatus = (eventDate: Date | string | null | undefined) => {
  if (!eventDate) return { text: "Unknown", color: "bg-gray-100 text-gray-700" };
  const now = new Date();
  const event = new Date(eventDate);
  if (isNaN(event.getTime())) return { text: "Invalid Date", color: "bg-red-100 text-red-700" };
  const diffTime = event.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 0) return { text: "Akan Datang", color: "bg-blue-100 text-blue-700" };
  if (diffDays === 0) return { text: "Hari Ini", color: "bg-orange-100 text-orange-700" };
  if (diffDays >= -3) return { text: "Berlangsung", color: "bg-orange-100 text-orange-700" };
  return { text: "Selesai", color: "bg-green-100 text-green-700" };
};

// --- Section Components ---

function HeroSection() {
  return (
    <div className="relative h-screen overflow-hidden">
      <img
        src="/assets/hero.png"
        alt="Alas Purwo"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>

      <div className="relative h-full flex items-center justify-center text-center text-white px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-tight drop-shadow-2xl">
              Taman Nasional
            </h1>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-tight drop-shadow-2xl">
              Alas Purwo
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8 opacity-95 drop-shadow-lg max-w-4xl mx-auto leading-relaxed">
              Hutan Pertama di Pulau Jawa — Jelajahi Keindahan Alam yang Menakjubkan dan Keanekaragaman Hayati yang Luar Biasa
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/destinations">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-xl px-8 py-6 text-lg rounded-full w-full sm:w-auto border-0"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Jelajahi Destinasi
              </Button>
            </Link>
            <Link href="/booking">
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 font-semibold shadow-xl px-8 py-6 text-lg rounded-full w-full sm:w-auto"
              >
                <Ticket className="w-5 h-5 mr-2" />
                Pesan Tiket
              </Button>
            </Link>
          </div>

          {/* <div className="flex justify-center space-x-8 text-white/80 text-sm">
            <div className="text-center">
              <div className="font-bold text-2xl">50+</div>
              <div>Destinasi</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl">24/7</div>
              <div>Akses</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl">100%</div>
              <div>Aman</div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}



function NewsSection() {
  const { data: apiResponse, isLoading, error } = useQuery<ApiResponse<News[]>>({
    queryKey: ['news'],
    queryFn: newsApi.getAllNews
  });

  const news = apiResponse?.data;
  const featuredNews = news?.[0];
  const secondaryNews = news?.slice(1, 4);

  if (error) return (
    <Card className="border-0 shadow-lg rounded-2xl">
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-red-600" />
        </div>
        <p className="text-gray-700 font-medium">Tidak dapat memuat berita saat ini</p>
        <p className="text-gray-500 text-sm mt-2">Silakan coba lagi nanti</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Berita Terkini</h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Dapatkan informasi terbaru dan perkembangan dari Taman Nasional Alas Purwo
        </p>
      </div>

      <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Informasi Terbaru</h3>
            </div>
            <Link href="/news">
              <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold">
                Lihat Semua <ExternalLink className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="animate-pulse">
                <div className="bg-gray-200 rounded-2xl h-72 mb-4"></div>
                <div className="space-y-3">
                  <div className="bg-gray-200 h-4 w-1/4 rounded"></div>
                  <div className="bg-gray-200 h-6 w-3/4 rounded"></div>
                  <div className="bg-gray-200 h-4 w-full rounded"></div>
                </div>
              </div>
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-4">
                    <div className="bg-gray-200 rounded-xl h-20 w-20"></div>
                    <div className="flex-1 space-y-2">
                      <div className="bg-gray-200 h-3 w-1/4 rounded"></div>
                      <div className="bg-gray-200 h-4 w-full rounded"></div>
                      <div className="bg-gray-200 h-3 w-1/2 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) :
            !news || news.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg">Belum ada berita terbaru.</p>
              </div>
            ) :
              (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {featuredNews && (
                    <Link href={`/news/${featuredNews.id_news}`}>
                      <div className="group cursor-pointer">
                        <div className="relative overflow-hidden rounded-2xl bg-gray-100 mb-4">
                          <img
                            src={getFullImageUrl(featuredNews.image_url)}
                            alt={featuredNews.title}
                            className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400/EEE/31343C?text=Error')}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                          <div className="absolute top-4 right-4">
                            <span className="bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                              Berita Utama
                            </span>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-6">
                            <div className="text-white/90 text-sm mb-2 flex items-center space-x-2">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(featuredNews.published_at)}</span>
                            </div>
                            <h3 className="font-bold text-xl text-white mb-2 leading-tight group-hover:text-blue-200 transition-colors">
                              {featuredNews.title}
                            </h3>
                            <p className="text-white/80 text-sm">Oleh {featuredNews.author_name}</p>
                          </div>
                        </div>
                        <p className="text-gray-600 line-clamp-3 leading-relaxed">{stripHtml(featuredNews.content)}</p>
                      </div>
                    </Link>
                  )}
                  <div className="space-y-6">
                    {secondaryNews?.map((item) => (
                      <Link key={item.id_news} href={`/news/${item.id_news}`}>
                        <div className="group cursor-pointer flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                          <img
                            src={getFullImageUrl(item.image_url)}
                            alt={item.title}
                            className="w-24 h-20 object-cover rounded-xl flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => (e.currentTarget.src = 'https://placehold.co/96x80/EEE/31343C?text=Error')}
                          />
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full w-fit">
                              <Calendar className="w-3 h-3 mr-1" />
                              <span>{formatDate(item.published_at)}</span>
                            </div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                              {item.title}
                            </h3>
                            <p className="text-xs text-gray-500 flex items-center">
                              <User className="w-3 h-3 mr-1" />
                              {item.author_name}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
        </CardContent>
      </Card>
    </div>
  );
}


// function PhotoGallerySection() {
//   const { data: apiResponse, isLoading, error } = useQuery<ApiResponse<Gallery[]>>({
//     queryKey: ['gallery-photos'],
//     queryFn: galleryApi.getPhotos
//   });
//   const photos = apiResponse?.data;
//   if (error) return <Card><CardContent className="p-6 text-red-600">Gagal memuat galeri foto: {error.message}</CardContent></Card>;

//   return (
//     <Card>
//       <CardContent className="p-6">
//         <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold text-gray-900">Galeri Foto</h2><Link href="/gallery"><Button variant="ghost" className="text-emerald-600 font-medium text-sm p-0">Lainnya <ExternalLink className="w-4 h-4 ml-1" /></Button></Link></div>
//         {isLoading ? ( <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">{[...Array(6)].map((_, i) => (<div key={i} className="animate-pulse"><div className="bg-gray-200 rounded-lg h-24 md:h-28"></div></div>))}</div> ) : 
//         !photos || photos.length === 0 ? ( <div className="text-center py-10 text-gray-500">Belum ada foto.</div> ) :
//         ( <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//             {photos.slice(0, 6).map((photo) => (
//               <div key={photo.id_gallery} className="group cursor-pointer">
//                 <div className="relative overflow-hidden rounded-lg bg-gray-100 h-24 md:h-28">
//                   <img src={getFullImageUrl(photo.thumbnail_url || photo.url)} alt={photo.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 bg-gray-200" onError={(e) => (e.currentTarget.src = 'https://placehold.co/150x100/EEE/31343C?text=Error')}/>
//                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center"><Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" /></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

// function VideoGallerySection() {
//   const { data: apiResponse, isLoading, error } = useQuery<ApiResponse<Gallery[]>>({
//     queryKey: ['gallery-videos'],
//     queryFn: galleryApi.getVideos
//   });
//   const videos = apiResponse?.data;
//   if (error) return <Card><CardContent className="p-6 text-red-600">Gagal memuat galeri video: {error.message}</CardContent></Card>;

//   return (
//     <Card>
//       <CardContent className="p-6">
//         <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold text-gray-900">Galeri Video</h2><Link href="/gallery"><Button variant="ghost" className="text-emerald-600 font-medium text-sm p-0">Lainnya <ExternalLink className="w-4 h-4 ml-1" /></Button></Link></div>
//         {isLoading ? ( <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[...Array(2)].map((_, i) => (<div key={i} className="animate-pulse"><div className="bg-gray-200 rounded-xl h-48"></div></div>))}</div> ) : 
//         !videos || videos.length === 0 ? ( <div className="text-center py-10 text-gray-500">Belum ada video.</div> ) :
//         ( <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {videos.slice(0, 2).map((video) => (
//               <div key={video.id_gallery} className="group cursor-pointer">
//                 <div className="relative overflow-hidden rounded-xl bg-gray-100 h-48">
//                   <img src={getFullImageUrl(video.thumbnail_url || video.url)} alt={video.title} className="w-full h-full object-cover bg-gray-200" onError={(e) => (e.currentTarget.src = 'https://placehold.co/400x200/EEE/31343C?text=Error')} />
//                   <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
//                     <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"><Play className="w-8 h-8 text-gray-700 ml-1" fill="currentColor" /></div>
//                   </div>
//                   <div className="absolute bottom-3 left-3 right-3"><h3 className="text-white font-semibold text-sm drop-shadow-lg">{video.title}</h3></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }


function EventsSection() {
  const { data: apiResponse, isLoading, error } = useQuery<ApiResponse<Event[]>>({
    queryKey: ['events-home'],
    queryFn: () => eventApi.getAllEvents({ page: 1, pageSize: 3 }),
  });

  const events = apiResponse?.data;

  if (error) return (
    <Card className="border-0 shadow-lg rounded-2xl">
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-orange-600" />
        </div>
        <p className="text-gray-700 font-medium">Tidak dapat memuat event saat ini</p>
        <p className="text-gray-500 text-sm mt-2">Silakan coba lagi nanti</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Event & Kegiatan</h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Ikuti berbagai kegiatan menarik dan event spesial di Taman Nasional Alas Purwo
        </p>
      </div>

      <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Kegiatan Terbaru</h3>
            </div>
            <Link href="/events">
              <Button variant="ghost" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 font-semibold">
                Lihat Semua <ExternalLink className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-2xl h-48 mb-4"></div>
                  <div className="space-y-2">
                    <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
                    <div className="bg-gray-200 h-3 w-full rounded"></div>
                    <div className="bg-gray-200 h-3 w-1/2 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) :
            !events || events.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg">Belum ada event terbaru.</p>
              </div>
            ) :
              (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((item) => {
                    const status = getEventStatus(item.event_date);
                    return (
                      <Link key={item.id_event} href={`/events/${item.slug}`}>
                        <Card className="group cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
                          <CardContent className="p-0">
                            <div className="relative h-48 overflow-hidden">
                              <img
                                src={getFullImageUrl(item.image_url)}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => (e.currentTarget.src = 'https://placehold.co/400x200/EEE/31343C?text=Error')}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                              <div className="absolute top-4 right-4">
                                <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${status.color}`}>
                                  {status.text}
                                </span>
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 p-4">
                                <h3 className="font-bold text-white mb-1 line-clamp-2 group-hover:text-orange-200 transition-colors">
                                  {item.title}
                                </h3>
                                <div className="flex items-center text-white/90 text-sm">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  <span>{formatDate(item.event_date)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="p-4">
                              <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                                {item.summary || stripHtml(item.content)}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              )}
        </CardContent>
      </Card>
    </div>
  );
}

function DestinationsSection() {
  const { data: apiResponse, isLoading, error } = useQuery<ApiResponse<Destination[]>>({
    queryKey: ['destinations-home'],
    queryFn: () => destinationApi.getAllDestination({ page: 1, pageSize: 6 })
  });

  const destinations = apiResponse?.data;

  if (error) return (
    <Card className="border-0 shadow-lg rounded-2xl">
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-emerald-600" />
        </div>
        <p className="text-gray-700 font-medium">Tidak dapat memuat destinasi saat ini</p>
        <p className="text-gray-500 text-sm mt-2">Silakan coba lagi nanti</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Destinasi Populer</h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Jelajahi keindahan alam dan destinasi menakjubkan di Taman Nasional Alas Purwo
        </p>
      </div>

      <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Objek Wisata Alam</h3>
            </div>
            <Link href="/destinations">
              <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 font-semibold">
                Lihat Semua <ExternalLink className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-2xl h-56 mb-4"></div>
                  <div className="space-y-2">
                    <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
                    <div className="bg-gray-200 h-3 w-full rounded"></div>
                    <div className="bg-gray-200 h-3 w-1/2 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) :
            !destinations || destinations.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg">Belum ada destinasi.</p>
              </div>
            ) :
              (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {destinations.map((destination) => (
                    <DestinationCard key={destination.id_destination} destination={destination} />
                  ))}
                </div>
              )}
        </CardContent>
      </Card>
    </div>
  );
}

function InfoCardSection() {
  const infoItems = [
    {
      icon: (
        <BarChart3 className="w-8 h-8 text-white-600 group-hover:scale-110 transition-transform" />
      ),
      title: "Survei Kepuasan",
      desc: "Beri penilaian atas layanan kami",
      link: "/survey",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: (
        <Megaphone className="w-8 h-8 text-white-600 group-hover:scale-110 transition-transform" />
      ),
      title: "Pengaduan Masyarakat",
      desc: "Kirim keluhan atau masukan Anda",
      link: "/complaint",
      gradient: "from-orange-500 to-amber-500"
    },
    {
      icon: (
        <AlertTriangle className="w-8 h-8 text-white-600 group-hover:scale-110 transition-transform" />
      ),
      title: "Whistleblowing",
      desc: "Laporkan pelanggaran secara anonim",
      link: "/wbs",
      gradient: "from-red-500 to-pink-500"
    },
    {
      icon: (
        <MapPin className="w-8 h-8 text-white-600 group-hover:scale-110 transition-transform" />
      ),
      title: "Destinasi Wisata",
      desc: "Jelajahi objek wisata terbaik kami",
      link: "/destinations",
      gradient: "from-blue-500 to-indigo-500"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {infoItems.map((item, i) => (
        <Link key={i} href={item.link}>
          <Card className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden">
            <CardContent className="relative p-8 text-center space-y-4">
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
              <div className="relative">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} shadow-lg`}>
                  <div className="text-white">
                    {item.icon}
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mt-4">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                <div className="inline-flex items-center text-sm font-semibold text-gray-700 group-hover:text-gray-900 mt-3">
                  <span>Selengkapnya</span>
                  <ExternalLink className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}


// --- Main Home Component Export ---
export default function home() {
  return (
    <div className="-mt-[77px] max-w-full mx-auto">
      <HeroSection />
      <div className="max-w-7xl mx-auto px-4 space-y-16 py-16 relative z-20">
        <InfoCardSection />
        <NewsSection />
        <EventsSection />
        <DestinationsSection />
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Mulai Petualangan Anda
          </h2>
          <p className="text-white/90 text-xl mb-10 max-w-3xl mx-auto leading-relaxed">
            Rasakan keajaiban alam Taman Nasional Alas Purwo. Dari pantai eksotis hingga hutan tropis yang menakjubkan, setiap sudut menawarkan pengalaman tak terlupakan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/destinations">
              <Button
                size="lg"
                className="bg-white text-emerald-600 hover:bg-gray-100 font-semibold px-10 py-6 text-lg rounded-full shadow-xl border-0"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Jelajahi Destinasi
              </Button>
            </Link>
            <Link href="/booking">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-white border-white/30 hover:bg-white/10 font-semibold px-10 py-6 text-lg rounded-full"
              >
                <Ticket className="w-5 h-5 mr-2" />
                Pesan Tiket Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
