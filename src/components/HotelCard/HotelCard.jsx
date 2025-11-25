import React, { useState, useEffect } from "react";
import { Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { currencyByCountry } from "../curenci";

export default function HotelCard({ hotel }) {
  const [userCurrency, setUserCurrency] = useState("USD");
  const [userCountry, setUserCountry] = useState(null);
  const [conversionRate, setConversionRate] = useState(1);

  const basePrice = hotel?.raw?.averagePrice ?? 0;
  const baseCurrency = hotel?.raw?.roomCurrency ?? "USD"; // Use roomCurrency from API response
  console.log("basePrice", basePrice, "baseCurrency", baseCurrency);

  useEffect(() => {
    const detect = async () => {
      try {
        const res = await fetch("https://api.country.is/");
        const data = await res.json();
        const country = data.country;

        if (country && currencyByCountry[country]) {
          setUserCountry(country);
          const userCurr = currencyByCountry[country].code;
          setUserCurrency(userCurr);

          // Fetch conversion: baseCurrency → user's currency
          let rate = 1; // Default if no conversion needed

          if (baseCurrency !== userCurr) {
            // Convert baseCurrency to USD first, then to userCurr
            const rateRes = await fetch(
              "https://open.er-api.com/v6/latest/USD"
            );
            const rateData = await rateRes.json();

            if (rateData?.rates) {
              const baseToUSD =
                baseCurrency === "USD" ? 1 : 1 / rateData.rates[baseCurrency];
              const usdToUser = rateData.rates[userCurr] || 1;
              rate = baseToUSD * usdToUser;
            }
          }

          setConversionRate(rate);
        }
      } catch (e) {
        console.log("Detection or conversion failed", e);
        setUserCurrency("USD");
        setConversionRate(1);
      }
    };

    detect();
  }, [baseCurrency]); // Add baseCurrency dependency

  // Price converted
  const convertedPrice = Number(basePrice * conversionRate).toFixed(2);
  console.log("Conversion details:", {
    basePrice,
    baseCurrency,
    userCurrency,
    conversionRate,
    convertedPrice,
  });

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
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
          <img
            src={hotelImage || "/placeholder.svg"}
            alt={hotel.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Details */}
        <div className="p-5">
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
            {hotel?.raw?.hotelBusinessName || hotel?.name}
          </h3>

          <p className="text-sm text-gray-600 flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4" /> {hotel.location}
          </p>

          <div className="flex items-center justify-between mb-3">
            {/* Converted Price */}
            <div className="text-sm font-bold text-gray-900">
              {userCurrency} {Number(convertedPrice).toLocaleString()}
            </div>

            {/* Rating */}
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
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
