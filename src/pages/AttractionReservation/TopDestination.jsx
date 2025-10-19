import React from "react";
import img1 from "/RecommendedAttractions/1.png";
import img2 from "/RecommendedAttractions/2.png";
import img3 from "/RecommendedAttractions/3.png";
import img4 from "/RecommendedAttractions/4.png";
import AttractionCard from "./AttractionCard";

export default function TopDestination() {
  const services = [
    {
      title: "New York",
      image: img1,
      // icon: House,
      description: "564 things to do",
    },
    {
      title: "Istanbul",
      image: img2,
      // icon: Car,
      description: "564 things to do",
    },
    {
      title: "London",
      image: img3,
      // icon: Shield,
      description: "564 things to do",
    },
    {
      title: "Dubai",
      image: img4,
      // icon: MapPin,
      description: "564 things to do",
    },
    {
      title: "Berlin",
      image: img1,
      // icon: House,
      description: "564 things to do",
    },
    {
      title: "Rome",
      image: img2,
      // icon: Car,
      description: "564 things to do",
    },
    {
      title: "Lisbon",
      image: img3,
      // icon: Shield,
      description: "564 things to do",
    },
    {
      title: "Paris",
      image: img4,
      // icon: MapPin,
      description: "564 things to do",
    },
  ];

  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-5 md:px-0">
        {/* Section Header */}
        <div className="mb-12 text-center lg:text-left">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Top Destination
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto lg:mx-0">
            Discover the world’s top destinations where breathtaking landscapes,
            rich culture, and unforgettable experiences await.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((attraction, index) => (
            <AttractionCard key={index} attraction={attraction} />
          ))}
        </div>
      </div>
    </section>
  );
}
