import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Select, Space } from "antd";
import { UserOutlined, TeamOutlined, HomeOutlined } from "@ant-design/icons";
import { DatePicker, Button } from "antd";
import { useBooking } from "../../../context/BookingContext";

export default function Hero() {
  const { bookingData, updateBookingData, updateGuests, resetBookingData } =
    useBooking();
  const [location, setLocation] = useState("");
  const navigate = useNavigate();
  const locationHook = useLocation();
  const isInitialMount = useRef(true);

  const { RangePicker } = DatePicker;

  const { Option } = Select;

  const handleGuestsChange = (type, value) => {
    updateGuests({
      [type]: value,
    });
  };

  const handleDateChange = (dates) => {
    updateBookingData({
      dateRange: dates,
    });
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocation(value);
    updateBookingData({
      location: value,
      searchQuery: value,
    });
  };

  const handleSearch = () => {
    // Update booking data before navigation
    updateBookingData({
      location: location,
      searchQuery: location,
    });
    const [start, end] = bookingData.dateRange || [];
    const paramsObj = {};
    const trimmed = (location || "").trim();
    if (trimmed) {
      paramsObj.searchTerm = trimmed;
    }
    if (
      start &&
      end &&
      typeof start.format === "function" &&
      typeof end.format === "function"
    ) {
      paramsObj.fromDate = start.format("YYYY-MM-DD");
      paramsObj.toDate = end.format("YYYY-MM-DD");
    }
    const params = new URLSearchParams(paramsObj).toString();
    navigate(params ? `/hotel?${params}` : "/hotel");
  };

  // Clear form data when navigating back to Hero page from other pages
  useEffect(() => {
    if (isInitialMount.current) {
      // Check if user is coming from a different page (not initial load)
      const fromHotel = locationHook.state?.from === "hotel";

      // Clear data if user is navigating back from hotel pages or other pages
      // but not on initial page load
      if (locationHook.key !== "default" && !fromHotel) {
        resetBookingData();
        setLocation("");
      }
      isInitialMount.current = false;
    }
  }, [locationHook.key, locationHook.state, resetBookingData]);

  return (
    <section
      className="relative h-[600px] bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/hotel.png')`,
      }}
    >
      <div className="container mx-auto absolute bottom-0 left-1/2 transform -translate-x-1/2 px-5 md:px-0 flex flex-col justify-end pb-10">
        <div>
          <h1 className="text-7xl font-bold mb-10 text-white">
            Book Your Stays
          </h1>
          {/* Custom Card */}
          <div className="bg-white p-5 rounded-2xl shadow-lg w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
              {/* Location Input */}
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Search For Your Stays"
                  value={location}
                  onChange={handleLocationChange}
                  className="w-full p-3 border border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:border-[#0064D2]"
                />
              </div>

              {/* Check-in & Check-out */}
              <RangePicker
                placeholder={["Check-in", "Check-out"]}
                value={bookingData.dateRange}
                onChange={handleDateChange}
                style={{ width: "100%" }}
              />

              {/* Guests and Rooms */}
              <div className="space-y-2 h-full flex flex-col">
                <Select
                  value={
                    bookingData.guests.adults > 1 ||
                    bookingData.guests.children > 0 ||
                    bookingData.guests.rooms > 1
                      ? `${bookingData.guests.adults} ${
                          bookingData.guests.adults !== 1 ? "adults" : "adult"
                        } · ${bookingData.guests.children} ${
                          bookingData.guests.children !== 1
                            ? "children"
                            : "child"
                        } · ${bookingData.guests.rooms} ${
                          bookingData.guests.rooms !== 1 ? "rooms" : "room"
                        }`
                      : undefined
                  }
                  placeholder="1 adult · 0 children · 1 room"
                  className="w-full h-full [&>div]:h-full [&>div]:py-2.5 [&>div]:px-3 [&_.ant-select-selection-placeholder]:text-gray-400 focus:outline-none focus:border-[#0064D2]"
                  style={{ height: "100%" }}
                  dropdownMatchSelectWidth={false}
                  dropdownRender={() => (
                    <div className="p-4 space-y-4 min-w-[300px]">
                      {/* Adults Counter */}
                      <div className="flex justify-between items-center">
                        <Space>
                          <UserOutlined className="text-gray-600" />
                          <span>Adults</span>
                        </Space>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() =>
                              handleGuestsChange(
                                "adults",
                                Math.max(1, bookingData.guests.adults - 1)
                              )
                            }
                            disabled={bookingData.guests.adults <= 1}
                            className="flex items-center justify-center w-8 h-8"
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">
                            {bookingData.guests.adults}
                          </span>
                          <Button
                            onClick={() =>
                              handleGuestsChange(
                                "adults",
                                bookingData.guests.adults + 1
                              )
                            }
                            disabled={bookingData.guests.adults >= 8}
                            className="flex items-center justify-center w-8 h-8"
                          >
                            +
                          </Button>
                        </div>
                      </div>

                      {/* Children Counter */}
                      <div className="flex justify-between items-center">
                        <Space>
                          <TeamOutlined className="text-gray-600" />
                          <span>Children</span>
                        </Space>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() =>
                              handleGuestsChange(
                                "children",
                                Math.max(0, bookingData.guests.children - 1)
                              )
                            }
                            disabled={bookingData.guests.children <= 0}
                            className="flex items-center justify-center w-8 h-8"
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">
                            {bookingData.guests.children}
                          </span>
                          <Button
                            onClick={() =>
                              handleGuestsChange(
                                "children",
                                bookingData.guests.children + 1
                              )
                            }
                            disabled={bookingData.guests.children >= 4}
                            className="flex items-center justify-center w-8 h-8"
                          >
                            +
                          </Button>
                        </div>
                      </div>

                      {/* Rooms Counter */}
                      <div className="flex justify-between items-center">
                        <Space>
                          <HomeOutlined className="text-gray-600" />
                          <span>Rooms</span>
                        </Space>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() =>
                              handleGuestsChange(
                                "rooms",
                                Math.max(1, bookingData.guests.rooms - 1)
                              )
                            }
                            disabled={bookingData.guests.rooms <= 1}
                            className="flex items-center justify-center w-8 h-8"
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">
                            {bookingData.guests.rooms}
                          </span>
                          <Button
                            onClick={() =>
                              handleGuestsChange(
                                "rooms",
                                bookingData.guests.rooms + 1
                              )
                            }
                            disabled={bookingData.guests.rooms >= 5}
                            className="flex items-center justify-center w-8 h-8"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                >
                  <Option value="guests">
                    {`${bookingData.guests.adults} ${
                      bookingData.guests.adults !== 1 ? "adults" : "adult"
                    } · ${bookingData.guests.children} ${
                      bookingData.guests.children !== 1 ? "children" : "child"
                    } · ${bookingData.guests.rooms} ${
                      bookingData.guests.rooms !== 1 ? "rooms" : "room"
                    }`}
                  </Option>
                </Select>
              </div>
            </div>
            {/* Search Button */}
            <div className="">
              <button
                onClick={handleSearch}
                className="w-full bg-[#0064D2] text-white py-3 rounded-lg font-bold hover:bg-[#0052A3] transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
