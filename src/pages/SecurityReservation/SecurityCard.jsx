import React from "react";
import { Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function SecurityCard({ securityProvider, to }) {
  const linkTo = to || `/security-service-details/${securityProvider?.id}`;

  return (
      <Link to={linkTo} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 block">
        {/* Hotel Image */}
        <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
          <img
            src={securityProvider?.image || "/placeholder.svg"}
            alt={securityProvider?.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            {/* <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
              Popular
            </div> */}
          </div>
        </div>

        {/* Hotel Details */}
        <div className="p-5">
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
            {securityProvider?.name}
          </h3>
          {securityProvider?.ownerName && (
            <div className="flex items-center gap-2 mb-2">
              <img
                src={securityProvider?.ownerAvatar || "/placeholder.svg"}
                alt={securityProvider?.ownerName}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-sm text-gray-700 line-clamp-1">{securityProvider?.ownerName}</span>
            </div>
          )}
          {/* Hotel Location */}
          <p className="text-sm text-gray-600 line-clamp-2 flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4" /> {securityProvider?.location}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="text-2xl font-bold text-gray-900">
              {securityProvider?.price}
            </div>
            <div className="flex items-center gap-1">
              {(() => {
                const raw = Number(securityProvider?.rating) || 0;
                const stars = Math.max(0, Math.min(5, Math.round(raw)));
                return [...Array(stars)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ));
              })()}
              <span className="text-sm text-gray-600 ml-1">
                ({Number(securityProvider?.rating) || 0})
              </span>
            </div>
          </div>

          {/* Price & Button */}
          {/* <div className="w-full">
                    <Link to="/security-service-details" className="w-full">
                        <button className="w-full bg-[#0064D2] text-white px-4 py-2 rounded-lg text-sm font-bold">
                            Reserve Now
                        </button>
                    </Link>
                </div> */}
        </div>
      </Link>
    
  );
}
