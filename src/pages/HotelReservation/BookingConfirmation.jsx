import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const defaultBookingData = {
  bookingId: "BK" + Math.floor(10000000 + Math.random() * 90000000),
  hotelName: "Luxury Hotel",
  location: "Beachfront Resort, Maldives",
  checkIn: new Date().toISOString().split("T")[0],
  checkOut: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0],
  guests: 2,
  roomType: "Deluxe Suite",
  total: 2500,
  bookingDate: new Date().toISOString().split("T")[0],
  paymentMethod: "Credit Card",
  rating: 4.8,
  rooms: 1,
  adults: 2,
  children: 0,
  isRefundable: true,
  vat: 10,
  nights: 7,
};

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const startTime = useRef(Date.now());

  // useEffect(() => {
  //   // Only run this effect on the client side
  //   if (typeof window !== "undefined") {
  //     const minVisible = 2000; // ms
  //     const elapsed = Date.now() - startTime.current;
  //     const remaining = Math.max(minVisible - elapsed, 0);

  //     const timer = setTimeout(() => {
  //       try {
  //         if (window.opener) {
  //           window.close();
  //         }
  //       } catch (e) {
  //         console.log("Could not close window:", e);
  //       }
  //     }, remaining + 250);

  //     return () => clearTimeout(timer);
  //   }
  // }, []);

  const [bookingData] = useState(() => {
    if (location.state?.bookingData) return location.state.bookingData;
    try {
      const saved = sessionStorage.getItem("lastBooking");
      if (saved) return JSON.parse(saved);
    } catch {}
    return { ...defaultBookingData };
  });

  return (
    <div className="flex  items-center justify-center min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r rounded-lg p-6 from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Transaction Successful</h1>
          <p className="text-blue-100 text-lg">
            Your payment has been processed successfully and you will shortly receive a confirmation email.
          </p>
          <p className="mt-2 text-blue-100">
            Booking ID: {bookingData.bookingId}
          </p>
          <Link to="/" className="mt-6 inline-flex items-center">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
