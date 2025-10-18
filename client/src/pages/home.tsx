import { useQuery } from "@tanstack/react-query";
import { Play, Calendar, MapPin, Camera, Video, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import AttractionCard from "@/components/attraction-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    newsApi,
    type ApiResponse,
    type News,
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
  console.log('[DEBUG] getFullImageUrl received relativePath:', relativePath);

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
  
  console.log('[DEBUG] Constructed Image URL:', fullUrl);
  
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
    <div className="relative h-96 overflow-hidden rounded-2xl">
      <img
        src="public/assets/hero.jpg"
        alt="Alas Purwo"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative h-full flex items-center justify-center text-center text-white p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Selamat Datang di Alas Purwo</h1>
          <p className="text-lg md:text-xl mb-6 opacity-90">Hutan Pertama Jawa - Jelajahi Keindahan Alam yang Menakjubkan</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/attractions"><Button size="lg" variant="outline" className="bg-white text-teal-700 hover:bg-gray-300 font-semibold"><MapPin className="w-5 h-5 mr-2" /> Jelajahi Destinasi</Button></Link>
            <Link href="/gallery"><Button size="lg" variant="outline" className="bg-white text-teal-700 hover:bg-gray-300 font-semibold"><Camera className="w-5 h-5 mr-2" /> Lihat Galeri</Button></Link>
          </div>
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

  if (error) return <Card><CardContent className="p-6 text-red-600">Gagal memuat berita: {error.message}</CardContent></Card>;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold text-gray-900">Berita Terkini</h2><Link href="/news"><Button variant="ghost" className="text-teal-600 font-medium text-sm p-0">Lainnya <ExternalLink className="w-4 h-4 ml-1" /></Button></Link></div>
        {isLoading ? ( <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><div className="animate-pulse"><div className="bg-gray-200 rounded-xl h-64 mb-3"></div><div className="space-y-2"><div className="bg-gray-200 h-4 w-1/4 rounded"></div><div className="bg-gray-200 h-6 w-3/4 rounded"></div><div className="bg-gray-200 h-4 w-full rounded"></div></div></div><div className="space-y-4">{[...Array(3)].map((_, i) => (<div key={i} className="animate-pulse flex items-center space-x-4"><div className="bg-gray-200 rounded-lg h-20 w-20"></div><div className="flex-1 space-y-2"><div className="bg-gray-200 h-3 w-1/4 rounded"></div><div className="bg-gray-200 h-4 w-full rounded"></div><div className="bg-gray-200 h-3 w-1/2 rounded"></div></div></div>))}</div></div> ) : 
        !news || news.length === 0 ? ( <div className="text-center py-10 text-gray-500">Belum ada berita terbaru.</div> ) : 
        ( <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredNews && (
              <div className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-xl bg-gray-100 mb-3">
                  <img src={getFullImageUrl(featuredNews.image_url)} alt={featuredNews.title} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300 bg-gray-200" onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400/EEE/31343C?text=Error')} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="text-xs bg-black/50 px-2 py-1 rounded-full">{formatDate(featuredNews.published_at)}</span>
                    <h3 className="font-bold text-lg mt-2 drop-shadow-lg">{featuredNews.title}</h3>
                    <p className="text-xs opacity-80 mt-1">Oleh {featuredNews.author_name}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mt-2 px-1">{stripHtml(featuredNews.content)}</p>
                <p className="text-xs text-teal-600 font-medium cursor-pointer mt-1 px-1">selengkapnya →</p>
              </div>
            )}
            <div className="space-y-4">
              {secondaryNews?.map((item) => (
                <div key={item.id_news} className="group cursor-pointer flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-50">
                  <img src={getFullImageUrl(item.image_url)} alt={item.title} className="w-20 h-20 object-cover rounded-lg flex-shrink-0 bg-gray-200" onError={(e) => (e.currentTarget.src = 'https://placehold.co/80x80/EEE/31343C?text=Error')} />
                  <div className="space-y-1 flex-1">
                    <p className="text-xs text-gray-500">{formatDate(item.published_at)}</p>
                    <h3 className="font-semibold text-sm text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-2">{item.title}</h3>
                    <p className="text-xs text-gray-500">Oleh {item.author_name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
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
//         <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold text-gray-900">Galeri Foto</h2><Link href="/gallery"><Button variant="ghost" className="text-teal-600 font-medium text-sm p-0">Lainnya <ExternalLink className="w-4 h-4 ml-1" /></Button></Link></div>
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
//         <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold text-gray-900">Galeri Video</h2><Link href="/gallery"><Button variant="ghost" className="text-teal-600 font-medium text-sm p-0">Lainnya <ExternalLink className="w-4 h-4 ml-1" /></Button></Link></div>
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

// function AttractionsSection() {
//   const { data: apiResponse, isLoading, error } = useQuery<ApiResponse<Attraction[]>>({
//     queryKey: ['attractions'],
//     queryFn: attractionApi.getAllAttractions
//   });
//   const attractions = apiResponse?.data;
//   if (error) return <Card><CardContent className="p-6 text-red-600">Gagal memuat destinasi: {error.message}</CardContent></Card>;

//   return (
//     <Card>
//       <CardContent className="p-6">
//         <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold text-gray-900">Destinasi Populer</h2><Link href="/attractions"><Button variant="ghost" className="text-teal-600 font-medium text-sm p-0">Lihat Semua</Button></Link></div>
//         {isLoading ? ( <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => (<div key={i} className="animate-pulse"><div className="bg-gray-200 rounded-xl h-48 mb-3"></div><div className="space-y-2"><div className="flex justify-between"><div className="bg-gray-200 h-4 w-20 rounded"></div><div className="bg-gray-200 h-4 w-12 rounded"></div></div><div className="bg-gray-200 h-3 w-full rounded"></div></div></div>))}</div> ) : 
//         !attractions || attractions.length === 0 ? ( <div className="text-center py-10 text-gray-500">Belum ada destinasi.</div> ) :
//         ( <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {attractions.map((attraction) => (
//               <AttractionCard key={attraction.id_destination} attraction={{
//                 ...attraction,
//                 // Mapping new backend fields to the props AttractionCard expects
//                 id: attraction.id_destination,
//                 imageUrl: getFullImageUrl(attraction.image_url),
//                 shortDescription: stripHtml(attraction.description || '').substring(0, 100) + '...', // Create a summary
//                 localPrice: attraction.price, // Assuming 'price' is the one to show. Adjust if you have local vs international.
//                 rating: '4.5', // Add a rating field to your backend for this
//               }} />
//             ))}
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

// function EventsSection() {
//     const { data: apiResponse, isLoading, error } = useQuery<ApiResponse<Event[]>>({
//         queryKey: ['events'],
//         queryFn: eventApi.getAllEvents,
//     });
//     const events = apiResponse?.data;
//     if (error) return <Card><CardContent className="p-6 text-red-600">Gagal memuat event: {error.message}</CardContent></Card>;

//   return (
//     <Card>
//       <CardContent className="p-6">
//         <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold text-gray-900">Event</h2><Link href="/events"><Button variant="ghost" className="text-teal-600 font-medium text-sm p-0">Lainnya <ExternalLink className="w-4 h-4 ml-1" /></Button></Link></div>
//         {isLoading ? ( <div className="space-y-4">{[...Array(3)].map((_, i) => (<div key={i} className="animate-pulse flex space-x-4 p-4 rounded-xl border border-gray-100"><div className="w-20 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div><div className="flex-1 space-y-2"><div className="bg-gray-200 h-4 w-3/4 rounded"></div><div className="bg-gray-200 h-3 w-full rounded"></div><div className="bg-gray-200 h-3 w-1/2 rounded"></div></div></div>))}</div> ) : 
//         !events || events.length === 0 ? ( <div className="text-center py-10 text-gray-500">Belum ada event terbaru.</div> ) :
//         ( <div className="space-y-4">
//             {events.slice(0, 3).map((item) => {
//               const status = getEventStatus(item.event_date);
//               return (
//                 <div key={item.id_event} className="flex space-x-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
//                   <img src={getFullImageUrl(item.image_url)} alt={item.title} className="w-20 h-16 rounded-lg object-cover flex-shrink-0 bg-gray-200" onError={(e) => (e.currentTarget.src = 'https://placehold.co/80x64/EEE/31343C?text=Error')}/>
//                   <div className="flex-1">
//                     <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h3>
//                     <p className="text-xs text-gray-600 mb-2 line-clamp-2">{stripHtml(item.content)}</p>
//                     <div className="flex items-center gap-3">
//                       <span className="text-xs text-teal-600 font-medium">{formatDate(item.event_date)}</span>
//                       <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>{status.text}</span>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

// --- Main Home Component Export ---
export default function Home() {
  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <HeroSection />
      <NewsSection />
      {/* <PhotoGallerySection />
      <VideoGallerySection />
      <AttractionsSection />
      <EventsSection /> */}
    </div>
  );
}
