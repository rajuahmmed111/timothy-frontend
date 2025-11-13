import React, { useMemo, useState } from "react";
import {
  MapPin,
  Star,
  Car,
  Clock,
  Users,
  CheckCircle,
  Fuel,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import CarBookingForm from "./CarBookingForm";
import { useParams } from "react-router-dom";
import { useGetSingleCarQuery } from "../../redux/api/car/getAllCarsApi";
import ImageGallery from "./ImageGallery";

export default function CarServiceDetails() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { id } = useParams();
  const { data, isLoading } = useGetSingleCarQuery(id);

  const apiCar = data?.data;

  const car = useMemo(() => {
    if (!apiCar) return null;
    const images =
      Array.isArray(apiCar.carImages) && apiCar.carImages.length > 0
        ? apiCar.carImages
        : ["/car/default-car.png"];
    return {
      id: apiCar.id,
      name: apiCar.carModel || "Car Details",
      location: `${apiCar.carCity || ""}${
        apiCar.carCity && apiCar.carCountry ? ", " : ""
      }${apiCar.carCountry || ""}`,
      images,
      price: `$${apiCar.carPriceDay ?? 0}`,
      pricePerDay: Number(apiCar.carPriceDay) || 0,
      rating: parseFloat(apiCar.carRating) || 0,
      availability:
        apiCar.isBooked === "AVAILABLE" ? "Available" : "Unavailable",
      mileage: apiCar.carMileage,
      transmission: apiCar.carTransmission,
      fuelType: apiCar.fuelType || apiCar.carOilType,
      seats: apiCar.carSeats,
      year: undefined,
      description: apiCar.carDescription,
    };
  }, [apiCar]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading car details...</p>
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
    <div className="min-h-screen py-5 mt-5">
      <div className="container mx-auto">
        <div className="bg-white">
          <div className="flex flex-col items-start gap-5 mb-5">
            <h1 className="text-3xl font-bold text-gray-900">{car?.name}</h1>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-1 text-sky-600" />
              <span>{car?.location}</span>
            </div>
            <div className="flex items-center">
              Average Rating :
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
          <div className="md:flex">
            {/* Left Column - Car Details */}
            <div className="py-5 md:w-2/3">
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
            <div className="py-5 md:w-1/3">
              <CarBookingForm car={car} carIdFromParams={id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
