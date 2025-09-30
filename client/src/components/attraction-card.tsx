import { Link } from "wouter";
import { Star } from "lucide-react";
import type { Attraction } from "@shared/schema";

interface AttractionCardProps {
  attraction: Attraction;
}

export default function AttractionCard({ attraction }: AttractionCardProps) {
  return (
    <Link href={`/attraction/${attraction.slug}`}>
      <div className="attraction-card group cursor-pointer">
        <div className="relative rounded-xl overflow-hidden mb-3">
          <img 
            src={attraction.imageUrl} 
            alt={attraction.name} 
            className="attraction-image w-full h-48 object-cover"
          />
          <div className="absolute top-3 right-3 bg-white bg-opacity-90 px-2 py-1 rounded-lg">
            <span className="text-xs font-medium text-gray-800">
              {attraction.category === 'wildlife' && '84 Ha'}
              {attraction.category === 'beach' && attraction.name.includes('Plengkung') && '6-8m'}
              {attraction.category === 'mangrove' && '26 Sp'}
              {attraction.category === 'spiritual' && '2km'}
              {attraction.category === 'cultural' && '14th'}
              {attraction.category === 'beach' && attraction.name.includes('Pancur') && 'Camp'}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <h3 className="text-white font-semibold">{attraction.name}</h3>
            <p className="text-white text-xs opacity-90">{attraction.category}</p>
          </div>
        </div>
        <div className="space-y-2 p-2">
          <div className="flex items-center justify-between">
            <span className="text-teal-600 font-semibold">Rp {parseInt(attraction.localPrice).toLocaleString('id-ID')}</span>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-xs text-gray-600">{attraction.rating}</span>
            </div>
          </div>
          <p className="text-xs text-gray-600 line-clamp-2">{attraction.shortDescription}</p>
        </div>
      </div>
    </Link>
  );
}
