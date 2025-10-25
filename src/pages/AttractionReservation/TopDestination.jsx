import React from "react";
import AttractionCard from "./AttractionCard";
import { useGetAttractionAppealsQuery } from "../../redux/api/attraction/attractionApi";

export default function TopDestination() {
  const { data, isLoading, error } = useGetAttractionAppealsQuery({ searchTerm: "", page: 1, limit: 100 });

  const grouped = data?.data?.data || {};
  const services = Object.entries(grouped).map(([country, list]) => {
    const first = Array.isArray(list) && list.length > 0 ? list[0] : null;
    const image = first?.attractionImages?.[0] || "/RecommendedAttractions/4.png";
    const count = Array.isArray(list) ? list.length : 0;
    return {
      title: country,
      image,
      description: `${count} things to do`,
    };
  });

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

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse">
                <div className="aspect-[4/3] bg-gray-200"></div>
                <div className="p-5">
                  <div className="h-5 w-2/3 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        )}
        {error && (
          <div className="text-center text-red-500">Failed to load destinations.</div>
        )}

        {/* Services Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">No destinations found.</div>
            ) : (
              services.map((attraction, index) => (
                <AttractionCard key={index} attraction={attraction} />
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}
