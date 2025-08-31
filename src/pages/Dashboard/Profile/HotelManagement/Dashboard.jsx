import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Hotels from "./Dashboard/Hotels";

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
  return (
    <div className="p-6 space-y-8">
      {/* Sales Bar Chart */}
      <div className="bg-gray-100 rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Total Sales</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="sales"
              fill="#3b82f6"   // blue color
              barSize={30}     // thinner bars (try 10–20)
              radius={[10, 10, 0, 0]} // top-left, top-right rounded
            />
          </BarChart>
        </ResponsiveContainer>
      </div>


      <Hotels />

    </div>
  );
}
