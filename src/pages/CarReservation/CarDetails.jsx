import React, { useState, useRef, useCallback, useEffect } from "react";
import { DatePicker, Spin } from "antd";
import CarCard from "./CarCard";
import { useGetAllCarsQuery } from "../../redux/api/car/getAllCarsApi";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

export default function CarDetails() {
  const [dateRange, setDateRange] = useState(null);
  const [locationText, setLocationText] = useState("");
  const [carType, setCarType] = useState("");
  const [page, setPage] = useState(1);
  const [cars, setCars] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  console.log("queryParams", queryParams);
  const searchTerm = queryParams.get("searchTerm") || "";
  const fromDate = queryParams.get("fromDate") || "";
  const toDate = queryParams.get("toDate") || "";
  const sortBy = queryParams.get("sortBy") || "";
  const sortOrder = queryParams.get("sortOrder") || "";
  const country = queryParams.get("country") || "";
  const carTypeFromQuery = queryParams.get("carType") || "";
  const limitFromQuery = Number(queryParams.get("limit")) || 10;
  const pageFromQuery = Number(queryParams.get("page")) || 1;

  useEffect(() => {
    setPage(pageFromQuery);
    setLocationText(searchTerm || country || "");
    setCarType(carTypeFromQuery);
    if (fromDate || toDate) {
      const start = fromDate ? dayjs(fromDate) : null;
      const end = toDate ? dayjs(toDate) : null;
      if (start || end) setDateRange([start, end]);
    }
  }, []);

  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const qSearch = q.get("searchTerm") || "";
    const qCountry = q.get("country") || "";
    const qType = q.get("carType") || "";
    const qFrom = q.get("fromDate") || "";
    const qTo = q.get("toDate") || "";
    setLocationText(qSearch || qCountry || "");
    setCarType(qType);
    if (qFrom || qTo) {
      const s = qFrom ? dayjs(qFrom) : null;
      const e = qTo ? dayjs(qTo) : null;
      setDateRange([s, e]);
    } else {
      setDateRange(null);
    }
  }, [location.search]);

  const {
    data: carsData,
    isLoading,
    isFetching,
  } = useGetAllCarsQuery(
    {
      page,
      limit: limitFromQuery,
      searchTerm,
    },
    { skip: false }
  );

  const transformCarData = (car) => ({
    id: car.id,
    name: car.car_Rental?.carName || car.carModel,
    displayLocation: (searchTerm || country || "").trim() || `${car.carCity}, ${car.carCountry}`,
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

  // Update cars when new data is loaded
  useEffect(() => {
    const list = carsData?.data?.data;
    if (Array.isArray(list)) {
      if (list.length === 0) {
        // No results for this page
        const meta = carsData?.data?.meta;
        if (meta && meta.total > 0 && page !== 1) {
          // There are results overall, but not on this page. Fallback to page=1.
          const params = new URLSearchParams(location.search);
          params.set("page", "1");
          navigate(`/car-details?${params.toString()}`);
          return;
        }
        // Truly empty
        setCars([]);
        setHasMore(false);
        return;
      }

      setCars((prev) => {
        // If it's the first page, replace the data, otherwise append
        if (page === 1) {
          return list.map(transformCarData);
        }
        return [...prev, ...list.map(transformCarData)];
      });

      // Check if there are more pages using meta from response
      const meta = carsData?.data?.meta;
      if (meta) {
        const { total = 0, page: curPage = 1, limit: lim = 10 } = meta;
        const reachedEnd = curPage * lim >= total;
        setHasMore(!reachedEnd && list.length > 0);
      }
    }
  }, [carsData, page]);

  // Handle scroll for infinite loading
  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !isFetching && hasMore) {
        setPage((prev) => prev + 1);
      }
    },
    [isFetching, hasMore]
  );

  // Set up intersection observer
  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0,
    };

    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);

    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [handleObserver]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    // search term or country from input
    if (locationText) params.set("searchTerm", locationText);
    // dates
    if (dateRange?.[0])
      params.set("fromDate", dateRange[0]?.format?.("YYYY-MM-DD"));
    if (dateRange?.[1])
      params.set("toDate", dateRange[1]?.format?.("YYYY-MM-DD"));
    // car type
    if (carType) params.set("carType", carType);
    // paging & keep limit
    params.set("page", "1");
    params.set("limit", String(limitFromQuery));
    // keep sort if exists in current URL
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);

    // Reset list then navigate
    setPage(1);
    setCars([]);
    setHasMore(true);
    navigate(`/car-details?${params.toString()}`);
  };

  return (
    <div className="py-16 container mx-auto">
      <div className="bg-white p-5 rounded-2xl shadow-lg w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {/* Location Input */}
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Find Location"
              className="w-full p-3 border border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:border-[#0064D2]"
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
            />
          </div>
          {/* Start Date & End Date */}
          <RangePicker
            placeholder={["Start Date", "End Date"]}
            value={dateRange}
            onChange={setDateRange}
            style={{ width: "100%" }}
          />
        </div>
        {/* Search Button */}
        <div>
          <button
            className="w-full bg-[#0064D2] text-white py-3 rounded-lg font-bold"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      {/* Cars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 container mx-auto py-10">
        {cars.map((car, index) => (
          <CarCard key={`${car.id}-${index}`} car={car} />
        ))}
      </div>

      {/* Loading spinner */}
      {(isLoading || isFetching) && (
        <div className="col-span-full flex justify-center py-8">
          <Spin size="large" />
        </div>
      )}

      {/* Intersection observer target */}
      <div ref={loader} style={{ height: "20px" }} />

      {/* No results message */}
      {!isLoading && cars.length === 0 && (
        <div className="col-span-full text-center py-10">
          <p className="text-gray-500">
            No cars available for the selected filters. Try changing search,
            dates, or car type.
          </p>
        </div>
      )}
    </div>
  );
}
