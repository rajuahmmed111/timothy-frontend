import React from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

function SecurityCard({ data = [] }) {
  const list = Array.isArray(data) ? data : [];
  return (
    <>
      {list.map((b, idx) => {
        const firstGuard = Array.isArray(b?.security_Guard)
          ? b.security_Guard[0]
          : null;
        const location = [firstGuard?.securityCity, firstGuard?.securityCountry]
          .filter(Boolean)
          .join(", ");
        const name = b?.securityBusinessName || b?.securityName || "Security Service";
        const image = b?.businessLogo || "/placeholder.svg";
        const price = b?.averagePrice ?? 0;
        const symbol = b?.currencySymbol || "$";
        const rating = Number(b?.averageRating) || 0;

        return (
          <Link
            key={b?.id || idx}
            to={`/security-service-details/${b?.id}`}
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
                {location || "Not provided"}
              </p>


              {/* Price & Button */}
              <div className="flex items-center justify-between mt-4">
                <div>
                  <p className="text-sm text-gray-500">Starting from</p>
                  <p className="text-xl font-bold text-[#0064D2]">{`${symbol}${price}/day`}</p>
                </div>
                <div className="flex items-center justify-center gap-1">
                  {[...Array(Math.max(0, Math.min(5, Math.round(rating))))].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
              {/* Rating */}
              <div className="flex items-center gap-2 ">
                <span className="text-sm text-gray-600 ml-1">{Number(rating) || 0}</span>
              </div>
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
