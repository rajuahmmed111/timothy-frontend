import React from "react";
import HotelCard from "../../../components/HotelCard/HotelCard";
import { useGetPopularHotelsQuery } from "../../../redux/api/hotel/hotelApi";

export default function MostVisitedHotels() {
  const { data, isLoading, isError } = useGetPopularHotelsQuery(4);
  console.log("data", data);
  const hotelsApi = data?.data || [];
  const getFirstImageFrom = (val) => {
    if (!val) return undefined;
    if (typeof val === "string") return val;
    if (Array.isArray(val)) {
      const first = val[0];
      if (!first) return undefined;
      if (typeof first === "string") return first;
      return (
        first.url ||
        first.imageUrl ||
        first.src ||
        first.path ||
        first.Location ||
        first.fileUrl ||
        first.file ||
        first.link ||
        first.value
      );
    }
    if (typeof val === "object") {
      return (
        val.url ||
        val.imageUrl ||
        val.src ||
        val.path ||
        val.Location ||
        val.fileUrl ||
        val.file ||
        val.link ||
        val.value
      );
    }
    return undefined;
  };
  const hotels = hotelsApi.map((h) => ({
    id: h.id || h._id || h.hotelId,
    name:
      h.hotelName ||
      h.hotelBusinessName ||
      h.category ||
      h.hotelAccommodationType ||
      h.hotelRoomType ||
      "Hotel",
    location: [h.hotelCity, h.hotelCountry].filter(Boolean).join(", "),
    image:
      getFirstImageFrom(h.hotelImages) ||
      getFirstImageFrom(h.hotelRoomImages) ||
      getFirstImageFrom(h.images) ||
      h.coverImage ||
      h.hotelCoverImage ||
      h.businessLogo ||
      h.hotelLogo ||
      h.logo ||
      h.image ||
      "/placeholder.svg",
    raw: h,
  }));

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center lg:text-left">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Most Visited Hotels This Month
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto lg:mx-0">
            These top-rated hotels have captured the attention of travelers
            around the world with their exceptional service, stunning design,
            and unforgettable experiences.
          </p>
        </div>

        {/* Hotels Grid */}
        {isLoading ? (
          <div className="text-center py-10 text-gray-600">Loading popular hotels...</div>
        ) : isError ? (
          <div className="text-center py-10 text-red-600">Failed to load popular hotels.</div>
        ) : hotels.length === 0 ? (
          <div className="text-center py-10 text-gray-600">No popular hotels found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hotels.map((hotel, index) => (
              <HotelCard key={index} hotel={hotel} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
