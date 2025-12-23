import React, { useState, useEffect } from "react";

import HotelHeader from "./HotelHeader";
import ImageGallery from "./ImageGallery";
import PropertyDetails from "./PropertyDetails";
import BookingForm from "./BookingForm";
import { useLocation, useParams } from "react-router-dom";
import { useGetHotelReviewsQuery } from "../../redux/api/hotel/hotelReviewsApi";
import { useGetHotelDetailsQuery } from "../../redux/api/hotel/hotelApi";
import { MapPin, Star, ExternalLink } from "lucide-react";
import { currencyByCountry } from "../../components/curenci";

export default function HotelDetails() {
  const [userCurrency, setUserCurrency] = useState("USD");
  const [userCountry, setUserCountry] = useState(null);
  const [conversionRate, setConversionRate] = useState(1);

  const location = useLocation();
  const { id: routeId } = useParams();
  const hotel = location.state?.hotel;
  const hotelId = hotel?._id ?? hotel?.id ?? routeId;
  const { data: reviews, isFetching: isReviewsFetching } =
    useGetHotelReviewsQuery(hotelId, { skip: !hotelId });
  const { data: hotelDetails, isFetching: isHotelFetching } =
    useGetHotelDetailsQuery(routeId, { skip: !!hotel });

  const hotelFromApi = hotelDetails?.data ?? hotelDetails;
  const hotelData = hotel || hotelFromApi;

  // Currency detection and conversion
  const basePrice = hotelData?.averagePrice ?? hotelData?.roomPrice ?? 0;
  const baseCurrency = hotelData?.roomCurrency ?? "USD";

  useEffect(() => {
    const detect = async () => {
      try {
        const res = await fetch("https://api.country.is/");
        const data = await res.json();
        const country = data.country;

        if (country && currencyByCountry[country]) {
          setUserCountry(country);
          const userCurr = currencyByCountry[country].code;
          setUserCurrency(userCurr);

          // Fetch conversion: baseCurrency → user's currency
          let rate = 1;

          if (baseCurrency !== userCurr) {
            const rateRes = await fetch(
              "https://open.er-api.com/v6/latest/USD"
            );
            const rateData = await rateRes.json();

            if (rateData?.rates) {
              const baseToUSD =
                baseCurrency === "USD" ? 1 : 1 / rateData.rates[baseCurrency];
              const usdToUser = rateData.rates[userCurr] || 1;
              rate = baseToUSD * usdToUser;
            }
          }

          setConversionRate(rate);
        }
      } catch (e) {
        setUserCurrency("USD");
        setConversionRate(1);
      }
    };

    detect();
  }, [baseCurrency]);

  // Price converted
  const convertedPrice = Number(basePrice * conversionRate).toFixed(2);

  // Build complete address for accurate location
  const fullAddress = [
    hotelData?.hotelName,
    hotelData?.hotelAddress,
    hotelData?.hotelPostalCode,
    hotelData?.hotelCity,
    hotelData?.hotelCountry,
  ]
    .filter(Boolean)
    .join(", ");

  const encodedQuery = encodeURIComponent(fullAddress);

  const openFullMap = () => {
    if (fullAddress) {
      const url = `https://www.google.com/maps/search/${encodedQuery}`;
      window.open(url, "_blank");
    } else {
      window.open("https://www.google.com/maps", "_blank");
    }
  };

  const reviewArray = Array.isArray(hotelData.averageReviewCount)
    ? hotelData.averageReviewCount
    : reviews?.data || [];
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
            </div>
            <div className="lg:sticky lg:top-4 space-y-4">
              {/* Interactive Map Component */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="relative h-[200px]">
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      ` ${hotelData?.hotelAddress}`
                    )}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
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
                        <h5 className="font-semibold text-xs text-gray-900">
                          {hotelData?.hotelName || ""}
                        </h5>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {[
                            hotelData?.hotelAddress,
                            hotelData?.hotelPostalCode,
                            hotelData?.hotelCity,
                            hotelData?.hotelCountry,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star, i) => (
                            <Star
                              key={star}
                              className={`w-2.5 h-2.5 ${
                                i < Math.round(Number(reviewAverage || 0))
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
              <BookingForm hotel={hotelData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
