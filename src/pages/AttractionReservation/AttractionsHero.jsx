import React, { useState } from "react";
import { Link } from "react-router-dom";
import { DatePicker } from "antd";

export default function AttractionsHero() {
  const [dateRange, setDateRange] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { RangePicker } = DatePicker;
  return (
    <section
      className="relative h-[600px] bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/RecommendedAttractions/4.png')`,
      }}
    >
      <div className="container mx-auto absolute bottom-0 left-1/2 transform -translate-x-1/2 px-5 md:px-0 flex flex-col justify-end pb-10">
        <div>
          <h1 className="text-7xl font-bold mb-10 text-white">
            Book An Event{" "}
          </h1>
          <br />
          <h1 className="text-7xl font-bold mb-10 text-white">
            Nearest To You And Enjoy
          </h1>
          {/* Custom Card */}
          <div className="bg-white p-5 rounded-2xl shadow-lg w-full">
            <div className="mb-5">
              {/* Location Input */}
              <div className="space-y-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for Attractions (name or city)"
                  className="w-full p-3 border border-gray-200 rounded-lg placeholder:text-gray-400"
                />
              </div>
            </div>
            {/* Search Button */}
            <div className="">
              <Link to={`/attraction-details?searchTerm=${encodeURIComponent(searchTerm)}`} className="w-full">
                <button className="w-full bg-[#0064D2] text-white py-3 rounded-lg font-bold">
                  Search
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
