import React from "react";
import { MapPin, Star, ExternalLink } from "lucide-react";
export default function HotelHeader({ hotel, reviewAverage, reviewCount }) {

  const lat = typeof hotel?.hotelLate === 'number' ? hotel.hotelLate : undefined;
  const lng = typeof hotel?.hotelLong === 'number' ? hotel.hotelLong : undefined;
  const addressParts = [hotel?.hotelAddress, hotel?.hotelCity, hotel?.hotelCountry].filter(Boolean);
  const addressQuery = addressParts.join(', ');
  const mapQuery = lat !== undefined && lng !== undefined ? `${lat},${lng}` : addressQuery;
  const encodedQuery = encodeURIComponent(mapQuery || '');

  const openFullMap = () => {
    const url = mapQuery
      ? `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`
      : `https://www.google.com/maps`; 
    window.open(url, "_blank");
  };

  return (
    <header>
      <div className="container mx-auto px-5 lg:px-0 py-16">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">
                {hotel?.hotelName || ""}
              </h1>
            </div>
            <div className="flex items-center mt-2 text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{`${hotel?.hotelCity || ""}${
                hotel?.hotelCity && hotel?.hotelCountry ? ", " : ""
              }${hotel?.hotelCountry || ""}`}</span>
            </div>
            <div className="flex items-center mt-3 gap-2">
              <span className="text-xl font-normal ">Average Rating : </span>
              {[1, 2, 3, 4, 5].map((s, i) => (
                <Star
                  key={s}
                  className={`w-5 h-5 ${
                    i <
                    Math.round(
                      Number((reviewAverage ?? hotel?.averageRating) || 0)
                    )
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm text-gray-700">
                {Number((reviewAverage ?? hotel?.averageRating) || 0).toFixed(
                  1
                )}
                {/* {typeof reviewCount === 'number' ? ` • ${reviewCount} reviews` : ''} */}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
