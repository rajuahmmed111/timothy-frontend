import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Star } from "lucide-react";

function SecurityCard({ data = [], securityProvider, to }) {
  const { search } = useLocation();
  const list = Array.isArray(data)
    ? data
    : securityProvider
    ? [securityProvider]
    : [];
  // const location = list.
  return (
    <>
      {list.map((data) => {
        const guard = Array.isArray(data?.security_Guard)
          ? data.security_Guard[0]
          : null;
        const location = [guard?.securityCity, guard?.securityCountry]
          .filter(Boolean)
          .join(", ");
        const name = data?.securityBusinessName;
        const image =
          (Array.isArray(data?.securityImages) && data.securityImages[0]) ||
          data?.user?.profileImage ||
          "/placeholder.svg";
        const price = data?.averagePrice;
        const symbol = data?.displayCurrency;
        const rating = Number(data?.averageRating);

        const target = `${
          to || `/security-service-details/${data?.id}`
        }${search}`;

        return (
          <Link
            key={data?.id || idx}
            to={target}
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
                  {[...Array(Math.max(0, Math.min(5, Math.round(rating))))].map(
                    (_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    )
                  )}
                  {/* Rating */}
                  <div className="flex items-center gap-2 ">
                    <span className="text-sm text-gray-600 ml-1">
                      {Number(rating) || 0}
                    </span>
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
