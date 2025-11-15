import React, { useMemo, useState } from "react";
import { MapPin, Star, Car, Clock, Users, Fuel, Settings } from "lucide-react";
import CarBookingForm from "./CarBookingForm";
import { useParams } from "react-router-dom";
import { useGetSingleCarQuery } from "../../redux/api/car/getAllCarsApi";
import ImageGallery from "./ImageGallery";
import Loader from "../../shared/Loader/Loader";

export default function CarServiceDetails() {
  const { id } = useParams();
  const { data: carData, isLoading } = useGetSingleCarQuery(id);

  console.log("carData", carData);

  const rawCar = Array.isArray(carData?.data)
    ? carData?.data?.[0]
    : carData?.data;

  const car = rawCar
    ? {
        id: rawCar?.id,
        name: rawCar?.carModel || rawCar?.car_Rental?.carName || "Car Details",
        location: `${rawCar?.carCity || ""}${
          rawCar?.carCity && rawCar?.carCountry ? ", " : ""
        }${rawCar?.carCountry || ""}`,
        images: rawCar?.carImages || ["/car/default-car.png"],
        price: `$${Number(rawCar?.carPriceDay ?? 0)}`,
        pricePerDay: Number(rawCar?.carPriceDay) || 0,
        rating: parseFloat(rawCar?.carRating) || 0,
        carReviewCount: rawCar?.carReviewCount,
        availability:
          rawCar?.isBooked === "AVAILABLE" ? "Available" : "Unavailable",
        mileage: rawCar?.carMileage,
        transmission: rawCar?.carTransmission,
        fuelType: rawCar?.fuelType || rawCar?.carOilType,
        seats: rawCar?.carSeats,
        description: rawCar?.carDescription,
      }
    : null;

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
                <h2 className="text-xl font-semibold mb-3">About This Car</h2>
                <p className="text-gray-700 mb-6">{car?.description}</p>

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Car Specifications</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Car className="w-5 h-5 text-sky-600 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Year</p>
                        <p className="font-medium">{car?.year || "N/A"}</p>
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
                    <div className="flex items-center">
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
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Section */}
            <div className="lg:sticky lg:top-4 space-y-4">
              <CarBookingForm car={car} carIdFromParams={id} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
