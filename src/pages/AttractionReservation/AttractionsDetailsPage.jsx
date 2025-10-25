import React, { useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import EventCard from "./EventCard";
import {
  useGetAttractionAppealsQuery,
  useGetAttractionAppealByIdQuery,
} from "../../redux/api/attraction/attractionApi";

export default function AttractionsDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const searchTerm = params.get("searchTerm") || "";
  const appealId = params.get("appealId") || "";
  const page = parseInt(params.get("page") || "1", 10);
  const limit = parseInt(params.get("limit") || "10", 10);
  const [inputTerm, setInputTerm] = useState(searchTerm);

  const { data, isLoading, error } = useGetAttractionAppealsQuery(
    { searchTerm, page, limit },
    { skip: !!appealId }
  );
  const {
    data: singleData,
    isLoading: isLoadingSingle,
    error: errorSingle,
  } = useGetAttractionAppealByIdQuery(appealId, { skip: !appealId });

  const meta = data?.data?.meta;
  const grouped = data?.data?.data || {};
  const appeals = Object.values(grouped).flatMap((arr) =>
    Array.isArray(arr) ? arr : []
  );

  const events = appeals.map((appeal) => {
    const image = appeal.attractionImages?.[0] || "/placeholder.svg";
    const name = appeal.attractionDestinationType || "Attraction";
    const location = `${appeal.attractionCity || ""}${appeal.attractionCity && appeal.attractionCountry ? ", " : ""}${appeal.attractionCountry || ""}`;
    const price = typeof appeal.attractionAdultPrice !== 'undefined' ? `$${appeal.attractionAdultPrice}` : "$0";
    const rating = parseFloat(appeal.attractionRating) || 0;
    const id = appeal.id;
    return { id, name, location, image, price, rating };
  });

  const total = meta?.total || 0;
  const perPage = meta?.limit || limit;
  const currentPage = meta?.page || page;
  const totalPages = total && perPage ? Math.ceil(total / perPage) : 1;

  const buildPageLink = (p) => {
    const nextParams = new URLSearchParams();
    if (searchTerm) nextParams.set("searchTerm", searchTerm);
    nextParams.set("page", String(p));
    nextParams.set("limit", String(perPage));
    return `/attraction-details?${nextParams.toString()}`;
  };

  const buildSearchLink = useMemo(() => {
    const nextParams = new URLSearchParams();
    if (inputTerm) nextParams.set("searchTerm", inputTerm);
    nextParams.set("page", "1");
    nextParams.set("limit", String(perPage));
    return `/attraction-details?${nextParams.toString()}`;
  }, [inputTerm, perPage]);

  if (isLoading || isLoadingSingle) {
    return (
      <div className="min-h-screen py-10 container mx-auto">
        <div className="bg-white p-5 rounded-2xl shadow-lg w-full">
          <div className="mb-5">
            <div className="space-y-2">
              <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse"
            >
              <div className="aspect-[4/3] bg-gray-200"></div>
              <div className="p-5">
                <div className="h-5 w-2/3 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || errorSingle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Failed to load attractions.</p>
      </div>
    );
  }

  // Single appeal details view
  if (appealId && singleData?.data) {
    const a = singleData.data;
    return (
      <div className="min-h-screen py-10 container mx-auto">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="aspect-[4/3] bg-gray-100 rounded overflow-hidden">
                <img
                  src={a.attractionImages?.[0] || "/placeholder.svg"}
                  alt={a.attractionDestinationType}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {(a.attractionImages || []).slice(0, 5).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="thumb"
                    className="w-20 h-16 object-cover rounded"
                  />
                ))}
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">
                {a.attractionDestinationType}
              </h1>
              <p className="text-gray-600 mb-4">{a.attractionDescription}</p>
              <div className="space-y-1 text-sm text-gray-700 mb-4">
                <p>
                  <strong>Location:</strong> {a.attractionAddress},{" "}
                  {a.attractionCity}, {a.attractionDistrict},{" "}
                  {a.attractionPostalCode}, {a.attractionCountry}
                </p>
                <p>
                  <strong>Rating:</strong> {a.attractionRating}
                </p>
                <p>
                  <strong>Adult Price:</strong> ${a.attractionAdultPrice}
                </p>
                <p>
                  <strong>Child Price:</strong> ${a.attractionChildPrice}
                </p>
                <p>
                  <strong>Status:</strong> {a.isBooked}
                </p>
                <p>
                  <strong>Discount:</strong> {a.discount}% |{" "}
                  <strong>VAT:</strong> {a.vat}%
                </p>
                <p>
                  <strong>Reviews:</strong> {a.attractionReviewCount}
                </p>
              </div>
              <div className="mb-4">
                <h2 className="font-semibold mb-2">Amenities</h2>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p>Free Wifi: {a.attractionFreeWifi ? "Yes" : "No"}</p>
                  <p>Free Parking: {a.attractionFreeParking ? "Yes" : "No"}</p>
                  <p>Kitchen: {a.attractionKitchen ? "Yes" : "No"}</p>
                  <p>TV: {a.attractionTv ? "Yes" : "No"}</p>
                  <p>AC: {a.attractionAirConditioning ? "Yes" : "No"}</p>
                  <p>Pool: {a.attractionPool ? "Yes" : "No"}</p>
                </div>
              </div>
              <div>
                <h2 className="font-semibold mb-2">Schedule</h2>
                <div className="space-y-2 text-sm">
                  {(a.attractionSchedule || []).map((day) => (
                    <div key={day.id} className="border rounded p-2">
                      <p className="font-medium">{day.day}</p>
                      <div className="text-gray-600">
                        {(day.slots || []).map((s) => (
                          <p key={s.id}>
                            {s.from} - {s.to}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 container mx-auto">
      <div className="bg-white p-5 rounded-2xl shadow-lg w-full">
        <div className="mb-5">
          {/* Location Input */}
          <div className="space-y-2">
            <input
              type="text"
              value={inputTerm}
              onChange={(e) => setInputTerm(e.target.value)}
              placeholder="Search For Attractions"
              className="w-full p-3 border border-gray-200 rounded-lg placeholder:text-gray-400"
            />
          </div>
        </div>
        {/* Search Button */}
        <div className="">
          <Link to={buildSearchLink} className="w-full">
            <button className="w-full bg-[#0064D2] text-white py-3 rounded-lg font-bold">
              Search
            </button>
          </Link>
        </div>
      </div>
      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
        {events.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            No attractions found.
          </div>
        ) : (
          events.map((event, index) => <EventCard key={index} event={event} />)
        )}
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <Link
          to={buildPageLink(Math.max(1, currentPage - 1))}
          className={`px-4 py-2 rounded border ${
            currentPage <= 1 ? "pointer-events-none opacity-50" : ""
          }`}
        >
          Prev
        </Link>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <Link
          to={buildPageLink(Math.min(totalPages, currentPage + 1))}
          className={`px-4 py-2 rounded border ${
            currentPage >= totalPages ? "pointer-events-none opacity-50" : ""
          }`}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
