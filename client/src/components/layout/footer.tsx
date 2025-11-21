import { Link } from "wouter";
import { Instagram, Youtube, Facebook, MessageCircle } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-8 px-4 w-full">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left px-6 md:px-8">
        {/* Logo */}
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-14 h-14 rounded-lg flex items-center justify-center shadow-md">
              <img src="/assets/logo.png" alt="Alas Purwo Logo" className="w-10 h-10" />
            </div>
            <span className="font-bold text-gray-800">
              Taman Nasional Alas Purwo
            </span>
          </div>
          <p className="text-xs text-gray-500 text-center md:text-left">
            © {currentYear} Taman Nasional Alas Purwo. <br /> All rights reserved.
          </p>

          <div className="mt-3 flex items-center justify-center md:justify-start space-x-3">
            <a
              href="https://www.instagram.com/btn_alaspurwo/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-teal-600 p-2 rounded-md"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://www.facebook.com/btnalaspurwo/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-teal-600 p-2 rounded-md"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://www.youtube.com/@tn_alaspurwo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-teal-600 p-2 rounded-md"
            >
              <Youtube className="w-5 h-5" />
            </a>
            <a
              href="https://api.whatsapp.com/send/?phone=062333428675&text&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-teal-600 p-2 rounded-md"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Tautan Cepat</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/home" className="text-gray-600 hover:text-teal-600">Home</Link></li>
            <li><Link href="/destinations" className="text-gray-600 hover:text-teal-600">Destinasi</Link></li>
            <li><Link href="/news" className="text-gray-600 hover:text-teal-600">Berita</Link></li>
            <li><Link href="/events" className="text-gray-600 hover:text-teal-600">Event</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Hubungi Kami</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>Jl. Brawijaya No.20, Kebalenan</li>
            <li>Banyuwangi, Jawa Timur 68417</li>
            <li><a href="tel:+62333424119" className="hover:text-teal-600">(0333) 424119</a></li>
            <li><a href="mailto:info@alaspurwo.id" className="hover:text-teal-600">info@alaspurwo.id</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
