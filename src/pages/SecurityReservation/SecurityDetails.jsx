import React, { useState, useRef, useEffect, useCallback } from "react";
import { DatePicker, Spin } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useGetSecurityProtocolsRootQuery } from "../../redux/api/security/getAllSecurityApi";
import SecurityCard from "./SecurityCard";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

export default function SecurityDetails() {
  const { search } = useLocation();
  const sp = new URLSearchParams(search);

  const [page, setPage] = useState(1);
  const [selectedType, setSelectedType] = useState(
    sp.get("securityProtocolType") || sp.get("sptype") || "All"
  );
  const initialFrom = sp.get("fromDate");
  const initialTo = sp.get("toDate");
  const [dateRange, setDateRange] = useState(
    initialFrom && initialTo ? [dayjs(initialFrom), dayjs(initialTo)] : null
  );
  const initialCountry = sp.get("country") || "";
  const initialCity = sp.get("city") || "";
  const [locationText, setLocationText] = useState(
    initialCountry && initialCity
      ? `${initialCountry}, ${initialCity}`
      : initialCity || initialCountry || ""
  );
  const [providers, setProviders] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);

  const queryParams = {
    page,
    limit: 10,
    ...(selectedType &&
      selectedType !== "All" && { securityProtocolType: selectedType }),
    ...(dateRange &&
      dateRange[0] &&
      dateRange[1] && {
        fromDate: dateRange[0].format("YYYY-MM-DD"),
        toDate: dateRange[1].format("YYYY-MM-DD"),
      }),
    ...(locationText &&
      (() => {
        const parts = locationText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        if (parts.length === 2) return { country: parts[0], city: parts[1] };
        if (parts.length === 1) return { city: parts[0] };
        return {};
      })()),
  };

  const { data, isLoading, isFetching, isError } =
    useGetSecurityProtocolsRootQuery(queryParams, { skip: !hasMore });

  // Update providers when new data is loaded
  useEffect(() => {
    const payload = data?.data; // server: { meta, data: [...] }
    const items = Array.isArray(payload?.data) ? payload.data : [];
    if (payload) {
      setProviders((prev) => {
        if (page === 1) return items;
        return [...prev, ...items];
      });

      const total = payload?.meta?.total ?? 0;
      const limit = payload?.meta?.limit ?? 10;
      const totalPages = Math.ceil(total / limit) || 0;
      if (totalPages && page >= totalPages) setHasMore(false);
    }
  }, [data, page]);

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

  // Reset pagination when filters change
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setProviders([]);
  }, [selectedType, dateRange, locationText]);

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

  // Map to guard-level cards (flatten all security_Guard)
  const cardProviders = providers.flatMap((b) => {
    const guards = Array.isArray(b?.security_Guard) ? b.security_Guard : [];
    return guards.map((g) => ({
      id: g?.id || g?._id,
      image:
        (Array.isArray(g?.securityImages) && g.securityImages[0]) ||
        b?.businessLogo ||
        "/placeholder.svg",
      name: g?.securityGuardName || b?.securityBusinessName || b?.securityName,
      location:
        [g?.securityCity, g?.securityCountry].filter(Boolean).join(", ") ||
        b?.securityBusinessType ||
        b?.securityProtocolType ||
        "",
      price: g?.securityPriceDay,
      rating: Number(g?.securityRating) || 0,
      ownerName: b?.user?.fullName,
      ownerAvatar: b?.user?.profileImage,
    }));
  });

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setPage(1);
    setHasMore(true);
    setProviders([]);
  };

  return (
    <div className="py-16 container mx-auto">
      <div className="bg-white p-5 rounded-2xl shadow-lg w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          {/* Location Input */}
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Country, City"
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:border-[#0064D2]"
            />
          </div>
          {/* Start Date & End Date */}
          <RangePicker
            placeholder={["Start Date", "End Date"]}
            value={dateRange}
            onChange={setDateRange}
            style={{ width: "100%" }}
          />
          {/* Security Type */}
          <div className="space-y-2">
            <select
              className="w-full p-3 border border-gray-200 rounded-lg text-gray-500 placeholder:text-gray-400 focus:outline-none focus:border-[#0064D2]"
              value={selectedType}
              onChange={handleTypeChange}
            >
              <option value="All">All Security Types</option>
              <option value="Personal Bodyguard">Personal Bodyguard</option>
              <option value="Security Guard">Security Guard</option>
              <option value="Executive Protection">Executive Protection</option>
              <option value="Event Security">Event Security</option>
            </select>
          </div>
        </div>
        {/* Search Button */}
        <div>
          <Link
            to={(() => {
              const params = new URLSearchParams();
              if (locationText) {
                const parts = locationText
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean);
                if (parts.length === 2) {
                  params.set("country", parts[0]);
                  params.set("city", parts[1]);
                } else if (parts.length === 1) {
                  params.set("city", parts[0]);
                }
              }
              if (dateRange?.[0])
                params.set("fromDate", dateRange[0].format("YYYY-MM-DD"));
              if (dateRange?.[1])
                params.set("toDate", dateRange[1].format("YYYY-MM-DD"));
              if (selectedType && selectedType !== "All")
                params.set("securityProtocolType", selectedType);
              const qs = params.toString();
              return qs ? `/security-details?${qs}` : "/security-details";
            })()}
            className="w-full"
          >
            <button className="w-full bg-[#0064D2] text-white py-3 rounded-lg font-bold">
              Search
            </button>
          </Link>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 container mx-auto py-10">
        {cardProviders.map((securityProvider, index) => (
          <SecurityCard
            key={`${securityProvider.id}-${index}`}
            securityProvider={securityProvider}
          />
        ))}

        {/* Loading spinner */}
        {(isLoading || isFetching) && (
          <div className="col-span-full flex justify-center py-8">
            <Spin size="large" />
          </div>
        )}

        {/* Intersection observer target */}
        <div ref={loader} style={{ height: "20px" }} />

        {/* No results message */}
        {!isLoading && cardProviders.length === 0 && (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">No security providers found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
