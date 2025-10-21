import React, { useState } from "react";
import Dashboard from "../../../components/Hotel/Dashboard";
import AddCarBusiness from "./AddCarBusiness";
import ReviewBusiness from "../../../components/Hotel/ReviewBusiness";
import CarBookings from "./CarBookings";
import CarListings from "./CarListings";
import AvailableCarListing from "./AvailableCarListing";


export default function CarManagement() {
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
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === tab.id
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
                    "Car Management Dashboard"
                )}
                {activeTab === "booking" && (
                    "Car Booking list"
                )}
                {activeTab === "listings" && (
                    "Car Listings"
                )}
                {activeTab === "addBusiness" && (
                    <AddCarBusiness />
                )}
                {activeTab === "reviewBusiness" && (
                    <ReviewBusiness />
                )}
                {activeTab === "availableListing" && (
                    <AvailableCarListing />
                )}
            </div>
        </div>
    );
}
