import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import RecentHotelRooms from "./RecentHotelRooms";
import { useGetTotalSalesQuery } from "../../redux/api/hotel/hotelApi";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function Dashboard() {
  const { data: totalSalesRes } = useGetTotalSalesQuery();

  const normalizeMonthly = (res) => {
    const out = {};
    const payload = res?.data ?? res;
    if (!payload) return out;

    const abbr = (name) => {
      if (!name || typeof name !== "string") return undefined;
      const n = name.toLowerCase();
      if (n.startsWith("jan")) return "Jan";
      if (n.startsWith("feb")) return "Feb";
      if (n.startsWith("mar")) return "Mar";
      if (n.startsWith("apr")) return "Apr";
      if (n.startsWith("may")) return "May";
      if (n.startsWith("jun")) return "Jun";
      if (n.startsWith("jul")) return "Jul";
      if (n.startsWith("aug")) return "Aug";
      if (n.startsWith("sep")) return "Sep";
      if (n.startsWith("oct")) return "Oct";
      if (n.startsWith("nov")) return "Nov";
      if (n.startsWith("dec")) return "Dec";
      return undefined;
    };

    if (Array.isArray(payload)) {
      payload.forEach((item) => {
        const m = item?.month;
        const v =
          item?.total ?? item?.sales ?? item?.amount ?? item?.value ?? 0;
        if (m) out[m] = Number(v) || 0;
      });
      return out;
    }

    if (Array.isArray(payload?.monthlyEarnings)) {
      payload.monthlyEarnings.forEach((item) => {
        const m = item?.month;
        const v =
          item?.total ?? item?.sales ?? item?.amount ?? item?.value ?? 0;
        if (m) out[m] = Number(v) || 0;
      });
      return out;
    }

    if (Array.isArray(payload?.paymentMonthsData)) {
      payload.paymentMonthsData.forEach((item) => {
        const m = abbr(item?.month);
        const v = item?.serviceEarnings ?? 0;
        if (m) out[m] = Number(v) || 0;
      });
      return out;
    }

    if (payload?.monthly && typeof payload.monthly === "object") {
      Object.entries(payload.monthly).forEach(([m, v]) => {
        out[m] = Number(v) || 0;
      });
      return out;
    }

    return out;
  };

  const monthlyMap = normalizeMonthly(totalSalesRes);
  const salesData = MONTHS.map((m) => ({
    month: m,
    sales: monthlyMap[m] || 0,
  }));
  return (
    <div className="p-6 space-y-8">
      {/* Sales Bar Chart */}
      <div className="bg-gray-100 rounded-2xl shadow p-5">
        <div className="flex justify-between items-center py-5">
          <h2 className="text-xl font-bold mb-4">Total Sales</h2>
          <div className="relative w-full md:w-32"></div>
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
        <RecentHotelRooms />
      </div>
    </div>
  );
}
