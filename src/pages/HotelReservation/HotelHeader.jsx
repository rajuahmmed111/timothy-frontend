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
              <h1 className="text-3xl font-bold text-gray-900">{hotel?.hotelName || ""}</h1>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((s, i) => (
                  <Star
                    key={s}
                    className={`w-5 h-5 ${i < Math.round(Number((reviewAverage ?? hotel?.averageRating) || 0)) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
                <span className="text-sm text-gray-700">
                  {Number((reviewAverage ?? hotel?.averageRating) || 0).toFixed(1)}
                  {typeof reviewCount === 'number' ? ` • ${reviewCount} reviews` : ''}
                </span>
              </div>
            </div>
            <div className="flex items-center mt-2 text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{`${hotel?.hotelCity || ""}${hotel?.hotelCity && hotel?.hotelCountry ? ", " : ""}${hotel?.hotelCountry || ""}`}</span>
            </div>
          </div>

          {/* Interactive Map Component */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden w-80 h-48">
            {/* Real Map Container */}
            <div className="relative h-40">
              <iframe
                src={mapQuery ? `https://www.google.com/maps?q=${encodedQuery}&output=embed` : undefined}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Hotel Location Map"
              ></iframe>

              {/* Map Overlay with Hotel Info */}
              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-2 max-w-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <div>
                    <h5 className="font-semibold text-xs text-gray-900">{hotel?.hotelName || ""}</h5>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star, i) => (
                        <Star
                          key={star}
                          className={`w-2.5 h-2.5 ${i < Math.round(Number((reviewAverage ?? hotel?.averageRating) || 0)) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Controls removed to avoid cross-origin reload issues */}
            </div>

            {/* View in full map link */}
            <div className="bg-white border-t border-gray-100">
              <button
                onClick={openFullMap}
                className="flex items-center justify-center w-full text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                View in full map
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
