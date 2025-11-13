import React from "react";

import {
  MapPin,
  Star,
  ExternalLink,
  Phone,
  Mail,
  Shield,
  Calendar,
  Info,
} from "lucide-react";
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
  console.log("business", business);

  const firstGuard = Array.isArray(business?.security_Guard)
    ? business.security_Guard[0]
    : null;

  const guardAddressParts = [
    firstGuard?.securityAddress,
    firstGuard?.securityPostalCode,
    firstGuard?.securityCity,
    firstGuard?.securityCountry,
  ].filter(Boolean);
  const fullAddress = guardAddressParts.join(", ");
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
          <div className="py-6 mt-6 mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {business?.securityBusinessName ||
                business?.securityName ||
                "Security Service"}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <span className="inline-flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                {displayRating}
              </span>
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
                const images = [business?.businessLogo, ...guardImgs].filter(
                  Boolean
                );
                return (
                  <ImageGallery
                    images={images}
                    alt={
                      business?.securityBusinessName ||
                      business?.securityName ||
                      "Security Service"
                    }
                  />
                );
              })()}

              {/* Smart Info Card */}
              <div className="mt-6 rounded-2xl bg-gradient-to-br from-white/90 to-gray-50 backdrop-blur-md border border-gray-200 shadow-[0_6px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 p-6 hover:-translate-y-1">
                {/* Header section */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-700">
                      <Shield className="w-3.5 h-3.5 text-gray-600" />
                      {business?.securityProtocolType ||
                        business?.securityBusinessType ||
                        "N/A"}
                    </span>

                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-medium text-blue-700">
                      {business?.currencySymbol || "$"}
                      {business?.averagePrice ?? 0}/day
                    </span>
                  </div>

                  {/* Rating box */}
                  <div className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-yellow-50 to-yellow-100 px-3 py-1 shadow-sm border border-yellow-200">
                    <span className="inline-flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star, i) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            i < Math.round(Number(displayRating || 0))
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </span>
                    <span className="text-xs font-semibold text-yellow-800">
                      {Number(displayRating || 0).toFixed(1)}
                      {typeof business?.averageReviewCount === "number"
                        ? ` (${business.averageReviewCount})`
                        : ""}
                    </span>
                  </div>
                </div>

                {/* Tagline box */}
                {business?.securityTagline && (
                  <div className="bg-white/70 border border-gray-100 rounded-xl shadow-sm p-3 mb-3">
                    <h3 className="text-base font-semibold text-gray-900">
                      {business.securityTagline}
                    </h3>
                  </div>
                )}

                {/* Address + Contact */}
                <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
                  <div className="flex items-start gap-2 text-sm text-gray-700 bg-gray-50 border border-gray-100 rounded-lg p-2.5 shadow-sm flex-1">
                    <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="truncate">
                      {fullAddress || "Location not provided"}
                    </span>
                  </div>

                  {(business?.securityPhone || business?.securityEmail) && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm text-gray-700 bg-gray-50 border border-gray-100 rounded-lg p-2.5 shadow-sm flex-1">
                      {business?.securityPhone && (
                        <span className="inline-flex items-center gap-1">
                          <Phone className="w-4 h-4 text-gray-600" />
                          {business.securityPhone}
                        </span>
                      )}
                      {business?.securityEmail && (
                        <span className="inline-flex items-center gap-1">
                          <Mail className="w-4 h-4 text-gray-600" />
                          {business.securityEmail}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Booking condition + cancel policy */}
                {(business?.securityBookingCondition ||
                  business?.securityCancelationPolicy) && (
                  <div className="bg-white/70 border border-gray-100 rounded-xl p-3 shadow-sm mb-4">
                    {business?.securityBookingCondition && (
                      <div className="flex items-start gap-2 mb-2">
                        <Info className="w-3.5 h-3.5 mt-0.5 text-blue-600" />
                        <span className="text-sm text-gray-700 leading-snug">
                          {business.securityBookingCondition}
                        </span>
                      </div>
                    )}
                    {business?.securityCancelationPolicy && (
                      <div className="flex items-start gap-2">
                        <Info className="w-3.5 h-3.5 mt-0.5 text-rose-600" />
                        <span className="text-sm text-gray-700 leading-snug">
                          {business.securityCancelationPolicy}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Description */}
                {business?.securityProtocolDescription && (
                  <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl p-3 shadow-inner">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {business.securityProtocolDescription}
                    </p>
                  </div>
                )}
              </div>
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
                  <div className="absolute top-2 left-2 right-2 bg-white/80 backdrop-blur-md rounded-xl shadow-md p-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
                      <div className="min-w-0">
                        <h5 className="font-semibold text-xs text-gray-900 truncate">
                          {business?.security_Guard?.securityName ||
                            "Security Service"}
                        </h5>
                        {firstGuard?.securityCity && (
                          <p className="text-[11px] text-gray-600 truncate">
                            {firstGuard.securityCity}
                          </p>
                        )}
                        <div className="mt-1 flex items-center gap-2">
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-yellow-50 px-1.5 py-0.5 text-[10px] text-yellow-800">
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
                            {Number(displayRating || 0).toFixed(1)}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] text-blue-700">
                            {business?.currencySymbol || "$"}
                            {business?.averagePrice ?? 0}/day
                          </span>
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
              <SecurityBookingForm data={business?.security_Guard} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
