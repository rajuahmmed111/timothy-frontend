import React, { useState } from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "antd";

export default function CarBookingForm({ car, carIdFromParams }) {
  const navigate = useNavigate();
  const [isBooking, setIsBooking] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const { RangePicker } = DatePicker;

  const calculateTotal = () => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) return 0;
    const msPerDay = 1000 * 60 * 60 * 24;
    const days =
      Math.max(
        1,
        Math.floor(
          (dateRange[1].toDate().getTime() - dateRange[0].toDate().getTime()) /
            msPerDay
        )
      ) || 1;
    const price = Number(car?.pricePerDay) || parseInt(car?.price?.replace("$", "") || "50");
    return price * days;
  };

  const getDays = () => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) return 0;
    const msPerDay = 1000 * 60 * 60 * 24;
    return (
      Math.max(
        1,
        Math.floor(
          (dateRange[1].toDate().getTime() - dateRange[0].toDate().getTime()) /
            msPerDay
        )
      ) || 1
    );
  };

  const handleBooking = (e) => {
    e.preventDefault();
    if (!dateRange || !dateRange[0] || !dateRange[1]) return;

    const bookingDetails = {
      bookingId: "CAR" + Math.floor(10000000 + Math.random() * 90000000),
      carId: carIdFromParams || car?.id || car?._id || car?.carId || null,
      carName: car?.name || "Selected Car",
      pickupDate: dateRange[0].format("YYYY-MM-DD"),
      returnDate: dateRange[1].format("YYYY-MM-DD"),
      carType: car?.name || "Selected Car",
      total: calculateTotal(),
      days: getDays(),
      unitPrice: Number(car?.pricePerDay) || parseInt(car?.price?.replace("$", "") || "50"),
      carDescription: car?.description || "Car rental booking",
      location: car?.location || "Selected Location",
    };
    navigate("/car/checkout", { state: { bookingDetails } });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Book Your Car</h2>

      <form onSubmit={handleBooking} className="space-y-5">
        {/* Selected Car */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selected Car
          </label>
          <div className="p-3 border border-blue-500 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  {car?.name || "Selected Car"}
                </h3>
                <p className="text-sm text-gray-500">
                  {car?.location || "Location"}
                </p>
                <div className="mt-1 text-sm font-medium">
                  {car?.price}{" "}
                  <span className="text-gray-500 font-normal">/ day</span>
                </div>
              </div>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pickup Date and Return Date
          </label>
          <RangePicker
            placeholder={["Pickup Date", "Return Date"]}
            value={dateRange}
            onChange={setDateRange}
            style={{ width: "100%", height: "48px" }}
            className="border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            disabledDate={(current) =>
              current && current < new Date().setHours(0, 0, 0, 0)
            }
          />
        </div>

        {/* Price Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-3">Price Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{car?.price} per day</span>
            </div>
            {dateRange && dateRange[0] && dateRange[1] && (
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {getDays()} {getDays() === 1 ? "day" : "days"}
                </span>
                <span>${calculateTotal()}</span>
              </div>
            )}
            <div className="border-t border-gray-200 my-2"></div>
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>${calculateTotal()}</span>
            </div>
          </div>
        </div>

        {/* Book Now Button */}
        <button
          type="submit"
          disabled={isBooking || !dateRange || !dateRange[0] || !dateRange[1]}
          className={`w-full bg-[#0064D2] text-white py-3 px-6 rounded-lg font-medium transition-colors ${
            isBooking || !dateRange || !dateRange[0] || !dateRange[1]
              ? "opacity-70 cursor-not-allowed"
              : "hover:bg-blue-700"
          }`}
        >
          {isBooking ? "Processing..." : "Continue to Booking"}
        </button>
      </form>
    </div>
  );
}
