import React, { useState, useEffect } from "react";
import { DatePicker } from "antd";
import { useGetSecurityProtocolsRootQuery } from "../../redux/api/security/getAllSecurityApi";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import SecurityCard from "./SecurityCard";
import { currencyByCountry } from "../../components/curenci";

const { RangePicker } = DatePicker;

export default function SecurityDetails() {
  const [userCurrency, setUserCurrency] = useState("USD");
  const [userCountry, setUserCountry] = useState(null);
  const [conversionRate, setConversionRate] = useState(1);

  const { state, search } = useLocation();
  const params = new URLSearchParams(search || "");

  const locationFromParams = params.get("location") || "";
  const countryFromParams = params.get("country") || "";
  const cityFromParams = params.get("city") || "";
  const securityTypeFromParams = params.get("securityType") || "";
  const fromDateParam = params.get("fromDate");
  const toDateParam = params.get("toDate");

  const locationFromState = state?.location || "";
  const countryFromState = state?.country || "";
  const cityFromState = state?.city || "";
  const securityTypeFromState = state?.securityType || "";
  const fromDateState = state?.fromDate || null;
  const toDateState = state?.toDate || null;

  const country = countryFromParams || countryFromState || "";
  const city = cityFromParams || cityFromState || "";
  const baseLocation =
    locationFromParams ||
    locationFromState ||
    [country, city].filter(Boolean).join(", ");
  const displayLocation = baseLocation;
  const securityType = securityTypeFromParams || securityTypeFromState || "";
  const fromDate = fromDateParam
    ? dayjs(fromDateParam)
    : fromDateState
    ? dayjs(fromDateState)
    : null;
  const toDate = toDateParam
    ? dayjs(toDateParam)
    : toDateState
    ? dayjs(toDateState)
    : null;

  const { data } = useGetSecurityProtocolsRootQuery();

  const securityBusinessData = Array.isArray(data?.data?.data)
    ? data.data.data
    : [];

  // Currency detection and conversion
  useEffect(() => {
    const detect = async () => {
      try {
        console.log("Starting currency detection for security...");
        const res = await fetch("https://api.country.is/");
        const data = await res.json();
        console.log("Location API response:", data);
        const country = data.country;
        console.log("Detected country:", country);

        if (country && currencyByCountry[country]) {
          console.log("Country found in mapping:", country);
          setUserCountry(country);
          const userCurr = currencyByCountry[country].code;
          console.log("User currency code:", userCurr);
          setUserCurrency(userCurr);
          setConversionRate(1); // Default rate, will be calculated per item
        } else {
          console.log("Country not found in mapping, using USD");
          setUserCurrency("USD");
          setConversionRate(1);
        }
      } catch (e) {
        console.error("Detection failed:", e);
        setUserCurrency("USD");
        setConversionRate(1);
      }
    };

    detect();
  }, []);

  // Local UI state for inputs (used directly for filtering)
  const [locText, setLocText] = React.useState(displayLocation);
  const [typeValue, setTypeValue] = React.useState(securityType || "All");
  const [appliedFilters, setAppliedFilters] = React.useState({
    location: displayLocation,
    type: securityType || "All",
  });

  // Build filters from router state (location and protocol type only)
  const filters = React.useMemo(() => {
    // Parse current location input; format supports "Country, City" or just "City"
    let fCountry = "";
    let fCity = "";
    const loc = (appliedFilters.location || "").trim();
    if (loc) {
      const parts = loc
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (parts.length === 2) {
        fCountry = parts[0];
        fCity = parts[1];
      } else if (parts.length === 1) {
        fCity = parts[0];
      }
    }
    const fType = (appliedFilters.type || "").trim();
    return {
      country: fCountry.toLowerCase(),
      city: fCity.toLowerCase(),
      type: fType.toLowerCase(),
    };
  }, [appliedFilters]);

  const filteredBusinesses = React.useMemo(() => {
    const hasCity = Boolean(filters.city);
    const hasCountry = Boolean(filters.country);
    const hasType = Boolean(filters.type) && filters.type !== "all";
    if (!hasCity && !hasCountry && !hasType) return securityBusinessData;

    return securityBusinessData.filter((b) => {
      // protocol type filter (from nested security object)
      if (hasType) {
        const bt = (
          b?.security?.securityProtocolType ||
          b?.securityProtocolType ||
          ""
        ).toLowerCase();
        if (!bt.includes(filters.type)) return false;
      }

      // location filter using guard's own city/country
      if (hasCity || hasCountry) {
        const guard = Array.isArray(b?.security_Guard)
          ? b.security_Guard[0]
          : null;
        const gc = (
          b?.securityCountry ||
          guard?.securityCountry ||
          ""
        ).toLowerCase();
        const gi = (b?.securityCity || guard?.securityCity || "").toLowerCase();
        if (hasCity && hasCountry)
          return gc.includes(filters.country) && gi.includes(filters.city);
        if (hasCity)
          return gi.includes(filters.city) || gc.includes(filters.city);
        if (hasCountry)
          return gc.includes(filters.country) || gi.includes(filters.country);
      }

      return true;
    });
  }, [securityBusinessData, filters]);

  const handleSearch = React.useCallback(() => {
    setAppliedFilters({
      location: locText,
      type: typeValue,
    });
  }, [locText, typeValue]);
  return (
    <div className="py-16 container mx-auto">
      {/* Filter Section */}
      <div className="bg-white p-5 rounded-2xl shadow-lg w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          {/* Location Input */}
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Country, City"
              value={locText}
              onChange={(e) => setLocText(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:border-[#0064D2]"
            />
          </div>

          {/* Date Range */}
          <RangePicker
            placeholder={["Start Date", "End Date"]}
            defaultValue={fromDate || toDate ? [fromDate, toDate] : undefined}
            style={{ width: "100%" }}
          />

          {/* Security Type Dropdown */}
          <div className="space-y-2">
            <select
              value={typeValue}
              onChange={(e) => setTypeValue(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg text-gray-500 placeholder:text-gray-400 focus:outline-none focus:border-[#0064D2]"
            >
              <option value="All">All Security Types</option>
              <option value="Personal Bodyguard">Personal Bodyguard</option>
              <option value="Security Guard">Security Guard</option>
              <option value="Executive Protection">Executive Protection</option>
              <option value="Event Security">Event Security</option>
              <option value="Escort">Escort</option>
              <option value="vip">Vip Protection</option>
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div>
          <button
            onClick={handleSearch}
            className="w-full bg-[#0064D2] text-white py-3 rounded-lg font-bold hover:bg-[#0051ad] transition"
          >
            Search
          </button>
        </div>
      </div>
      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 container mx-auto py-10">
        <SecurityCard
          data={filteredBusinesses}
          userCurrency={userCurrency}
          userCountry={userCountry}
          conversionRate={conversionRate}
        />
        {filteredBusinesses && filteredBusinesses.length === 0 && (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">No data available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
