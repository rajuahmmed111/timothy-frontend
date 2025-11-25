import React, { useState, useEffect } from "react";
import { Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { currencyByCountry } from "../curenci";

export default function HotelCard({ hotel }) {
  const [userCurrency, setUserCurrency] = useState("USD");
  const [userCountry, setUserCountry] = useState(null);

  useEffect(() => {
    const detect = async () => {
      try {
        console.log("Starting location detection...");

        // Try multiple CORS-friendly APIs
        const apis = [
          {
            url: "https://ipapi.co/json/",
            parser: (data) => data.country,
          },
          {
            url: "https://extreme-ip-lookup.com/json/",
            parser: (data) => data.countryCode,
          },
          {
            url: "https://api.country.is/",
            parser: (data) => data.country,
          },
        ];

        for (const api of apis) {
          try {
            console.log(`Trying ${api.url}...`);
            const response = await fetch(api.url);
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`);
            }
            const data = await response.json();
            console.log(`Response from ${api.url}:`, data);

            const country = api.parser(data);
            console.log("Detected Country:", country);

            if (country && currencyByCountry[country]) {
              setUserCountry(country);
              setUserCurrency(currencyByCountry[country].code);
              console.log("Set currency to:", currencyByCountry[country].code);
              return; // Success, exit the loop
            }
          } catch (err) {
            console.warn(`Failed with ${api.url}:`, err.message);
            continue; // Try next API
          }
        }

        // If all APIs fail, use Bangladesh (since IP is from Bangladesh)
        console.log("All APIs failed, defaulting to Bangladesh (BDT)");
        setUserCountry("BD");
        setUserCurrency("BDT");
      } catch (err) {
        console.error("Location detection failed:", err);
        setUserCurrency("USD");
      }
    };

    detect();
  }, []);

  const hotelImage =
    hotel?.hotelImages?.[0] ||
    hotel?.raw?.hotelImages?.[0] ||
    hotel?.raw?.room?.[0]?.hotelImages?.[0] ||
    hotel?.image ||
    null;

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
            <div className="bg-white/90 px-2 py-1 rounded-full text-xs font-medium text-gray-700">
              Popular
            </div>
          </div>
        </div>

        {/* Hotel Details */}
        <div className="p-5">
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
            {hotel?.raw?.hotelBusinessName || hotel?.name}
          </h3>

          {/* Location */}
          <p className="text-sm text-gray-600 line-clamp-2 flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4" /> {hotel.location}
          </p>

          {/* Price + Rating */}
          <div className="flex items-center justify-between mb-3">
            {/* PRICE (FIXED) */}
            <div className="flex items-baseline gap-2">
              <div className="text-sm font-bold text-gray-900">
                {userCurrency}{" "}
                {Number(hotel?.raw?.averagePrice || 0).toLocaleString()}
              </div>

              {userCountry && (
                <span className="text-xs text-gray-500">({userCountry})</span>
              )}
            </div>

            {/* RATING */}
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
