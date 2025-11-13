import React from "react";
import { DatePicker } from "antd";
import { useGetAllSecurityProtocolsQuery } from "../../redux/api/security/securityApi";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import SecurityCard from "./SecurityCard";

const { RangePicker } = DatePicker;

export default function SecurityDetails() {
  const { state } = useLocation();
  const locationFromState = state?.location || "";
  const country = state?.country || "";
  const city = state?.city || "";
  const displayLocation =
    locationFromState || [country, city].filter(Boolean).join(", ");
  const securityType = state?.securityType || "";
  const fromDate = state?.fromDate ? dayjs(state.fromDate) : null;
  const toDate = state?.toDate ? dayjs(state.toDate) : null;

  const { data } = useGetAllSecurityProtocolsQuery();
  const securityBusinessData = Array.isArray(data?.data?.data)
    ? data.data.data
    : [];

  // Local UI state for inputs
  const [locText, setLocText] = React.useState(displayLocation);
  const [typeValue, setTypeValue] = React.useState(securityType || "All");
  // Applied values used for filtering (only change when Search is clicked)
  const [appliedLoc, setAppliedLoc] = React.useState(displayLocation);
  const [appliedType, setAppliedType] = React.useState(securityType || "All");

  const handleSearch = () => {
    setAppliedLoc(locText || "");
    setAppliedType(typeValue || "All");
  };

  // Build filters from router state (location and protocol type only)
  const filters = React.useMemo(() => {
    // Parse appliedLoc only; format supports "Country, City" or just "City"
    let fCountry = "";
    let fCity = "";
    const loc = (appliedLoc || "").trim();
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
    const fType = (appliedType || "").trim();
    return {
      country: fCountry.toLowerCase(),
      city: fCity.toLowerCase(),
      type: fType.toLowerCase(),
    };
  }, [appliedLoc, appliedType]);

  const filteredBusinesses = React.useMemo(() => {
    const hasCity = Boolean(filters.city);
    const hasCountry = Boolean(filters.country);
    const hasType = Boolean(filters.type) && filters.type !== "all";
    if (!hasCity && !hasCountry && !hasType) return securityBusinessData;

    return securityBusinessData.filter((b) => {
      // protocol type filter
      if (hasType) {
        const bt = (b?.securityProtocolType || b?.securityBusinessType || "").toLowerCase();
        if (!bt.includes(filters.type)) return false;
      }
      // location filter against guards (city/country)
      if (hasCity || hasCountry) {
        const guards = Array.isArray(b?.security_Guard) ? b.security_Guard : [];
        if (guards.length === 0) return false;
        const matchesLocation = guards.some((g) => {
          const gc = (g?.securityCountry || "").toLowerCase();
          const gi = (g?.securityCity || "").toLowerCase();
          if (hasCity && hasCountry) return gc.includes(filters.country) && gi.includes(filters.city);
          if (hasCity) return gi.includes(filters.city) || gc.includes(filters.city);
          if (hasCountry) return gc.includes(filters.country) || gi.includes(filters.country);
          return true;
        });
        if (!matchesLocation) return false;
      }
      return true;
    });
  }, [securityBusinessData, filters]);
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
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div>
          <button onClick={handleSearch} className="w-full bg-[#0064D2] text-white py-3 rounded-lg font-bold hover:bg-[#0051ad] transition">
            Search
          </button>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 container mx-auto py-10">
      <SecurityCard data={filteredBusinesses} />
      {filteredBusinesses && filteredBusinesses.length === 0 && (
        <div className="col-span-full text-center py-10">
          <p className="text-gray-500">No data available.</p>
        </div>
      )}
      </div>
    </div>
  );
}
