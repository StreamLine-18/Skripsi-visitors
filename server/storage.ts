import { type User, type InsertUser, type Attraction, type InsertAttraction, type Ticket, type InsertTicket, type News, type InsertNews, type Gallery, type InsertGallery } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Attractions
  getAttractions(): Promise<Attraction[]>;
  getAttraction(id: string): Promise<Attraction | undefined>;
  getAttractionBySlug(slug: string): Promise<Attraction | undefined>;
  createAttraction(attraction: InsertAttraction): Promise<Attraction>;

  // Tickets
  getTicketsByUserId(userId: string): Promise<Ticket[]>;
  getTicket(id: string): Promise<Ticket | undefined>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicketStatus(id: string, status: string, usedAt?: Date): Promise<Ticket | undefined>;

  // News
  getNews(): Promise<News[]>;
  getNewsItem(id: string): Promise<News | undefined>;
  createNews(news: InsertNews): Promise<News>;

  // Gallery
  getGalleryItems(type?: 'photo' | 'video'): Promise<Gallery[]>;
  getGalleryItem(id: string): Promise<Gallery | undefined>;
  createGalleryItem(gallery: InsertGallery): Promise<Gallery>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private attractions: Map<string, Attraction>;
  private tickets: Map<string, Ticket>;
  private news: Map<string, News>;
  private gallery: Map<string, Gallery>;

  constructor() {
    this.users = new Map();
    this.attractions = new Map();
    this.tickets = new Map();
    this.news = new Map();
    this.gallery = new Map();
    this.seedData();
  }

  private seedData() {
    // Seed attractions based on real Alas Purwo data
    const attractionsData: InsertAttraction[] = [
      {
        name: "Padang Sadengan",
        slug: "sadengan-savanna",
        description: "Padang Sadengan adalah savana buatan seluas 84 hektar yang menjadi habitat ideal untuk berbagai satwa langka. Tempat ini adalah spot terbaik untuk mengamati banteng Jawa yang terancam punah, rusa Timor, dan merak hijau. Waktu terbaik untuk pengamatan adalah sore hari antara pukul 15:00-17:30 ketika hewan-hewan berkumpul untuk minum.",
        shortDescription: "Pengamatan satwa langka seperti banteng Jawa dan merak hijau",
        price: "225000",
        localPrice: "150000",
        category: "wildlife",
        imageUrl: "https://images.unsplash.com/photo-1566467919317-8430be7a6e3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        location: "Taman Nasional Alas Purwo, Banyuwangi",
        operatingHours: "08:00 - 16:00 WIB",
        features: ["Wildlife Observation Tower", "Best viewing: 15:00-17:30", "Banteng Jawa & Green Peafowl", "84 hectares of grassland"],
        facilities: ["Menara Pengamatan 3 Lantai", "Area Parkir", "Toilet", "Kantin"],
        rating: "4.8"
      },
      {
        name: "Pantai Plengkung (G-Land)",
        slug: "plengkung-gland",
        description: "Plengkung atau G-Land adalah salah satu spot surfing terbaik dunia dengan ombak barrel yang mencapai 6-8 meter. Pantai ini terletak di ujung timur Pulau Jawa dan menawarkan pengalaman surfing yang tak terlupakan bagi para peselancar profesional maupun pemula yang berpengalaman.",
        shortDescription: "Spot surfing kelas dunia dengan ombak barrel terbaik",
        price: "225000",
        localPrice: "225000",
        category: "beach",
        imageUrl: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        location: "Ujung Timur Taman Nasional Alas Purwo",
        operatingHours: "24 Jam (akses dengan jeep)",
        features: ["6-8 meter barrel waves", "World-famous surf spot", "Remote pristine location", "Professional surf guides available"],
        facilities: ["Surf Camp", "Equipment Rental", "Rescue Team", "Basic Accommodation"],
        rating: "4.9"
      },
      {
        name: "Hutan Mangrove Bedul",
        slug: "bedul-mangrove",
        description: "Hutan Mangrove Bedul adalah area mangrove terbesar di Taman Nasional Alas Purwo dengan 26 spesies mangrove, termasuk 2 spesies langka dunia. Jelajahi ekosistem unik ini dengan perahu tradisional gandang-gandung sambil mengamati berbagai jenis burung dan kehidupan laut.",
        shortDescription: "Jelajahi hutan mangrove terbesar dengan perahu traditional",
        price: "150000",
        localPrice: "100000",
        category: "mangrove",
        imageUrl: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        location: "Segara Anak River, Alas Purwo",
        operatingHours: "08:00 - 16:00 WIB",
        features: ["26 mangrove species", "2 globally rare species", "Traditional boat tours", "Rich biodiversity"],
        facilities: ["Perahu Gandang-gandung", "Local Guide", "Life Jackets", "Bird Watching Points"],
        rating: "4.7"
      },
      {
        name: "Goa Istana",
        slug: "goa-istana",
        description: "Goa Istana adalah gua suci yang terletak 2km dari Pantai Pancur melalui hutan bambu. Tempat ini populer untuk meditasi dan ritual spiritual, terutama selama bulan Suro dalam kalender Jawa. Gua ini dianggap sebagai tempat suci bagi para peziarah dan pencari spiritual.",
        shortDescription: "Gua suci untuk meditasi dan ritual spiritual Jawa",
        price: "150000",
        localPrice: "75000",
        category: "spiritual",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        location: "2km dari Pantai Pancur",
        operatingHours: "06:00 - 18:00 WIB",
        features: ["Sacred meditation site", "2km forest walk", "Spiritual significance", "Javanese mystical traditions"],
        facilities: ["Meditation Area", "Forest Trail", "Spiritual Guide Available", "Rest Areas"],
        rating: "4.6"
      },
      {
        name: "Pantai Pancur",
        slug: "pancur-beach",
        description: "Pantai Pancur adalah pantai paling populer di Alas Purwo dengan pasir putih bersih dan fasilitas camping terbaik. Pantai ini menjadi basecamp untuk menjelajahi berbagai destinasi lain di taman nasional dan menawarkan pemandangan sunset yang menakjubkan.",
        shortDescription: "Pantai pasir putih dengan fasilitas camping terbaik",
        price: "150000",
        localPrice: "50000",
        category: "beach",
        imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        location: "Taman Nasional Alas Purwo",
        operatingHours: "24 Jam",
        features: ["White sand beach", "Best camping facilities", "Gateway to other attractions", "Beautiful sunset views"],
        facilities: ["Camping Ground", "Toilet & Shower", "Panthera Resto & Cafe", "Jeep Rental"],
        rating: "4.5"
      },
      {
        name: "Pura Luhur Giri Salaka",
        slug: "pura-giri-salaka",
        description: "Pura Luhur Giri Salaka adalah pura Hindu kuno dari era Kerajaan Majapahit (abad ke-14). Pura ini masih aktif digunakan untuk upacara keagamaan, terutama saat Hari Raya Pagerwesi. Tempat ini memiliki nilai sejarah dan spiritual yang tinggi bagi umat Hindu dan masyarakat Jawa.",
        shortDescription: "Pura kuno dari era Majapahit dengan ritual Pagerwesi",
        price: "150000",
        localPrice: "25000",
        category: "cultural",
        imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        location: "Dalam Hutan Alas Purwo",
        operatingHours: "06:00 - 18:00 WIB",
        features: ["14th century Majapahit temple", "Active religious site", "Annual Pagerwesi ceremonies", "Historical significance"],
        facilities: ["Temple Complex", "Prayer Area", "Historical Information", "Cultural Guide"],
        rating: "4.8"
      }
    ];

    attractionsData.forEach(attraction => {
      const id = randomUUID();
      this.attractions.set(id, { ...attraction, id, isActive: true });
    });

    // Seed news based on real events
    const newsData: InsertNews[] = [
      {
        title: "Alas Purwo Wildlife Camp 2024",
        content: "Program konservasi 3 hari dengan tema 'Melihat Satwa Melalui Tangkapan Digital' telah berhasil diselenggarakan di Jatipapak Camping Ground. Kegiatan ini melibatkan peserta dari berbagai kalangan untuk belajar tentang konservasi satwa melalui fotografi alam.",
        summary: "Program konservasi 3 hari dengan tema 'Melihat Satwa Melalui Tangkapan Digital'",
        imageUrl: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        eventDate: new Date("2024-06-25"),
        status: "published",
        category: "event"
      },
      {
        title: "Festival Mangrove 2025",
        content: "Perayaan pelestarian ekosistem mangrove dan budaya lokal Banyuwangi sedang berlangsung. Festival ini menampilkan berbagai kegiatan edukasi tentang pentingnya menjaga ekosistem mangrove serta pertunjukan budaya tradisional.",
        summary: "Perayaan pelestarian ekosistem mangrove dan budaya lokal Banyuwangi",
        imageUrl: "https://images.unsplash.com/photo-1582802833604-6b45c0b6949b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        eventDate: new Date("2025-07-28"),
        status: "published",
        category: "event"
      },
      {
        title: "Peningkatan Tarif Masuk Taman Nasional",
        content: "Mulai 30 Oktober 2024, tarif masuk Taman Nasional Alas Purwo mengalami penyesuaian sesuai dengan Peraturan Pemerintah No. 36/2024. Peningkatan tarif ini untuk mendukung program konservasi dan peningkatan fasilitas.",
        summary: "Penyesuaian tarif masuk sesuai PP No. 36/2024",
        imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        eventDate: new Date("2024-10-30"),
        status: "published",
        category: "news"
      }
    ];

    newsData.forEach(newsItem => {
      const id = randomUUID();
      this.news.set(id, { ...newsItem, id, publishDate: new Date() });
    });

    // Seed sample user
    const sampleUser: User = {
      id: randomUUID(),
      username: "amanda_pratama",
      email: "amanda.pratama@email.com",
      password: "hashedpassword",
      fullName: "Amanda Pratama",
      phone: "+62812345678",
      createdAt: new Date()
    };
    this.users.set(sampleUser.id, sampleUser);

    // Seed sample tickets
    const sampleTicket: Ticket = {
      id: randomUUID(),
      userId: sampleUser.id,
      attractionId: Array.from(this.attractions.keys())[0],
      ticketNumber: "AP2024100001",
      visitorName: "Amanda Pratama",
      visitDate: new Date("2024-10-25"),
      quantity: 1,
      totalAmount: "150000",
      status: "active",
      qrCode: "AP2024100001",
      purchaseDate: new Date("2024-10-24"),
      usedAt: null
    };
    this.tickets.set(sampleTicket.id, sampleTicket);

    // Seed gallery data
    const galleryData: InsertGallery[] = [
      // Photo gallery
      {
        title: "Banteng Jawa di Padang Sadengan",
        description: "Kawanan banteng Jawa sedang mencari makan di savana Sadengan saat sore hari",
        url: "https://images.unsplash.com/photo-1566467919317-8430be7a6e3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        thumbnailUrl: "https://images.unsplash.com/photo-1566467919317-8430be7a6e3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        type: "photo",
        category: "wildlife",
        author: "Tim Dokumentasi Alas Purwo"
      },
      {
        title: "Sunrise di Pantai Trianggulasi",
        description: "Matahari terbit yang indah di pantai timur Alas Purwo",
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        thumbnailUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        type: "photo",
        category: "landscape",
        author: "Wildlife Photography Club"
      },
      {
        title: "Merak Hijau Jantan",
        description: "Merak hijau jantan memamerkan bulu ekornya yang indah",
        url: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        thumbnailUrl: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        type: "photo",
        category: "wildlife",
        author: "Birdwatcher Indonesia"
      },
      {
        title: "Hutan Mangrove Bedul",
        description: "Keanekaragaman hayati di hutan mangrove Bedul",
        url: "https://images.unsplash.com/photo-1582802833604-6b45c0b6949b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        thumbnailUrl: "https://images.unsplash.com/photo-1582802833604-6b45c0b6949b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        type: "photo",
        category: "landscape",
        author: "Tim Konservasi Mangrove"
      },
      {
        title: "Surfing di G-Land",
        description: "Peselancar profesional menantang ombak barrel G-Land",
        url: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        thumbnailUrl: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        type: "photo",
        category: "activities",
        author: "G-Land Surf Camp"
      },
      {
        title: "Camping di Jatipapak",
        description: "Suasana malam di camping ground Jatipapak dengan api unggun",
        url: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        thumbnailUrl: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        type: "photo",
        category: "activities",
        author: "Outdoor Adventure Club"
      },
      // Video gallery
      {
        title: "Wildlife Alas Purwo - 4K Timelapse",
        description: "Video timelapse kehidupan wildlife di Taman Nasional Alas Purwo",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnailUrl: "https://images.unsplash.com/photo-1566467919317-8430be7a6e3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        type: "video",
        category: "wildlife",
        author: "National Geographic Indonesia"
      },
      {
        title: "Surfing G-Land Pro Competition",
        description: "Kompetisi surfing profesional di ombak legendaris G-Land",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnailUrl: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        type: "video",
        category: "activities",
        author: "Surf Indonesia TV"
      },
      {
        title: "Dokumenter Banteng Jawa",
        description: "Dokumenter tentang upaya konservasi banteng Jawa di Alas Purwo",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnailUrl: "https://images.unsplash.com/photo-1566467919317-8430be7a6e3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        type: "video",
        category: "wildlife",
        author: "Indonesia Wild"
      }
    ];

    galleryData.forEach(galleryItem => {
      const id = randomUUID();
      this.gallery.set(id, { ...galleryItem, id, createdAt: new Date(), isActive: true });
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  // Attraction methods
  async getAttractions(): Promise<Attraction[]> {
    return Array.from(this.attractions.values()).filter(attraction => attraction.isActive);
  }

  async getAttraction(id: string): Promise<Attraction | undefined> {
    return this.attractions.get(id);
  }

  async getAttractionBySlug(slug: string): Promise<Attraction | undefined> {
    return Array.from(this.attractions.values()).find(attraction => attraction.slug === slug);
  }

  async createAttraction(insertAttraction: InsertAttraction): Promise<Attraction> {
    const id = randomUUID();
    const attraction: Attraction = { ...insertAttraction, id, isActive: true };
    this.attractions.set(id, attraction);
    return attraction;
  }

  // Ticket methods
  async getTicketsByUserId(userId: string): Promise<Ticket[]> {
    return Array.from(this.tickets.values())
      .filter(ticket => ticket.userId === userId)
      .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());
  }

  async getTicket(id: string): Promise<Ticket | undefined> {
    return this.tickets.get(id);
  }

  async createTicket(insertTicket: InsertTicket): Promise<Ticket> {
    const id = randomUUID();
    const ticketNumber = `AP${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    const ticket: Ticket = {
      ...insertTicket,
      id,
      ticketNumber,
      qrCode: ticketNumber,
      purchaseDate: new Date(),
      usedAt: null
    };
    this.tickets.set(id, ticket);
    return ticket;
  }

  async updateTicketStatus(id: string, status: string, usedAt?: Date): Promise<Ticket | undefined> {
    const ticket = this.tickets.get(id);
    if (ticket) {
      ticket.status = status;
      if (usedAt) {
        ticket.usedAt = usedAt;
      }
      this.tickets.set(id, ticket);
    }
    return ticket;
  }

  // News methods
  async getNews(): Promise<News[]> {
    return Array.from(this.news.values())
      .filter(news => news.status === "published")
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  }

  async getNewsItem(id: string): Promise<News | undefined> {
    return this.news.get(id);
  }

  async createNews(insertNews: InsertNews): Promise<News> {
    const id = randomUUID();
    const news: News = { ...insertNews, id, publishDate: new Date() };
    this.news.set(id, news);
    return news;
  }

  // Gallery methods
  async getGalleryItems(type?: 'photo' | 'video'): Promise<Gallery[]> {
    const items = Array.from(this.gallery.values())
      .filter(item => item.isActive);
    
    if (type) {
      return items.filter(item => item.type === type)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getGalleryItem(id: string): Promise<Gallery | undefined> {
    return this.gallery.get(id);
  }

  async createGalleryItem(insertGallery: InsertGallery): Promise<Gallery> {
    const id = randomUUID();
    const gallery: Gallery = { ...insertGallery, id, createdAt: new Date() };
    this.gallery.set(id, gallery);
    return gallery;
  }
}

export const storage = new MemStorage();
