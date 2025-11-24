import React from "react";
import { Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function HotelCard({ hotel }) {
  const hotelImage =
    hotel?.hotelImages?.[0] ||
    hotel?.raw?.hotelImages?.[0] ||
    hotel?.raw?.room?.[0]?.hotelImages?.[0] ||
    hotel?.image ||
    null;
  console.log("Hotel", hotel);
  console.log("Hotel Image", hotelImage);
  return (
    <Link
      to={`/hotel-details/${hotel.id}`}
      state={{ hotel: hotel.raw || hotel }}
      className="w-full"
    >
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Hotel Image */}
        <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
          <img
            src={hotelImage || "/placeholder.svg"}
            alt={hotel.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
              Popular
            </div>
          </div>
        </div>

        {/* Hotel Details */}
        <div className="p-5">
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
            {hotel?.raw?.hotelBusinessName}
          </h3>
          {/* Hotel Location */}
          <p className="text-sm text-gray-600 line-clamp-2 flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4" /> {hotel.location}
          </p>

          {/* Price and Rating */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-baseline gap-2">
              <div className="text-sm font-bold text-gray-900">
                {hotel?.raw?.displayCurrency}:{" "}
                {Number(hotel?.raw?.averagePrice || 0).toLocaleString()}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(hotel?.raw?.averageRating || 0)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600 ml-1">
                (
                {hotel?.raw?.averageRating
                  ? Number(hotel?.raw?.averageRating).toFixed(1)
                  : "0.0"}
                )
                {hotel?.raw?.averageReviewCount > 0 && (
                  <span className="text-xs text-gray-500 ml-1">
                    ({hotel?.raw?.averageReviewCount}{" "}
                    {hotel?.raw?.averageReviewCount === 1
                      ? "review"
                      : "reviews"}
                    )
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
