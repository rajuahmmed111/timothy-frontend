import React from "react";
import { Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function CarCard({
  car,
  queryString,
  userCurrency,
  userCountry,
  conversionRate,
}) {
  // Use the converted price from PopularCar if available, otherwise fallback
  let finalPrice = car?.convertedPrice || 0;
  let displayCurrency = car?.displayCurrency || userCurrency || "USD";

  // If no converted price provided, do conversion as fallback
  if (!car?.convertedPrice && car?.price) {
    const basePrice = Number(car.price.replace(/[^0-9.]/g, "")) || 0;
    const baseCurrency = car?.currency || "USD";

    if (userCurrency && baseCurrency !== userCurrency && conversionRate) {
      finalPrice = Number(basePrice * conversionRate);
      displayCurrency = userCurrency;
    } else {
      finalPrice = basePrice;
      displayCurrency = baseCurrency;
    }
  }

  // Handle zero-decimal currencies like JPY
  const isZeroDecimalCurrency = ["JPY", "KRW", "VND"].includes(displayCurrency);
  const formattedPrice = isZeroDecimalCurrency
    ? Math.round(finalPrice).toLocaleString()
    : finalPrice.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
  return (
    <Link
      to={`/car-service-details/${car?.id}${queryString || ""}`}
      className="w-full"
    >
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Hotel Image */}
        <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
          <img
            src={car?.image || "/placeholder.svg"}
            alt={car?.name}
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
            {car?.name}
          </h3>
          {/* Hotel Location */}
          <p className="text-sm text-gray-600 line-clamp-2 flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4" /> {car?.location}
          </p>

          {/* Rating and Price */}
          <div className="flex items-center justify-between mb-3">
            <div className="text-2xl font-bold text-gray-900">
              {displayCurrency} {formattedPrice}
            </div>
            <div className="flex items-center gap-1">
              {[...Array(Math.floor(car?.rating || 0))].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                />
              ))}
              <span className="text-sm text-gray-600 ml-1">
                ({car?.rating || 0})
              </span>
            </div>
          </div>

          {/* Availability Badge */}
          {car?.isAvailable && (
            <div className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Available
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
