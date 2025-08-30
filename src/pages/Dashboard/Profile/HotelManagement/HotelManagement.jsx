import React, { useState } from "react";
import Dashboard from "./Dashboard";

export default function HotelManagement() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "booking", label: "Booking" },
    { id: "listings", label: "Active Listings" },
    { id: "addBusiness", label: "Add Business" },
    { id: "reviewBusiness", label: "Review Business" },
  ];

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex bg-blue-600 rounded-full p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-white text-blue-600 shadow"
                : "text-white hover:bg-blue-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === "dashboard" && (
          <Dashboard />
        )}
        {activeTab === "booking" && (
          <div className="p-4 border rounded">Here are your Bookings</div>
        )}
        {activeTab === "listings" && (
          <div className="p-4 border rounded">Active Listings Page</div>
        )}
        {activeTab === "addBusiness" && (
          <div className="p-4 border rounded">Add a new Business</div>
        )}
        {activeTab === "reviewBusiness" && (
          <div className="p-4 border rounded">Review Business Section</div>
        )}
      </div>
    </div>
  );
}
