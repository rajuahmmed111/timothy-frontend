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
import { useParams, useLocation } from "react-router-dom";
import { useGetSecurityProtocolsQuery } from "../../redux/api/security/getAllSecurityApi";
import ImageGallery from "./ImageGallery";
import { useNavigate } from "react-router-dom";

export default function SecurityServiceDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const { data } = useGetSecurityProtocolsQuery();
 

  // === RECEIVE DATA FROM SECURITYCARD ===
  const stateList = location.state?.security || [];
 

  // === FILTER SPECIFIC BUSINESS ===
  const business = React.useMemo(() => {
    if (!Array.isArray(stateList)) return null;
    return stateList.find((item) => String(item?.id) === String(id)) || null;
  }, [stateList, id]);

  const guard = React.useMemo(() => {
    if (!business || !Array.isArray(business.security_Guard)) return null;
    return business.security_Guard[0] || null;
  }, [business]);



  const cancelationPolicy = business?.security?.securityCancelationPolicy;

  // === ADDRESS FORMAT ===
  const guardAddressParts = [
    guard?.securityAddress || business?.securityAddress,
    guard?.securityPostalCode || business?.securityPostalCode,
    guard?.securityCity || business?.securityCity,
    guard?.securityCountry || business?.securityCountry,
  ].filter(Boolean);

  const fullAddress = guardAddressParts.join(", ");
  const encodedQuery = encodeURIComponent(fullAddress);

  const displayRating =
    Number(
      business?.averageRating !== undefined
        ? business.averageRating
        : business?.securityRating
    ) || 0;
  const reviewCount =
    business?.averageReviewCount !== undefined
      ? business.averageReviewCount
      : business?.securityReviewCount;

  const openFullMap = () => {
    if (fullAddress) {
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
              className="flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
              <span className="ml-2 text-gray-600">Back to Security</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {business?.securityGuardName || business?.securityBusinessName}
            </h1>

            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-gray-600" />
              <span className="font-medium">Location:</span>
              <span>
                {[
                  guard?.securityCity || business?.securityCity,
                  guard?.securityCountry || business?.securityCountry,
                ]
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
                      i < Math.round(displayRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span>
                  {displayRating.toFixed(1)}
                  {reviewCount ? ` (${reviewCount})` : ""}
                </span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-5">
            <div className="lg:col-span-2">
              {/* Image Gallery */}
              {(() => {
                if (!business) return null;

                const businessImages = Array.isArray(business.securityImages)
                  ? business.securityImages
                  : [];

                const guardImages = Array.isArray(business.security_Guard)
                  ? business.security_Guard.flatMap((g) =>
                      Array.isArray(g.securityImages) ? g.securityImages : []
                    )
                  : [];

                const images = [
                  business.businessLogo,
                  business.user?.profileImage,
                  ...businessImages,
                  ...guardImages,
                ].filter(Boolean);

                return (
                  <ImageGallery
                    images={images}
                    alt={
                      business.securityBusinessName ||
                      business.securityName ||
                      "Security Service"
                    }
                  />
                );
              })()}

              {/* Smart Info Card */}
              <div className="mt-6 rounded-2xl bg-gradient-to-br from-white/90 to-gray-50 backdrop-blur-md border border-gray-200 shadow-[0_6px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 p-6 hover:-translate-y-1">
                {/* BADGE SECTION */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-700">
                      <Shield className="w-3.5 h-3.5 text-gray-600" />
                      {guard.category}
                    </span>

                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-medium text-blue-700">
                      {guard.originalCurrency}
                      {guard.convertedPrice}/day
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-yellow-50 to-yellow-100 px-3 py-1 shadow-sm border border-yellow-200">
                    <span className="inline-flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star, i) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            i < Math.round(displayRating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </span>
                    <span className="text-xs font-semibold text-yellow-800">
                      {displayRating.toFixed(1)}
                      {business?.securityReviewCount
                        ? ` (${business.securityReviewCount})`
                        : ""}
                    </span>
                  </div>
                </div>

                {/* Tagline */}

                <div className="bg-white/70 border border-gray-100 rounded-xl shadow-sm p-3 mb-3">
                  <h3 className="text-base font-semibold text-gray-900">
                    {guard.securityGuardDescription}
                  </h3>
                </div>

                {/* Address + Contact */}
                <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
                  <div className="flex items-start gap-2 text-sm text-gray-700 bg-gray-50 border border-gray-100 rounded-lg p-2.5 shadow-sm flex-1">
                    <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="truncate">{fullAddress}</span>
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

                {/* Booking condition */}
                {(business?.securityBookingCondition ||
                  business?.securityCancelationPolicy) && (
                  <div className="bg-white/70 border border-gray-100 rounded-xl p-3 shadow-sm mb-4">
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

                {/* SERVICES */}
                {Array.isArray(guard?.securityServicesOffered) &&
                  guard.securityServicesOffered.length > 0 && (
                    <div className="bg-white/80 border border-gray-100 rounded-xl p-3 shadow-sm mb-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">
                        Services Offered
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {guard.securityServicesOffered.map((service, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-[11px] font-medium text-blue-700 border border-blue-100"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Description */}
                {(guard?.securityGuardDescription ||
                  business?.securityProtocolDescription) && (
                  <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl p-3 shadow-inner mb-4">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {guard?.securityGuardDescription ||
                        business.securityProtocolDescription}
                    </p>
                  </div>
                )}

                {/* Additional Info */}
                <div className="bg-white/80 border border-gray-100 rounded-xl p-3 shadow-sm space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Additional Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                    {typeof guard?.experience === "number" && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <span>
                          Experience:{" "}
                          <span className="font-semibold">
                            {guard.experience} years
                          </span>
                        </span>
                      </div>
                    )}

                    {guard?.availability && (
                      <div>
                        <span className="font-semibold">Availability: </span>
                        <span>{guard.availability}</span>
                      </div>
                    )}

                    {Array.isArray(guard?.languages) &&
                      guard.languages.length > 0 && (
                        <div>
                          <span className="font-semibold">Languages: </span>
                          <span>{guard.languages.join(", ")}</span>
                        </div>
                      )}

                    {guard?.certification && (
                      <div>
                        <span className="font-semibold">Certification: </span>
                        <span>{guard.certification}</span>
                      </div>
                    )}

                    {Array.isArray(guard?.securityBookingAbleDays) &&
                      guard.securityBookingAbleDays.length > 0 && (
                        <div className="sm:col-span-2">
                          <span className="font-semibold">Booking Days: </span>
                          <span>
                            {guard.securityBookingAbleDays.join(", ")}
                          </span>
                        </div>
                      )}

                    {guard?.category && (
                      <div>
                        <span className="font-semibold">Category: </span>
                        <span>{guard.category}</span>
                      </div>
                    )}

                    {cancelationPolicy && (
                      <div>
                        <span className="font-semibold">
                          Cancelation Policy:
                        </span>
                        <span className="text-gray-600">
                          {cancelationPolicy}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:sticky lg:top-4 space-y-4">
              {/* MAP */}
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
                    title="Security Location Map"
                  ></iframe>

                  {/* Small Overlay */}
                  <div className="absolute top-2 left-2 right-2 bg-white/80 backdrop-blur-md rounded-xl shadow-md p-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
                      <div className="min-w-0">
                        {/* <h5 className="font-semibold text-xs text-gray-900 truncate">
                          {guard?.securityGuardName ||
                            business?.securityGuardName ||
                            business?.securityBusinessName ||
                            business?.security?.securityName ||
                            "Security Service"}
                        </h5> */}

                        {(guard?.securityCity ||
                          guard?.securityCountry ||
                          business?.securityCity ||
                          business?.securityCountry) && (
                          <p className="text-[11px] text-gray-600 truncate">
                            {[
                              guard?.securityCity || business?.securityCity,
                              guard?.securityCountry ||
                                business?.securityCountry,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        )}

                        <div className="mt-1 flex items-center gap-2">
                          {/* Rating */}
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-yellow-50 px-1.5 py-0.5 text-[10px] text-yellow-800">
                            {[1, 2, 3, 4, 5].map((star, i) => (
                              <Star
                                key={star}
                                className={`w-2.5 h-2.5 ${
                                  i < Math.round(displayRating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                            {displayRating.toFixed(1)}
                          </span>

                          {/* Price */}
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] text-blue-700">
                            {guard.displayCurrency} {guard.convertedPrice}/day
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Full Map Button */}
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
              <SecurityBookingForm data={guard} policy={stateList} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
