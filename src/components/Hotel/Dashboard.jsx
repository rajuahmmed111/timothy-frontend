import React, { useState } from "react";
import dayjs from "dayjs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown } from "lucide-react";
import RecentHotelRooms from "./RecentHotelRooms";

const salesData = [
  { month: "Jan", sales: 1200 },
  { month: "Feb", sales: 2100 },
  { month: "Mar", sales: 2800 },
  { month: "Apr", sales: 2500 },
  { month: "May", sales: 3200 },
  { month: "Jun", sales: 3000 },
  { month: "Jul", sales: 3400 },
  { month: "Aug", sales: 3600 },
  { month: "Sep", sales: 3300 },
  { month: "Oct", sales: 3700 },
  { month: "Nov", sales: 3900 },
  { month: "Dec", sales: 4000 },
];

export default function Dashboard() {
  const currentYear = dayjs().year();
  const startYear = 1900;
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isOpen, setIsOpen] = useState(false);

  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, index) => startYear + index
  );

  const handleSelect = (year) => {
    setSelectedYear(year);
    setIsOpen(false);
  };
  return (
    <div className="p-6 space-y-8">
      {/* Sales Bar Chart */}
      <div className="bg-gray-100 rounded-2xl shadow p-5">
        <div className="flex justify-between items-center py-5">
          <h2 className="text-xl font-bold mb-4">Total Sales</h2>
          <div className="relative w-full md:w-32">
            {/* Selected Year Display */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md flex justify-between items-center bg-white transition"
            >
              <span className="text-[#0064D2]">{selectedYear}</span>
              <ChevronDown className="text-[#0064D2] w-5 h-5 ml-5" />
            </button>

            {/* Dropdown List */}
            {isOpen && (
              <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                {years.map((year) => (
                  <div
                    key={year}
                    onClick={() => handleSelect(year)}
                    className={`p-2 cursor-pointer hover:bg-gray-100 transition ${
                      year === selectedYear ? "bg-gray-200" : ""
                    }`}
                  >
                    {year}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="sales"
              fill="#3b82f6" // blue color
              barSize={30} // thinner bars (try 10–20)
              radius={[10, 10, 0, 0]} // top-left, top-right rounded
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-10">
        <h1 className="text-gray-900 text-2xl font-bold">Recent Hotel Rooms</h1>
        <RecentHotelRooms />
      </div>
    </div>
  );
}
