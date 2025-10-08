import React from "react";
import CarCard from "./CarCard";
import { useNavigate } from "react-router-dom";

export default function PopularCar() {
  const navigate = useNavigate();
  const cars = [
    {
      name: "Mazda MX5",
      location: "New York, USA",
      image: "/car/1.png",
      price: "$500",
      rating: 5,
    },
    {
      name: "Mercedes E 300 ",
      location: "New York, USA",
      image: "/car/2.png",
      price: "$75",
      rating: 4,
    },
    {
      name: "Toyota Corolla",
      location: "New York, USA",
      image: "/car/3.png",
      price: "$425",
      rating: 5,
    },
    {
      name: "BMW X7",
      location: "New York, USA",
      image: "/car/4.png",
      price: "$450",
      rating: 5,
    },
  ];

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-5 md:px-0">
        {/* Section Header */}
        <div className="mb-12 text-center lg:text-left">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Cars
            </h2>
            <button
              onClick={() => navigate("/popular-car")}
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

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cars.map((car, index) => (
            <CarCard key={index} car={car} />
          ))}
        </div>
      </div>
    </section>
  );
}
