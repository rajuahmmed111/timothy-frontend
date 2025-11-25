import React, { useState } from "react";
import { ArrowLeft, XCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const defaultCancelledData = {
  hotelName: "Luxury Hotel",
  location: "Beachfront Resort, Maldives",
  cancelledDate: new Date().toISOString().split("T")[0],
  refundAmount: 0,
  isRefundable: false,
  reason: "User requested cancellation",
};

export default function BookingCancellation() {
  const location = useLocation();

  const [cancelData] = useState(() => {
    if (location.state?.cancelData) return location.state.cancelData;
    try {
      const saved = sessionStorage.getItem("lastCancelledBooking");
      if (saved) return JSON.parse(saved);
    } catch {}
    return { ...defaultCancelledData };
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r rounded-lg p-6 from-red-600 to-rose-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
            <XCircle className="w-10 h-10 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold mb-2">Booking Cancelled</h1>

          {/* Description */}
          <p className="text-red-100 text-lg">
            Your reservation has been successfully cancelled.
          </p>

          {/* Booking ID */}
         

          {/* Reason */}
          <p className="mt-1 text-red-100">
            Reason: {cancelData.reason || "N/A"}
          </p>

          {/* Refund Info */}
          {cancelData.isRefundable ? (
            <p className="mt-2 text-green-200 font-semibold">
              Refund Amount: {cancelData.refundAmount} (Refund will be processed
              shortly)
            </p>
          ) : (
            <p className="mt-2 text-yellow-200 font-semibold">
              This booking was non-refundable.
            </p>
          )}

          {/* Back to Home */}
          <Link
            to="/"
            className="mt-6 inline-flex items-center text-white hover:underline"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
