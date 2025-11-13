import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DatePicker } from "antd";

export default function SecurityReservationHero() {
  const { RangePicker } = DatePicker;
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [securityType, setSecurityType] = useState("");
  const [dateRange, setDateRange] = useState(null);

  const handleSearch = () => {
    const hasLocation = Boolean(location?.trim());
    const hasDates = Boolean(dateRange?.[0]) || Boolean(dateRange?.[1]);
    const hasType = Boolean(securityType);
    if (!hasLocation && !hasDates && !hasType) return;

    let country = "";
    let city = "";
    if (location) {
      const parts = location
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (parts.length === 2) {
        country = parts[0];
        city = parts[1];
      } else if (parts.length === 1) {
        city = parts[0];
      }
    }

    const fromDate = dateRange?.[0] ? dateRange[0].format("YYYY-MM-DD") : null;
    const toDate = dateRange?.[1] ? dateRange[1].format("YYYY-MM-DD") : null;

    navigate("/security-details", {
      state: {
        location,
        country,
        city,
        fromDate,
        toDate,
        securityType,
      },
    });
  };

  const onSearch = () => {
    const params = new URLSearchParams();
    if (location) {
      const parts = location
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (parts.length === 2) {
        params.set("country", parts[0]);
        params.set("city", parts[1]);
      } else if (parts.length === 1) {
        // If only one value provided, use it as city
        params.set("city", parts[0]);
      }
    }
    if (securityType) params.set("sptype", securityType);
    const typePath = encodeURIComponent(securityType || "All");
    navigate(`/security/services/${typePath}?${params.toString()}`);
  };
  return (
    <section
      className="relative h-[600px] bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/security/1.png')`,
      }}
    >
      <div className="container mx-auto absolute bottom-0 left-1/2 transform -translate-x-1/2 px-5 md:px-0 flex flex-col justify-end pb-10">
        <div>
          <h1 className="text-7xl font-bold mb-10 text-white">
            Stay Protected Wherever You Go!!
          </h1>
          {/* Custom Card */}
          <div className="bg-white p-5 rounded-2xl shadow-lg w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
              {/* Location Input (Country, City) */}
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Country, City"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
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
                  value={securityType}
                  onChange={(e) => setSecurityType(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg text-gray-500 placeholder:text-gray-400 focus:outline-none focus:border-[#0064D2]"
                >
                  <option value="" disabled>
                    Select Security Type
                  </option>
                  <option value="Personal Bodyguard">Personal Bodyguard</option>
                  <option value="Security Guard">Security Guard</option>
                  <option value="Executive Protection">
                    Executive Protection
                  </option>
                  <option value="Event Security">Event Security</option>
                </select>
              </div>
            </div>
            {/* Search Button */}
            <div className="">
              {(() => {
                const isDisabled =
                  !location?.trim() && !dateRange?.[0] && !dateRange?.[1] && !securityType;
                return (
                  <button
                    onClick={handleSearch}
                    disabled={isDisabled}
                    className="w-full bg-[#0064D2] text-white py-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Search
                  </button>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
