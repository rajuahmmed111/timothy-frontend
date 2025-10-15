import React from "react";
import CarCard from "./CarCard";
import { useNavigate } from "react-router-dom";
import { useGetAllCarsQuery } from "../../redux/api/car/getAllCarsApi";
import { Spin } from "antd";

export default function PopularCar() {
  const navigate = useNavigate();
  const { data: carsData, isLoading, isError } = useGetAllCarsQuery(
    { page: 1, limit: 4 }
  );

  // Transform car data to match the expected car card props
  const transformCarData = (car) => ({
    id: car.id,
    name: car.car_Rental?.carName || car.carModel,
    location: `${car.carCity}, ${car.carCountry}`,
    image: car.carImages?.[0] || "/car/default-car.png",
    price: `$${car.carPriceDay}`,
    rating: parseFloat(car.carRating) || 4.5,
    type: car.carType,
    seats: car.carSeats,
    transmission: car.carTransmission,
    fuelType: car.fuelType,
    discount: car.discount,
    isAvailable: car.isBooked === "AVAILABLE",
  });

  if (isLoading) return <div className="text-center py-10"><Spin size="large" /></div>;
  if (isError) return <div>Error loading cars</div>;

  const cars = carsData?.data?.data?.map(transformCarData) || [];

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-5 md:px-0">
        <div className="mb-12 text-center lg:text-left">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Cars
            </h2>
            <button
              onClick={() => navigate("/car-details")}
              className="bg-[#0064D2] text-white px-4 py-2 rounded-lg text-sm font-bold"
            >
              View All
            </button>
          </div>
          <p className="text-gray-600 mx-auto lg:mx-0">
            Discover our most rented and trusted cars, carefully chosen for
            comfort, safety, and style. Whether you need a compact city car, a
            family SUV, or a luxury ride, we have the perfect option waiting for
            you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>

        {cars.length === 0 && !isLoading && (
          <div className="text-center py-10">
            <p className="text-gray-500">No cars found.</p>
          </div>
        )}
      </div>
    </section>
  );
}
