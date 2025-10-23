import React from "react";
import { useState } from "react";
import SecurityDashboard from "../../../components/Security/SecurityDashboard";
import SecurityBookings from "../../../components/Security/SecurityBookings";
import AllSecurityListings from "../../../components/Security/AllSecurityListings";
import AvailableSecurity from "../../../components/Security/AvailableSecurity";
import ReviewSecurityBussiness from "../../../components/Security/ReviewSecurityBussiness";

export default function SecurityManagement() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "booking", label: "Booking" },
    { id: "listings", label: "Active Listings" },
    { id: "addBusiness", label: "Add Business" },
    { id: "reviewBusiness", label: "Review Business" },
    { id: "availableListing", label: "Available Listing" },
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
        {activeTab === "dashboard" && <SecurityDashboard />}
        {activeTab === "booking" && <SecurityBookings />}
        {activeTab === "listings" && <AllSecurityListings />}
        {activeTab === "addBusiness" && "add security business"}
        {activeTab === "reviewBusiness" && <ReviewSecurityBussiness />}
        {activeTab === "availableListing" && <AvailableSecurity />}
      </div>
    </div>
  );
}
