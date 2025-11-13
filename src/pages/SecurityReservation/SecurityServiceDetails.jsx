import React from "react";

import { MapPin, Star, ExternalLink } from "lucide-react";
import SecurityBookingForm from "./SecurityBookingForm";
import { useParams } from "react-router-dom";
import { useGetAllSecurityProtocolsQuery } from "../../redux/api/security/securityApi";
import ImageGallery from "./ImageGallery";

export default function SecurityServiceDetails() {
  const { id } = useParams();
  const { data } = useGetAllSecurityProtocolsQuery();
  const businesses = Array.isArray(data?.data?.data) ? data.data.data : [];
  const business = React.useMemo(
    () => businesses.find((b) => String(b?.id) === String(id)),
    [businesses, id]
  );

  const firstGuard = Array.isArray(business?.security_Guard)
    ? business.security_Guard[0]
    : null;
  const fullAddress = [firstGuard?.securityCity, firstGuard?.securityCountry]
    .filter(Boolean)
    .join(", ");
  const encodedQuery = encodeURIComponent(fullAddress);
  const displayRating = Number(business?.averageRating) || 0;

  const openFullMap = () => {
    if (fullAddress) {
      // Using place search for more accurate results
      const url = `https://www.google.com/maps/search/${encodedQuery}`;
      window.open(url, "_blank");
    } else {
      window.open("https://www.google.com/maps", "_blank");
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-5 md:px-0 ">
          {/* Header Info */}
          <div className="py-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {business?.securityBusinessName || business?.securityName || "Security Service"}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <span className="inline-flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                {displayRating}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {fullAddress || "Location not provided"}
              </span>
              <span>
                {(business?.currencySymbol || "$")}{business?.averagePrice ?? 0}/day
              </span>
              <span>{business?.securityProtocolType || business?.securityBusinessType}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-5">
            <div className="lg:col-span-2">
              {(() => {
                const guardImgs = Array.isArray(business?.security_Guard)
                  ? business.security_Guard.flatMap((g) =>
                      Array.isArray(g?.securityImages) ? g.securityImages : []
                    )
                  : [];
                const images = [business?.businessLogo, ...guardImgs].filter(Boolean);
                return (
                  <ImageGallery images={images} alt={business?.securityBusinessName || business?.securityName || "Security Service"} />
                );
              })()}
            </div>

            <div className="lg:sticky lg:top-4 space-y-4">
              {/* Interactive Map Component */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="relative h-[200px]">
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodedQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                    width="100%"
                    height="100%"
                    className="absolute inset-0"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Hotel Location Map"
                  ></iframe>

                  {/* Map Overlay with Hotel Info */}
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-2 max-w-xs">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-8 text-red-500 mt-0.5" />
                      <div>
                        <h5 className="font-semibold text-xs text-gray-900"></h5>
                        <p className="text-xs text-gray-600 mt-0.5"></p>
                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star, i) => (
                            <Star
                              key={star}
                              className={`w-2.5 h-2.5 ${
                                i < Math.round(Number(displayRating || 0))
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* View in full map link */}
                <div className="bg-white border-t border-gray-100 p-2">
                  <button
                    onClick={openFullMap}
                    className="flex items-center justify-center w-full text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors py-1"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View in full map
                  </button>
                </div>
              </div>

              {/* Booking Form */}
              <SecurityBookingForm data={business?.security_Guard}/>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
