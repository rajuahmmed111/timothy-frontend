import React from "react";
import { Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";


function SecurityCard({ data, cards }) {
  const list = Array.isArray(cards)
    ? cards
    : Array.isArray(data?.data?.data)
    ? data.data.data
    : [];

  return (
    <>
      {list.map((item) => {
        const isPreMapped = Array.isArray(cards);
        const linkTo = isPreMapped
          ? item?.to || `/security-service-details/${item?.id || item?._id}`
          : `/security-service-details/${item?.id || item?._id}`;
        const image = isPreMapped ? item?.image : item?.businessLogo;
        const name = isPreMapped
          ? item?.name
          : item?.securityBusinessName || item?.securityName || "";
        const securityType = isPreMapped
          ? undefined
          : item?.securityProtocolType || item?.securityBusinessType;
        const securityPrice = isPreMapped
          ? item?.price
          : item?.securityPriceDay;
        const firstGuard = isPreMapped
          ? null
          : Array.isArray(item?.security_Guard)
          ? item.security_Guard[0]
          : item?.security_Guard;
        const securityCountry = isPreMapped
          ? item?.securityCountry
          : firstGuard?.securityCountry || item?.securityCountry;
        const securityCity = isPreMapped
          ? item?.securityCity
          : firstGuard?.securityCity || item?.securityCity;
        const location = isPreMapped
          ? item?.location
          : [securityCity, securityCountry].filter(Boolean).join(", ");
        const ownerName = isPreMapped ? item?.ownerName : item?.user?.fullName;
        const ownerAvatar = isPreMapped
          ? item?.ownerAvatar
          : item?.user?.profileImage;
        const rating = isPreMapped ? Number(item?.rating) || 0 : 0;
        const price = securityPrice;
        return (
          <Link
            key={item?.id || item?._id}
            to={linkTo}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 block"
          >
            {/* Hotel Image */}
            <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
              <img
                src={image}
                alt={name}
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
                {name}
              </h3>
              {ownerName && (
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={ownerAvatar || "/placeholder.svg"}
                    alt={ownerName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-sm text-gray-700 line-clamp-1">
                    {ownerName}
                  </span>
                </div>
              )}

              {!isPreMapped && (
                <p className="text-sm text-gray-600 line-clamp-2 flex items-center gap-2 mb-2">
                  Type: {securityType}
                </p>
              )}
              <p className="text-sm text-gray-600 line-clamp-2 flex items-center gap-2 mb-2">
                Location: {location}
              </p>
              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="text-2xl font-bold text-gray-900">{price}</div>
                <div className="flex items-center gap-1">
                  {(() => {
                    const raw = Number(rating) || 0;
                    const stars = Math.max(0, Math.min(5, Math.round(raw)));
                    return [...Array(stars)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ));
                  })()}
                  <span className="text-sm text-gray-600 ml-1">
                    {Number(rating) || 0}
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
      })}
    </>
  );
}

export default React.memo(SecurityCard);
