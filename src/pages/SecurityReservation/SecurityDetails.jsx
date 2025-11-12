import React, { useState, useRef, useEffect, useCallback } from "react";
import { DatePicker, Spin } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGetAllSecurityProtocolsQuery } from "../../redux/api/security/securityApi";
import SecurityCard from "./SecurityCard";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

export default function SecurityDetails() {
  const { search } = useLocation();
  const navigate = useNavigate();
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
  const isPagingRef = useRef(false);

  const queryParams = React.useMemo(() => {
    const base = {
      page,
      limit: 10,
    };
    const type =
      selectedType && selectedType !== "All"
        ? { securityProtocolType: selectedType }
        : {};
    const dates =
      dateRange && dateRange[0] && dateRange[1]
        ? {
            fromDate: dateRange[0].format("YYYY-MM-DD"),
            toDate: dateRange[1].format("YYYY-MM-DD"),
          }
        : {};
    const loc = (() => {
      if (!locationText) return {};
      const parts = locationText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (parts.length === 2) return { country: parts[0], city: parts[1] };
      if (parts.length === 1) return { city: parts[0] };
      return {};
    })();
    return { ...base, ...type, ...dates, ...loc };
  }, [page, selectedType, dateRange, locationText]);

  const { data, isLoading, isFetching, isError } =
    useGetAllSecurityProtocolsQuery(queryParams, { skip: !hasMore });

  // Update providers when new data is loaded
  useEffect(() => {
    const payload = data?.data; // server: { meta, data: [...] }
    const items = Array.isArray(payload?.data) ? payload.data : [];
    if (payload) {
      setProviders((prev) => {
        if (page === 1) return items;
        return [...prev, ...items];
      });

      const limit = payload?.meta?.limit ?? 10;
      const total = payload?.meta?.total;
      // If API provides total, use it; otherwise infer from page items
      if (typeof total === "number") {
        if (total === 0) {
          setHasMore(false);
        } else {
          const totalPages = Math.ceil(total / limit) || 0;
          if (totalPages && page >= totalPages) setHasMore(false);
        }
      } else {
        // Fallback: if fewer than a full page returned, no more pages
        if ((items?.length || 0) < limit) setHasMore(false);
        // Also if first page has no items, stop further attempts
        if (page === 1 && (items?.length || 0) === 0) setHasMore(false);
      }
      // allow next paging after data settles
      isPagingRef.current = false;
    }
  }, [data, page]);

  // Handle scroll for infinite loading
  const lastRequestedPageRef = useRef(1);

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (
        target.isIntersecting &&
        hasMore &&
        !isFetching &&
        !isPagingRef.current &&
        lastRequestedPageRef.current < page + 1
      ) {
        isPagingRef.current = true;
        const next = page + 1;
        lastRequestedPageRef.current = next;
        setPage(next);
      }
    },
    [isFetching, hasMore, page]
  );

  // Reset pagination when filters change
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setProviders([]);
    isPagingRef.current = false;
    lastRequestedPageRef.current = 1;
  }, [selectedType, dateRange, locationText]);

  // Set up intersection observer
  const observerRef = useRef(null);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0,
    };

    // Clean up any previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    const observer = new IntersectionObserver(handleObserver, option);
    observerRef.current = observer;
    if (loader.current) observer.observe(loader.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [handleObserver]);

  const handleSearch = () => {
    setPage(1);
    setHasMore(true);
    setProviders([]);
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
    if (dateRange?.[1]) params.set("toDate", dateRange[1].format("YYYY-MM-DD"));
    if (selectedType && selectedType !== "All")
      params.set("securityProtocolType", selectedType);
    const qs = params.toString();
    const url = qs ? `/security-details?${qs}` : "/security-details";
    navigate(url, { replace: false });
  };

  const locationParts = React.useMemo(() => {
    const parts = (locationText || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length === 2) return { country: parts[0], city: parts[1] };
    if (parts.length === 1) return { country: "", city: parts[0] };
    return { country: "", city: "" };
  }, [locationText]);

  // Map to cards: prefer guard-level; fallback to protocol-level when no guards
  const cardProviders = React.useMemo(() => providers.flatMap((b) => {
    const guards = Array.isArray(b?.security_Guard) ? b.security_Guard : [];
    if (guards.length > 0) {
      const fc = (locationParts.country || "").toLowerCase();
      const fci = (locationParts.city || "").toLowerCase();
      const filteredGuards = guards.filter((g) => {
        const gc = (g?.securityCountry || "").toLowerCase();
        const gi = (g?.securityCity || "").toLowerCase();
        if (fc && fci) return gc.includes(fc) && gi.includes(fci);
        if (fc) return gc.includes(fc) || gi.includes(fc);
        if (fci) return gi.includes(fci) || gc.includes(fci);
        return true;
      });
      if (filteredGuards.length === 0) return [];
      return filteredGuards.map((g) => ({
        id: g?.id || g?._id,
        to: `/security-service-details/${b?.id || b?._id}`,
        image:
          (Array.isArray(g?.securityImages) && g.securityImages[0]) ||
          b?.businessLogo ||
          "/placeholder.svg",
        name:
          g?.securityGuardName || b?.securityBusinessName || b?.securityName,
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
    }
    // Protocol-level card when no guards
    const fc = (locationParts.country || "").toLowerCase();
    const fci = (locationParts.city || "").toLowerCase();
    const bc = (b?.securityCountry || "").toLowerCase();
    const bi = (b?.securityCity || "").toLowerCase();
    const matchesProtocolLoc = (() => {
      if (fc && fci) return bc.includes(fc) && bi.includes(fci);
      if (fc) return bc.includes(fc) || bi.includes(fc);
      if (fci) return bi.includes(fci) || bc.includes(fci);
      return true;
    })();
    if (!matchesProtocolLoc) return [];
    return [
      {
        id: b?.id || b?._id,
        to: `/security-service-details/${b?.id || b?._id}`,
        image: b?.businessLogo || "/placeholder.svg",
        name: b?.securityBusinessName || b?.securityName,
        location: b?.securityProtocolType || b?.securityBusinessType || "",
        price: 0,
        rating: 0,
        ownerName: b?.user?.fullName,
        ownerAvatar: b?.user?.profileImage,
      },
    ];
  }), [providers, locationParts]);

  const uniqueCardProviders = React.useMemo(() => {
    const seen = new Set();
    const out = [];
    for (const c of cardProviders) {
      const key = c?.id || `${c?.to}|${c?.name}`;
      if (!seen.has(key)) {
        seen.add(key);
        out.push(c);
      }
    }
    return out;
  }, [cardProviders]);

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
          <button
            onClick={handleSearch}
            className="w-full bg-[#0064D2] text-white py-3 rounded-lg font-bold"
          >
            Search
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 container mx-auto py-10">
       
          <SecurityCard cards={uniqueCardProviders} />
       

        {/* Loading spinner */}
        {(isLoading || isFetching) && (
          <div className="col-span-full flex justify-center py-8">
            <Spin size="large" />
          </div>
        )}

        {/* Intersection observer target */}
        <div ref={loader} style={{ height: "20px" }} />

        {/* No results message */}
        {!isLoading && !isFetching && uniqueCardProviders.length === 0 && (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">No data available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
