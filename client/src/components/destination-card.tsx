import { Link } from "wouter";
import { Star, MapPin } from "lucide-react";
import type { Destination } from "@/lib/api";
import { getFullImageUrl } from "@/lib/image-utils";

interface DestinationCardProps {
  destination: Destination;
}

export default function DestinationCard({ destination }: DestinationCardProps) {
  const rating = "4.5";
  const gateName = destination.gate?.name || "Umum";

  return (
    <Link href={`/destination/${destination.slug}`}>
      <div className="destination-card group cursor-pointer flex flex-col rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white h-full">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={getFullImageUrl(destination.image_url)}
            alt={destination.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-3 space-y-2">
          {/* Title + Rating */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 truncate group-hover:text-teal-600 transition-colors">
              {destination.name}
            </h3>
            {/* <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-xs text-gray-700">{rating}</span>
            </div> */}
          </div>

          {/* Gate */}
          <div className="flex items-center text-xs text-gray-600">
            <MapPin className="w-3 h-3 mr-1 text-teal-500" />
            <span>Pintu {gateName}</span>
          </div>

          {/* Summary */}
          <p className="text-xs text-gray-500 line-clamp-2">
            {destination.summary || "Tidak ada ringkasan."}
          </p>
        </div>
      </div>
    </Link>
  );
}
