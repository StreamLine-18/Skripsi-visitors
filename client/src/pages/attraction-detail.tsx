import { useParams, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Clock, 
  Heart, 
  Calendar,
  User,
  CheckCircle 
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Attraction } from "@shared/schema";

export default function AttractionDetail() {
  const { slug } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showBooking, setShowBooking] = useState(false);
  const [bookingData, setBookingData] = useState({
    visitorName: "Amanda Pratama",
    visitDate: "",
    quantity: 1
  });

  const { data: attraction, isLoading } = useQuery<Attraction>({
    queryKey: ["/api/attractions", slug],
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/tickets", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Tiket Berhasil Dipesan!",
        description: "Tiket Anda telah berhasil dibuat. Silakan cek di halaman Tiket Saya.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
      setShowBooking(false);
    },
    onError: () => {
      toast({
        title: "Gagal Memesan Tiket",
        description: "Terjadi kesalahan saat memesan tiket. Silakan coba lagi.",
        variant: "destructive",
      });
    },
  });

  const handleBooking = () => {
    if (!attraction || !bookingData.visitDate) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Mohon lengkapi semua data yang diperlukan.",
        variant: "destructive",
      });
      return;
    }

    bookingMutation.mutate({
      attractionId: attraction.id,
      visitorName: bookingData.visitorName,
      visitDate: new Date(bookingData.visitDate),
      quantity: bookingData.quantity,
      totalAmount: attraction.localPrice
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="animate-pulse space-y-6">
          <div className="bg-gray-200 h-8 w-32 rounded"></div>
          <div className="bg-gray-200 h-64 rounded-xl"></div>
          <div className="space-y-4">
            <div className="bg-gray-200 h-6 w-3/4 rounded"></div>
            <div className="bg-gray-200 h-4 w-full rounded"></div>
            <div className="bg-gray-200 h-4 w-2/3 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!attraction) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Destinasi Tidak Ditemukan</h1>
        <Link href="/">
          <Button>Kembali ke Beranda</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Back Button */}
      <Link href="/">
        <Button variant="ghost" className="flex items-center space-x-2 p-0">
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </Button>
      </Link>

      {/* Hero Image */}
      <div className="relative rounded-2xl overflow-hidden">
        <img 
          src={attraction.imageUrl} 
          alt={attraction.name}
          className="w-full h-64 md:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-3xl font-bold mb-2">{attraction.name}</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-current text-yellow-400" />
              <span className="text-sm">{attraction.rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{attraction.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Tentang Destinasi</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{attraction.description}</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Fitur Utama</h3>
                  <ul className="space-y-2">
                    {attraction.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Fasilitas</h3>
                  <ul className="space-y-2">
                    {attraction.facilities.map((facility, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700">{facility}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Informasi Detail</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Lokasi</p>
                    <p className="text-sm text-gray-600">{attraction.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Jam Operasional</p>
                    <p className="text-sm text-gray-600">{attraction.operatingHours}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing Card */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-teal-600 mb-2">
                  Rp {parseInt(attraction.localPrice).toLocaleString('id-ID')}
                </div>
                <p className="text-sm text-gray-600">per orang</p>
                {attraction.price !== attraction.localPrice && (
                  <p className="text-xs text-gray-500 mt-1">
                    Wisatawan asing: Rp {parseInt(attraction.price).toLocaleString('id-ID')}
                  </p>
                )}
              </div>

              {!showBooking ? (
                <div className="space-y-3">
                  <Button 
                    className="w-full gradient-primary text-white py-3 font-medium hover:shadow-lg transition-shadow"
                    onClick={() => setShowBooking(true)}
                  >
                    Pesan Tiket
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Heart className="w-4 h-4 mr-2" />
                    Tambah ke Favorit
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Pesan Tiket</h3>
                  
                  <div>
                    <Label htmlFor="visitorName">Nama Pengunjung</Label>
                    <Input
                      id="visitorName"
                      value={bookingData.visitorName}
                      onChange={(e) => setBookingData(prev => ({ ...prev, visitorName: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="visitDate">Tanggal Kunjungan</Label>
                    <Input
                      id="visitDate"
                      type="date"
                      value={bookingData.visitDate}
                      onChange={(e) => setBookingData(prev => ({ ...prev, visitDate: e.target.value }))}
                      className="mt-1"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="quantity">Jumlah Tiket</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max="10"
                      value={bookingData.quantity}
                      onChange={(e) => setBookingData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between mb-3">
                      <span>Total Pembayaran:</span>
                      <span className="font-bold text-teal-600">
                        Rp {(parseInt(attraction.localPrice) * bookingData.quantity).toLocaleString('id-ID')}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <Button 
                        className="w-full gradient-primary text-white font-medium"
                        onClick={handleBooking}
                        disabled={bookingMutation.isPending}
                      >
                        {bookingMutation.isPending ? "Memproses..." : "Konfirmasi Pemesanan"}
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setShowBooking(false)}
                      >
                        Batal
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
