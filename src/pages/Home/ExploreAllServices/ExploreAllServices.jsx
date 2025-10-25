import React from "react";
import ServiceCard from "../../../components/ServiceCard/ServiceCard";
import { Car, Shield, MapPin, House } from "lucide-react";

export default function ExploreAllServices() {
  const services = [
    {
      title: "Hotel Reservation",
      image: "/ExploreAllServices/1.png",
      to: "/hotel",

    },
    {
      title: "Car Rental",
      image: "/ExploreAllServices/2.png",
      to: "/car-reservation",
    },
    {
      title: "Security Protocol",
      image: "/ExploreAllServices/3.png",
      to: "/security-reservation",
    },
    {
      title: "Attractions",
      image: "/ExploreAllServices/4.png",
      to: "/attraction-reservation",
    },
  ];

  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center lg:text-left">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explore Our All Services
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto lg:mx-0">
            From comfortable accommodations and reliable car rentals, to
            security protocols and local attractions — everything you need for a
            perfect trip.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
