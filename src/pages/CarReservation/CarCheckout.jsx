import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Calendar, CreditCard, ArrowLeft } from "lucide-react";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

import { useCreateCarBookingMutation } from "../../redux/api/car/carApi";
import { handleError, handleSuccess } from "./../../../toast";

export default function CarCheckout() {
  const user = useSelector((state) => state?.auth?.user);
  const accessToken = useSelector((state) => state?.auth?.accessToken);
  const decodedUserInfo = useMemo(() => {
    if (!accessToken) return null;
    try {
      const decoded = jwtDecode(accessToken);
      return {
        ...user,
        ...decoded,
        token: accessToken,
      };
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }, [accessToken, user]);
  console.log("userInfo", decodedUserInfo);

  const location = useLocation();
  const navigate = useNavigate();
  console.log("user", user);

  const [isProcessing, setIsProcessing] = useState(false);
  const bookingState = location.state || {};
  const bookingDetails =
    bookingState.bookingDetails || bookingState.bookingData || null;
  const carCancelationPolicy = bookingDetails?.carCancelationPolicy;
  console.log("bookingDetails from car checkout", bookingDetails);
  const [updatedUser, setUpdatedUser] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    country: user?.country || "",
  });

  const [serverTotal, setServerTotal] = useState(null);
  const [createCarBooking] = useCreateCarBookingMutation();

  // console.log("bookingDetails);

  // Calculate additional details
  const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
  const msPerDay = 1000 * 60 * 60 * 24;
  const days = bookingDetails
    ? Math.max(
        1,
        Math.floor(
          (new Date(bookingDetails.returnDate) -
            new Date(bookingDetails.pickupDate)) /
            msPerDay
        )
      )
    : 0;
  const carPrice =
    bookingDetails && days > 0 ? round2(bookingDetails.total / days) : 0;
  const taxes = bookingDetails ? round2(bookingDetails.total * 0.05) : 0;
  const finalTotal = bookingDetails ? round2(bookingDetails.total + taxes) : 0;

  const displayFinalTotal = serverTotal ?? finalTotal;
  const displayVat = serverTotal
    ? round2(displayFinalTotal - round2(displayFinalTotal / 1.05))
    : taxes;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleUpdatedUserChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleBackToBooking = () => {
    navigate(-1);
  };

  const userInfo = {
    id:
      user?.id ||
      user?._id ||
      decodedUserInfo?.id ||
      bookingDetails?.user?.id ||
      updatedUser?.id ||
      null,
    name:
      updatedUser?.name ||
      bookingDetails?.user?.fullName ||
      user?.name ||
      decodedUserInfo?.name ||
      "",
    email:
      updatedUser?.email ||
      bookingDetails?.user?.email ||
      user?.email ||
      decodedUserInfo?.email ||
      "",
    phone:
      updatedUser?.phone ||
      bookingDetails?.user?.contactNumber ||
      bookingDetails?.user?.phone ||
      user?.phone ||
      decodedUserInfo?.phone ||
      "",
    country:
      updatedUser?.country ||
      bookingDetails?.user?.country ||
      user?.country ||
      bookingDetails?.carCountry ||
      decodedUserInfo?.country ||
      "",
  };

  const handleContinueToPayment = async () => {
    if (!bookingDetails?.carId) {
      handleError("Unable to proceed: missing car selection.");
      return;
    }

    const carIdForBooking =
      bookingDetails.carId || bookingDetails?.id || bookingDetails?.carId;
    if (!carIdForBooking) {
      handleError(
        "Car identifier is missing. Please restart the booking flow."
      );
      return;
    }

    setIsProcessing(true);
    try {
      const bookingPayload = {
        name: updatedUser?.name || userInfo.name,
        email: updatedUser?.email || userInfo.email,
        phone: updatedUser?.phone || userInfo.phone,
        address: updatedUser?.country || userInfo.country,
        convertedPrice: bookingDetails.convertedPrice || bookingDetails.total,
        displayCurrency:
          bookingDetails.displayCurrency || bookingDetails.currency,
        discountedPrice: bookingDetails.discountedPrice || 0,
        carBookedFromDate: bookingDetails.pickupDate,
        carBookedToDate: bookingDetails.returnDate,
        total: displayFinalTotal,
        totalPrice: displayFinalTotal,
        currency: bookingDetails.currency,
        location: bookingDetails.location,
        carName: bookingDetails.carName,
        carSeats: bookingDetails.carSeats,
        carCountry: bookingDetails.carCountry,
        carCancelationPolicy,
        days: bookingDetails.days || 1,
        guests: bookingDetails.guests || 1,
        unitPrice: bookingDetails.unitPrice,
        description: bookingDetails.carDescription,
        userId: userInfo.id,
        user: userInfo,
      };

      const response = await createCarBooking({
        carId: carIdForBooking,
        data: bookingPayload,
      }).unwrap();

      const createdBookingId =
        response?.data?.bookingId ||
        response?.data?._id ||
        response?.data?.id ||
        response?.bookingId ||
        response?.id ||
        bookingDetails?.bookingId ||
        null;

      if (!createdBookingId) {
        throw new Error("Car booking reference missing from server response.");
      }

      const paymentDetails = {
        ...bookingDetails,
        bookingId: createdBookingId,
        total: displayFinalTotal,
        user: userInfo,
      };

      handleSuccess("Car reserve successfully!");
      navigate("/car/payment", {
        state: {
          bookingDetails: paymentDetails,
          createdBookingId,
          carCancelationPolicy,
        },
      });
    } catch (error) {
      console.error("Car booking creation failed:", error);
      const message =
        error?.data?.message ||
        error?.message ||
        "Failed to create car booking.";
      handleError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="my-10 flex items-center justify-start">
          <button
            onClick={handleBackToBooking}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-8 h-8 mr-2" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        {!bookingDetails ? (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <p className="text-gray-700 mb-4">No booking details found.</p>
            <button
              onClick={handleBackToBooking}
              className="bg-[#0064D2] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0053ad]"
            >
              Go Back
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Booking Details */}
            <div className="lg:col-span-2 space-y-5 bg-white rounded-xl shadow-sm p-5">
              <h2 className="text-3xl font-semibold mb-5">Booking Summary</h2>
              {/* Guest Information / User Info (parity with Hotel) */}
              <div className="bg-blue-50 rounded-lg p-5">
                <h2 className="text-xl font-semibold mb-5">
                  Guest Information
                </h2>
                <form className="space-y-4">
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                      <span>Full Name</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={updatedUser.name}
                      onChange={handleUpdatedUserChange}
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:outline-none p-2 border"
                    />
                  </div>
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                      <span>Email</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={updatedUser.email}
                      onChange={handleUpdatedUserChange}
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:outline-none p-2 border"
                    />
                  </div>
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                      <span>Phone</span>
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={updatedUser.phone}
                      onChange={handleUpdatedUserChange}
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:outline-none p-2 border"
                    />
                  </div>
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                      <span>Country</span>
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={updatedUser.country}
                      readOnly
                      className="mt-1 w-full rounded-md border-gray-300 p-2 border focus:outline-none"
                    />
                  </div>
                </form>
              </div>
              {/* Booking Summary Card */}
              <div className="">
                <div className="space-y-4">
                  {/* Car Type */}
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Car Model</span>
                    <span className="font-medium text-gray-900">
                      {bookingDetails.carName}
                    </span>
                  </div>
                  {/* Location */}
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Pickup Location</span>
                    <span className="font-medium text-gray-900">
                      {bookingDetails.location}
                    </span>
                  </div>
                  {/* Dates */}
                  <div className="py-3 border-b border-gray-100">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">
                          Pickup Date
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatDate(bookingDetails.pickupDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">
                          Return Date
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatDate(bookingDetails.returnDate)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-100">
                        <span className="text-sm text-gray-500">Duration</span>
                        <span className="text-sm font-medium text-gray-900">
                          {days} {days === 1 ? "day" : "days"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Price Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Price Summary
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {carPrice} × {days} {days === 1 ? "day" : "days"}
                    </span>
                    <span className="text-gray-900">
                      {bookingDetails?.currency}
                      {""} {bookingDetails.total}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">VAT 5%</span>
                    <span className="text-gray-900">{displayVat}</span>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">
                        Total Amount
                      </span>
                      <span className="text-lg font-semibold text-gray-900">
                        {bookingDetails?.currency}
                        {""} {displayFinalTotal}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Proceed to Payment Button */}
                <button
                  onClick={handleContinueToPayment}
                  disabled={isProcessing}
                  className={`w-full mt-6 py-3 text-white rounded-lg font-medium ${
                    isProcessing
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-700 hover:bg-blue-800"
                  }`}
                >
                  {isProcessing ? "Processing..." : "Continue"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
