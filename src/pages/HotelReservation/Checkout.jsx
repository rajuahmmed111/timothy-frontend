import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Users,
  MapPin,
  User,
  Mail,
  Phone,
} from "lucide-react";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state?.bookingData;
  const [isReserved, setIsReserved] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  console.log("bookingData", bookingData);

  const safeGuests = {
    adults: bookingData?.adults || 1,
    children: bookingData?.children || 0,
    rooms: bookingData?.rooms || 1,
  };

  const userInfo = bookingData?.user || {};

  const handleReserveConfirm = async () => {
    setIsProcessing(true);
    try {
      // Here you would typically make an API call to create a temporary reservation
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulating API call
      setIsReserved(true);
    } catch (error) {
      console.error("Reservation failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToBooking = () => {
    navigate("/hotel");
  };

  const handleGuestLoginThenProceed = async () => {
    if (
      !guestInfo.fullName ||
      !guestInfo.email ||
      !guestInfo.phone ||
      !guestInfo.country
    ) {
      return;
    }
    try {
      const res = await loginWebsite({
        fullName: guestInfo.fullName,
        email: guestInfo.email,
        contactNumber: guestInfo.phone,
        country: guestInfo.country,
      }).unwrap();

      const accessToken = res?.data?.accessToken || res?.accessToken;
      const authUser = res?.data?.user || res?.user;
      if (accessToken) {
        try {
          localStorage.setItem("accessToken", accessToken);
        } catch {}
        dispatch(setCredentials({ accessToken, user: authUser }));
      }
    } catch (e) {
      // silently fail; you can add toast here if desired
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen items-center bg-gray-50 py-4  md:py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-4 md:mb-6">
          <button
            onClick={handleBackToBooking}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 md:w-8 md:h-8 mr-2" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 ml-2 md:ml-4">
              Checkout
            </h1>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Booking Summary */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                Booking Summary
              </h2>

              <div className="space-y-6">
                {/* Guest Information */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-md font-medium text-gray-900 mb-3">
                    Guest Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="text-gray-900">
                          {userInfo.fullName || userInfo.name || "Guest"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="text-gray-900">
                          {userInfo.email || "Not provided"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="text-gray-900">
                          {userInfo.phone || "Not provided"}
                           
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hotel Information */}
                <div className="flex items-start space-x-4">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {bookingData.hotelName}
                    </h3>
                    <p className="text-gray-600">{bookingData.location}</p>
                  </div>
                </div>

                {/* Dates */}
                <div className="flex items-center space-x-4">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-gray-900">
                      {formatDate(bookingData.checkIn)} -{" "}
                      {formatDate(bookingData.checkOut)}
                    </p>
                    <p className="text-gray-600">{bookingData.nights} nights</p>
                  </div>
                </div>

                {/* Guests */}
                <div className="flex items-center space-x-4">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-gray-900">
                      {safeGuests.adults}{" "}
                      {safeGuests.adults !== 1 ? "adults" : "adult"}
                      {safeGuests.children > 0 &&
                        `, ${safeGuests.children} ${
                          safeGuests.children !== 1 ? "children" : "child"
                        }`}
                    </p>
                    <p className="text-gray-600">
                      {safeGuests.rooms}{" "}
                      {safeGuests.rooms !== 1 ? "rooms" : "room"}
                    </p>
                  </div>
                </div>

                {/* Room Details */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-gray-900">
                        {bookingData.roomType}
                      </span>
                      {bookingData.specialRequest && (
                        <p className="text-sm text-gray-600 mt-1">
                          Special Request: {bookingData.specialRequest}
                        </p>
                      )}
                    </div>
                    <span className="text-gray-900">
                      ${bookingData.roomPrice}/night
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Sidebar - Price Summary */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-4 md:p-6 lg:sticky lg:top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Price Summary
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>
                    ${bookingData.roomPrice} × {bookingData.nights} nights ×{" "}
                    {safeGuests.rooms} {safeGuests.rooms > 1 ? "rooms" : "room"}
                  </span>
                  <span>${bookingData.subtotal}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>VAT (12%)</span>
                  <span>${bookingData.vat}</span>
                </div>

                {/* Add service fee if applicable */}
                {bookingData.serviceFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Service Fee</span>
                    <span>${bookingData.serviceFee}</span>
                  </div>
                )}

                <div className="border-t pt-3">
                  <div className="flex flex-col">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total Amount</span>
                      <span>${bookingData.total}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Includes VAT and all applicable taxes
                    </p>
                  </div>
                  <div className="mt-6 space-y-4">
                    {!isReserved ? (
                      <button
                        onClick={handleReserveConfirm}
                        disabled={isProcessing}
                        className={`w-full py-3 text-white rounded-lg font-medium transition-all ${
                          isProcessing
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-700 hover:bg-blue-800"
                        }`}
                      >
                        {isProcessing ? "Processing..." : "Confirm Reserve"}
                      </button>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <p className="text-green-800 text-sm">
                            ✓ Room reserved successfully! Please proceed with
                            payment to confirm your booking.
                          </p>
                        </div>
                        <button className="w-full py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium">
                          Confirm & Pay ${bookingData.total}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
