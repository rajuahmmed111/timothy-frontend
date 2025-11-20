import React from "react";
import {
  MapPin,
  Star,
  Car,
  Clock,
  Users,
  Fuel,
  Settings,
  Wifi,
  Navigation,
  Wind,
  Baby,
  ExternalLink,
} from "lucide-react";
import CarBookingForm from "./CarBookingForm";
import { useLocation, useParams } from "react-router-dom";
import { useGetSingleCarQuery } from "../../redux/api/car/getAllCarsApi";
import ImageGallery from "./ImageGallery";
import Loader from "../../shared/Loader/Loader";

export default function CarServiceDetails() {
  const { id } = useParams();
  const locationHook = useLocation();
  const qs = new URLSearchParams(locationHook.search);
  const fromDate = qs.get("fromDate");
  const toDate = qs.get("toDate");
  const { data: carData, isLoading } = useGetSingleCarQuery(id);
  console.log("carData", carData);

  const rawCar = Array.isArray(carData?.data)
    ? carData?.data?.[0]
    : carData?.data;
    console.log("rawCar from car service details", rawCar);

  const car = rawCar
    ? {
        id: rawCar?.id,
        carType: rawCar?.carType,
        name: rawCar?.carModel || rawCar?.car_Rental?.carName || "Car Details",
        address: rawCar?.carAddress || "",
        location: [rawCar?.carAddress, rawCar?.carCity, rawCar?.carCountry]
          .filter(Boolean)
          .join(", "),
        images: rawCar?.carImages || ["/car/default-car.png"],
        price: `$${Number(rawCar?.carPriceDay ?? 0)}`,
        currency: rawCar?.currency,
        convertedPrice: Number(rawCar?.convertedPrice),
        pricePerDay: Number(rawCar?.carPriceDay) || 0,
        rating: parseFloat(rawCar?.carRating) || 0,
        carCancelationPolicy: rawCar?.car_Rental?.carCancelationPolicy,

        carReviewCount: rawCar?.carReviewCount,
        availability:
          rawCar?.isBooked === "AVAILABLE" ? "Available" : "Unavailable",
        mileage: rawCar?.carMileage,
        transmission: rawCar?.carTransmission,
        fuelType: rawCar?.fuelType || rawCar?.carOilType,
        seats: rawCar?.carSeats,
        description: rawCar?.carDescription,
        carServicesOffered: Array.isArray(rawCar?.carServicesOffered)
          ? rawCar.carServicesOffered
          : [],
      }
    : null;
    console.log("car data of raw car from car service details", car);

  const facilityIconMap = {
    AC: Wind,
    WiFi: Wifi,
    WIFI: Wifi,
    GPS: Navigation,
    "Child Seat": Baby,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Car not found.</p>
      </div>
    );
  }

  // Build complete address for accurate location
  const fullAddress = car?.location;
  console.log("fullAddress", fullAddress);

  const encodedQuery = encodeURIComponent(fullAddress);

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
        <header>
          <div className="container mx-auto py-5 mt-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {car?.name}
                  </h1>
                </div>
                <div className="flex items-center mt-2 text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{`${car?.location}`}</span>
                </div>
                <div className="flex items-center mt-3 gap-2">
                  <span className="text-xl font-normal ">
                    Average Rating :{" "}
                  </span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        car.rating >= star
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}{" "}
                  {""}
                  {car?.rating}
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-5 md:px-0 ">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-5">
            {/* Left Column - Car Details */}
            <div className="lg:col-span-2">
              <div className="mb-5">
                <ImageGallery car={car} />
              </div>
              <div className="mb-5">
                <h2 className="text-3xl font-bold mb-3">About This Car</h2>
                <p className="text-gray-700 mb-6">{car?.description}</p>

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Car Specifications</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Car className="w-5 h-5 text-sky-600 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Car Type</p>
                        <p className="font-medium">{car?.carType || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-sky-600 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Capacity</p>
                        <p className="font-medium">{car?.seats}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Fuel className="w-5 h-5 text-sky-600 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Fuel Type</p>
                        <p className="font-medium">{car?.fuelType || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Settings className="w-5 h-5 text-sky-600 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Transmission</p>
                        <p className="font-medium">
                          {car.transmission || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Fuel className="w-5 h-5 text-sky-600 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Mileage</p>
                        <p className="font-medium">{car.mileage || "N/A"}</p>
                      </div>
                    </div>
                    {/* <div className="flex items-center">
                      <Clock className="w-5 h-5 text-sky-600 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Availability</p>
                        <p className="font-medium">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              car.availability === "Available"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {car.availability || "N/A"}
                          </span>
                        </p>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
              {Array.isArray(car?.carServicesOffered) &&
                car.carServicesOffered.length > 0 && (
                  <div className="mb-5 space-y-4">
                    <h2 className="text-xl font-semibold">Facilities</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {car.carServicesOffered.map((service, idx) => {
                        const Icon = facilityIconMap[service] || Settings;
                        return (
                          <div
                            key={`${service}-${idx}`}
                            className="flex items-center"
                          >
                            <Icon className="w-5 h-5 text-sky-600 mr-2 flex-shrink-0" />
                            <div>
                              <p className="font-medium">{service}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              {(car?.rating || car?.carReviewCount) && (
                <div className="mb-5 space-y-3">
                  <div className="flex items-center gap-5">
                    <h2 className="text-xl font-semibold">Guest Reviews</h2>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Rating {car?.rating} · {car?.carReviewCount || 0} reviews
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={`guest-${star}`}
                        className={`w-5 h-5 ${
                          car.rating >= star
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600">
                      ({car?.rating})
                    </span>
                  </div>
                </div>
              )}
            </div>
            {/* Right Column - Booking Section */}
            <div className="lg:sticky lg:top-4 space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="relative h-[200px]">
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      fullAddress || ""
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
                          {car?.name || ""}
                        </h5>
                        <p className="text-xs text-gray-600 mt-0.5">
                       
                            {fullAddress}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star, i) => (
                            <Star
                              key={star}
                              className={`w-2.5 h-2.5 ${
                                i < Math.round(Number(car?.rating || 0))
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
              <CarBookingForm car={car} carIdFromParams={id} fromDate={fromDate} toDate={toDate} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
