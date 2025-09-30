// Dummy data for development - this would be replaced by real API calls
export const attractions = [
  {
    id: "sadengan-savanna",
    name: "Padang Sadengan",
    slug: "sadengan-savanna",
    description: "Padang Sadengan adalah savana buatan seluas 84 hektar yang menjadi habitat ideal untuk berbagai satwa langka. Tempat ini adalah spot terbaik untuk mengamati banteng Jawa yang terancam punah, rusa Timor, dan merak hijau. Waktu terbaik untuk pengamatan adalah sore hari antara pukul 15:00-17:30 ketika hewan-hewan berkumpul untuk minum.",
    shortDescription: "Pengamatan satwa langka seperti banteng Jawa dan merak hijau",
    price: 225000,
    localPrice: 150000,
    category: "wildlife",
    imageUrl: "https://images.unsplash.com/photo-1566467919317-8430be7a6e3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    location: "Taman Nasional Alas Purwo, Banyuwangi",
    operatingHours: "08:00 - 16:00 WIB",
    features: ["Wildlife Observation Tower", "Best viewing: 15:00-17:30", "Banteng Jawa & Green Peafowl", "84 hectares of grassland"],
    facilities: ["Menara Pengamatan 3 Lantai", "Area Parkir", "Toilet", "Kantin"],
    rating: 4.8
  },
  // Add more attractions...
];

export const news = [
  {
    id: "wildlife-camp-2024",
    title: "Alas Purwo Wildlife Camp 2024",
    content: "Program konservasi 3 hari dengan tema 'Melihat Satwa Melalui Tangkapan Digital' telah berhasil diselenggarakan di Jatipapak Camping Ground.",
    summary: "Program konservasi 3 hari dengan tema 'Melihat Satwa Melalui Tangkapan Digital'",
    imageUrl: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    publishDate: new Date("2024-06-25"),
    eventDate: new Date("2024-06-25"),
    status: "published",
    category: "event"
  },
  // Add more news...
];
