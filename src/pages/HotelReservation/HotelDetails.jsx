import React from "react";

import HotelHeader from "./HotelHeader";
import ImageGallery from "./ImageGallery";
import PropertyDetails from "./PropertyDetails";
import BookingForm from "./BookingForm";
import { useLocation, useParams } from "react-router-dom";
import { useGetHotelReviewsQuery } from "../../redux/api/hotel/hotelReviewsApi";
import { useGetHotelDetailsQuery } from "../../redux/api/hotel/hotelApi";
import { MapPin, Star, ExternalLink } from "lucide-react";

export default function HotelDetails() {
  const location = useLocation();
  const { id: routeId } = useParams();
  const hotel = location.state?.hotel;

  const lat =
    typeof hotel?.hotelLate === "number" ? hotel.hotelLate : undefined;
  const lng =
    typeof hotel?.hotelLong === "number" ? hotel.hotelLong : undefined;
  const addressParts = [
    hotel?.hotelAddress,
    hotel?.hotelCity,
    hotel?.hotelCountry,
  ].filter(Boolean);
  const addressQuery = addressParts.join(", ");
  const mapQuery =
    lat !== undefined && lng !== undefined ? `${lat},${lng}` : addressQuery;
  const encodedQuery = encodeURIComponent(mapQuery || "");

  const openFullMap = () => {
    const url = mapQuery
      ? `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`
      : `https://www.google.com/maps`;
    window.open(url, "_blank");
  };
  const hotelId = hotel?._id ?? hotel?.id ?? routeId;
  const { data: reviews, isFetching: isReviewsFetching } =
    useGetHotelReviewsQuery(hotelId, { skip: !hotelId });
  const { data: hotelDetails, isFetching: isHotelFetching } =
    useGetHotelDetailsQuery(routeId, { skip: !!hotel });


  const hotelFromApi = hotelDetails?.data ?? hotelDetails;
  const hotelData = hotel || hotelFromApi;
console.log("hoteldata",hotelData)
  const reviewArray = Array.isArray(reviews?.data) ? reviews.data : [];
  const reviewCount = reviewArray.length;
  const reviewAverage = reviewCount
    ? reviewArray.reduce((sum, r) => sum + Number(r?.rating || 0), 0) /
      reviewCount
    : Number(hotelData?.averageRating || 0);

  if (!hotelData && isHotelFetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-gray-600">Loading hotel details...</p>
        </div>
      </div>
    );
  }

  if (!hotelData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-gray-600">
            No hotel selected. Please go back to the listings and choose a
            hotel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="min-h-screen bg-gray-50">
        <HotelHeader
          hotel={hotelData}
          reviewAverage={reviewAverage}
          reviewCount={reviewCount}
        />
        <main className="container mx-auto px-5 md:px-0 ">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-5">
            <div className="lg:col-span-2">
              <ImageGallery hotel={hotelData} />
              <PropertyDetails hotel={hotelData} />
              <section className="my-6 bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Reviews
                  </h2>
                  <span className="text-sm text-gray-600">
                    {reviewCount} review{reviewCount !== 1 ? "s" : ""}
                  </span>
                </div>
                {isReviewsFetching ? (
                  <p className="text-sm text-gray-500">Loading reviews...</p>
                ) : reviewCount === 0 ? (
                  <p className="text-sm text-gray-500">No reviews yet.</p>
                ) : (
                  <ul className="space-y-4">
                    {reviewArray.map((rev) => (
                      <li
                        key={rev.id}
                        className="border border-gray-100 rounded-md p-3"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {[1, 2, 3, 4, 5].map((s, i) => (
                            <span
                              key={s}
                              className={`w-3 h-3 inline-block ${
                                i < Math.round(Number(rev?.rating || 0))
                                  ? "bg-yellow-400"
                                  : "bg-gray-200"
                              }`}
                            ></span>
                          ))}
                          <span className="text-xs text-gray-600">
                            {Number(rev?.rating || 0).toFixed(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-800">
                          {rev?.comment || ""}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>

            <div className="gap-5">
              <div className="lg:col-span-1">
                <div className="flex items-center justify-between mb-4 w-full">
                  {/* Interactive Map Component */}
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden w-full h-48">
                    {/* Real Map Container */}
                    <div className="relative h-40">
                      <iframe
                        src={
                          mapQuery
                            ? `https://www.google.com/maps?q=${encodedQuery}&output=embed`
                            : undefined
                        }
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Hotel Location Map"
                      ></iframe>

                      {/* Map Overlay with Hotel Info */}
                      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-2 max-w-xs">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-red-500" />
                          <div>
                            <h5 className="font-semibold text-xs text-gray-900">
                              {hotel?.hotelName || ""}
                            </h5>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star, i) => (
                                <Star
                                  key={star}
                                  className={`w-2.5 h-2.5 ${
                                    i <
                                    Math.round(
                                      Number(
                                        (reviewAverage ??
                                          hotel?.averageRating) ||
                                          0
                                      )
                                    )
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Map Controls removed to avoid cross-origin reload issues */}
                    </div>

                    {/* View in full map link */}
                    <div className="bg-white border-t border-gray-100">
                      <button
                        onClick={openFullMap}
                        className="flex items-center justify-center w-full text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View in full map
                      </button>
                    </div>
                  </div>
                </div>
                <BookingForm hotel={hotelData} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
