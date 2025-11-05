import React, { useState } from "react";
import { Tabs } from "antd";
import HotelBookings from "./components/HotelBookings";
import CarBookings from "./components/CarBookings";
import SecurityBookings from "./components/SecurityBookings";
import AttractionBookings from "./components/AttractionBookings";

export default function MyBookings() {
  const [activeTab, setActiveTab] = useState("car");

  const items = [
    {
      key: "car",
      label: "Car Rentals",
    },
    {
      key: "stay",
      label: "Hotels",
    },
    {
      key: "security",
      label: "Security",
    },
    {
      key: "attraction",
      label: "Attractions",
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "car":
        return <CarBookings />;
      case "stay":
        return <HotelBookings />;
      case "security":
        return <SecurityBookings />;
      case "attraction":
        return <AttractionBookings />;
      default:
        return <div>Please select a valid tab</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto mt-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">View and manage all your bookings in one place</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={items}
            tabBarStyle={{ padding: '0 24px', marginBottom: 0 }}
            className="booking-tabs"
          />
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
