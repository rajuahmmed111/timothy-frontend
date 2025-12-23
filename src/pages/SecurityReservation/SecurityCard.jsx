import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Star } from "lucide-react";
import { currencyByCountry } from "../../components/curenci";

function SecurityCard({
  data,
  securityProvider,
  to,
  userCurrency,
  userCountry,
  conversionRate,
}) {
  const { search } = useLocation();

  // Handle both single business and array of businesses
  const list = Array.isArray(data)
    ? data
    : securityProvider
    ? [securityProvider]
    : data
    ? [data]
    : [];

  return (
    <>
      {list.map((business) => {
        // Extract business information
        const name =
          business?.securityBusinessName ||
          business?.securityName ||
          "Security Service";
        const image =
          business?.businessLogo ||
          business?.user?.profileImage ||
          "/placeholder.svg";
        const rating = Number(business?.averageRating) || 0;

        // Calculate average price from guards or use business average
        const basePrice = Number(business?.averagePrice) || 0;
        const baseCurrency =
          business?.securityurrency || business?.displayCurrency || "USD";

        // Calculate converted price
        let convertedPrice = basePrice;
        let displayCurrency = userCurrency || baseCurrency;

        if (userCurrency && baseCurrency !== userCurrency && conversionRate) {
          convertedPrice = Number(basePrice * conversionRate).toFixed(2);
        }

        // Get location from first available guard or business
        const firstGuard = Array.isArray(business?.security_Guard)
          ? business.security_Guard[0]
          : null;
        const location = [
          firstGuard?.securityCity || business?.securityCity,
          firstGuard?.securityCountry || business?.securityCountry,
        ]
          .filter(Boolean)
          .join(", ");

        const target = `${
          to || `/security-service-details/${business?.id}`
        }${search}`;

        return (
          <Link
            key={business?.id}
            to={target}
            state={{ security: [business] }}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 block"
          >
            {/* Card Image */}
            <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute top-3 right-3">
                <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700 shadow">
                  Popular
                </div>
              </div>
            </div>

            {/* Card Details */}
            <div className="p-5">
              <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                {name}
              </h3>

              <p className="text-sm text-gray-600 line-clamp-2 flex items-center gap-2 mb-3">
                <span className="font-medium text-gray-800">Location:</span>
                {location || "Multiple locations"}
              </p>

              {/* Price & Rating */}
              <div className="flex items-center justify-between mt-4">
                <div>
                  <p className="text-sm text-gray-500">Starting from</p>
                  <p className="text-xl font-bold text-[#0064D2]">
                    {`${displayCurrency} ${Number(
                      convertedPrice
                    ).toLocaleString()}/day`}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-1">
                  {[...Array(Math.max(0, Math.min(5, Math.round(rating))))].map(
                    (_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    )
                  )}
                  <span className="text-sm text-gray-600 ml-1">
                    {Number(rating).toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </>
  );
}

export default React.memo(SecurityCard);
