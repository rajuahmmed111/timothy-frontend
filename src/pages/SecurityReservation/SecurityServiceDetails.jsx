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
  ArrowLeft,
} from "lucide-react";
import SecurityBookingForm from "./SecurityBookingForm";
import { useParams } from "react-router-dom";
import { useGetSecurityProtocolsQuery } from "../../redux/api/security/getAllSecurityApi";
import ImageGallery from "./ImageGallery";
import { useNavigate } from "react-router-dom";

export default function SecurityServiceDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data } = useGetSecurityProtocolsQuery();
  console.log("data of hasan", data);
  const guards = Array.isArray(data?.data?.data) ? data.data.data : [];
  const business = React.useMemo(
    () => guards.find((g) => String(g?.id) === String(id)),
    [guards, id]
  );
  const cancelationPolicy = business?.security?.securityCancelationPolicy;
  // console.log("cancelationPolicy", cancelationPolicy);
  // console.log("business", business);
  console.log("business of hasan", business);

  const guardAddressParts = [
    business?.securityAddress,
    business?.securityPostalCode,
    business?.securityCity,
    business?.securityCountry,
  ].filter(Boolean);
  const fullAddress = guardAddressParts.join(", ");
  const encodedQuery = encodeURIComponent(fullAddress);
  const displayRating = Number(business?.securityRating) || 0;

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
            <div
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
              <span className="ml-2 text-gray-600">Back to Security</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {business?.securityGuardName || "Security Service"}
            </h1>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-gray-600" />
              <span className="font-medium">Location:</span>
              <span>
                {[business?.securityCity, business?.securityCountry]
                  .filter(Boolean)
                  .join(", ") || "Not provided"}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <span className="inline-flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star, i) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      i < Math.round(Number(displayRating || 0))
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span>{Number(displayRating || 0).toFixed(1)}</span>
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-5">
            <div className="lg:col-span-2">
              {(() => {
                const guardImgs = Array.isArray(business?.securityImages)
                  ? business.securityImages
                  : [];
                const images = [
                  business?.user?.profileImage,
                  ...guardImgs,
                ].filter(Boolean);
                return (
                  <ImageGallery
                    images={images}
                    alt={
                      business?.securityGuardName ||
                      business?.security?.securityName ||
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
                      {business?.security?.securityProtocolType || "N/A"}
                    </span>

                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-medium text-blue-700">
                      {business?.currency || "BDT"}
                      {business?.securityPriceDay ?? 0}/day
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
                      {typeof business?.securityReviewCount === "number"
                        ? ` (${business.securityReviewCount})`
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

                {/* Services Offered */}
                {Array.isArray(business?.securityServicesOffered) &&
                  business.securityServicesOffered.length > 0 && (
                    <div className="bg-white/80 border border-gray-100 rounded-xl p-3 shadow-sm mb-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">
                        Services Offered
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {business.securityServicesOffered.map(
                          (service, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-[11px] font-medium text-blue-700 border border-blue-100"
                            >
                              {service}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Description */}
                {business?.securityProtocolDescription && (
                  <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl p-3 shadow-inner mb-4">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {business.securityProtocolDescription}
                    </p>
                  </div>
                )}

                {/* Additional Info */}
                <div className="bg-white/80 border border-gray-100 rounded-xl p-3 shadow-sm space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Additional Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                    {typeof business?.experience === "number" && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <span>
                          Experience:{" "}
                          <span className="font-semibold">
                            {business.experience} years
                          </span>
                        </span>
                      </div>
                    )}

                    {business?.availability && (
                      <div>
                        <span className="font-semibold">Availability: </span>
                        <span>{business.availability}</span>
                      </div>
                    )}

                    {Array.isArray(business?.languages) &&
                      business.languages.length > 0 && (
                        <div>
                          <span className="font-semibold">Languages: </span>
                          <span>{business.languages.join(", ")}</span>
                        </div>
                      )}

                    {business?.certification && (
                      <div>
                        <span className="font-semibold">Certification: </span>
                        <span>{business.certification}</span>
                      </div>
                    )}

                    {Array.isArray(business?.securityBookingAbleDays) &&
                      business.securityBookingAbleDays.length > 0 && (
                        <div className="sm:col-span-2">
                          <span className="font-semibold">Booking Days: </span>
                          <span>
                            {business.securityBookingAbleDays.join(", ")}
                          </span>
                        </div>
                      )}

                    {business?.category && (
                      <div>
                        <span className="font-semibold">Category: </span>
                        <span>{business.category}</span>
                      </div>
                    )}
                    {cancelationPolicy && (
                      <div>
                        <span className="font-semibold">
                          Cancelation Policy:{" "}
                        </span>
                        <span className=" text-gray-600">
                          {cancelationPolicy}
                        </span>
                      </div>
                    )}
                    {/* {business?.isBooked && (
                      <div>
                        <span className="font-semibold">Status: </span>
                        <span
                          className={
                            business.isBooked === "AVAILABLE"
                              ? "text-green-600 font-semibold"
                              : "text-red-600 font-semibold"
                          }
                        >
                          {business.isBooked}
                        </span>
                      </div>
                    )} */}
                  </div>
                </div>
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
                          {business?.securityGuardName ||
                            business?.security?.securityName ||
                            "Security Service"}
                        </h5>
                        {business?.securityCity && (
                          <p className="text-[11px] text-gray-600 truncate">
                            {business.securityCity}
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
                            {business?.currency || "BDT"}
                            {business?.securityPriceDay ?? 0}/day
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
              <SecurityBookingForm data={business ? [business] : []} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
