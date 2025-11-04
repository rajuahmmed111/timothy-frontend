import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Shield, CreditCard, ArrowLeft, Check, Calendar } from "lucide-react";
import {
  useCreateSecurityBookingMutation,
  useCreateSecurityStripeCheckoutSessionMutation,
  useCreateSecurityPaystackCheckoutSessionMutation,
} from "../../redux/api/security/securityBookingApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, message } from "antd";
import { UserOutlined } from "@ant-design/icons";

const AFRICAN_COUNTRIES = [
  "Algeria",
  "Angola",
  "Benin",
  "Botswana",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cameroon",
  "Central African Republic",
  "Chad",
  "Comoros",
  "Congo",
  "Democratic Republic of the Congo",
  "Djibouti",
  "Egypt",
  "Equatorial Guinea",
  "Eritrea",
  "Eswatini",
  "Ethiopia",
  "Gabon",
  "Gambia",
  "Ghana",
  "Guinea",
  "Guinea-Bissau",
  "Ivory Coast",
  "Kenya",
  "Lesotho",
  "Liberia",
  "Libya",
  "Madagascar",
  "Malawi",
  "Mali",
  "Mauritania",
  "Mauritius",
  "Morocco",
  "Mozambique",
  "Namibia",
  "Niger",
  "Nigeria",
  "Rwanda",
  "Sao Tome and Principe",
  "Senegal",
  "Seychelles",
  "Sierra Leone",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Sudan",
  "Tanzania",
  "Togo",
  "Tunisia",
  "Uganda",
  "Zambia",
  "Zimbabwe",
];

export default function SecurityCheckout() {
  const location = useLocation();
  const navigate = useNavigate();

  // State
  const [isReserved, setIsReserved] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);
  const [createdBookingId, setCreatedBookingId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("stripe"); // 'stripe' or 'paystack'
  const [showPaymentChoiceModal, setShowPaymentChoiceModal] = useState(false);

  // API Mutations
  const [createBooking, { isLoading: isCreating }] =
    useCreateSecurityBookingMutation();
  const [createStripeCheckout] =
    useCreateSecurityStripeCheckoutSessionMutation();
  const [createPaystackCheckout] =
    useCreateSecurityPaystackCheckoutSessionMutation();

  const bookingDetails = location.state?.bookingDetails || {};

  console.log("Booking Details11111111111111", bookingDetails);

  // Check if user is in Africa (for payment method selection)
  const isAfricaByCountry = (country) => {
    const africanCountries = [
      "Nigeria",
      "Ghana",
      "Kenya",
      "South Africa",
      "Egypt",
      "Morocco",
      "Ethiopia",
      "Tanzania",
      "Uganda",
      "Zimbabwe",
      "Zambia",
      "Rwanda",
      "Senegal",
      "Tunisia",
    ];
    return country && africanCountries.includes(country);
  };

  // Get user country from booking details or localStorage
  const storedUserRaw =
    typeof window !== "undefined"
      ? localStorage.getItem("user") || localStorage.getItem("profile") || null
      : null;

  let userCountry = bookingDetails.user?.country || "";

  if (!userCountry && storedUserRaw) {
    try {
      const storedUser = JSON.parse(storedUserRaw);
      userCountry =
        storedUser?.country ||
        storedUser?.address?.country ||
        storedUser?.profile?.country ||
        storedUser?.location?.country ||
        "";
    } catch (e) {
      console.error("Error parsing user data:", e);
    }
  }

  const isAfricanUser = AFRICAN_COUNTRIES.some(
    (c) => c.toLowerCase() === String(userCountry).toLowerCase()
  );

  // Calculate booking details
  const days =
    Math.ceil(
      (new Date(bookingDetails.endDate) - new Date(bookingDetails.startDate)) /
        (1000 * 60 * 60 * 24)
    ) || 1;

  const servicePrice = bookingDetails.pricePerDay || 0;
  const subtotal = servicePrice * days;
  const taxRate = 0.05; // 5% tax
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  const shouldUsePaystack = isAfricaByCountry(userCountry);

  // Check if user is logged in
  const isLoggedIn = Boolean(
    typeof window !== "undefined" &&
      (localStorage.getItem("accessToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("user"))
  );

  // Handle API errors
  const apiError = location.state?.error || location.state?.apiError || null;
  useEffect(() => {
    if (apiError) {
      const statusCode =
        apiError?.statusCode || apiError?.status || apiError?.err?.statusCode;
      const errorMessage =
        apiError?.message || apiError?.errorMessages?.[0]?.message;

      if (statusCode === 401 || /not authorized/i.test(errorMessage || "")) {
        setShowAuthModal(true);
      }

      if (errorMessage) {
        message.error(errorMessage);
      }
    }
  }, [apiError]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleProceedToBooking = async () => {
    try {
      setIsProcessing(true);
      const id = bookingDetails?.guardId;
      const days = bookingDetails?.days || 1;
      const total =
        bookingDetails?.total || (bookingDetails?.pricePerDay || 0) * days;
      const body = {
        number_of_security: bookingDetails?.personnelCount || 1,
        securityBookedFromDate: bookingDetails?.startDate,
        securityBookedToDate: bookingDetails?.endDate,
        totalPrice: total,
        guardId: bookingDetails?.guardId,
        serviceType: bookingDetails?.serviceType || "Security",
        status: "pending",
        paymentStatus: "pending",
        guardName: bookingDetails?.guardName,
        pricePerDay: bookingDetails?.pricePerDay,
        serviceDescription: bookingDetails?.serviceDescription,
      };
      console.log("Creating booking with:", { id, body });
      const resp = await createBooking({ id, body }).unwrap();
      console.log("Create booking response:", resp);
      const bookingData = resp?.data || resp;
      setCreatedBooking(bookingData);
      setCreatedBookingId(bookingData?._id || bookingData?.id);
      setIsReserved(true);
      setShowPaymentChoiceModal(true);
    } catch (err) {
      console.error("Create booking failed:", err);
      const statusCode =
        err?.status || err?.data?.statusCode || err?.originalStatus;
      const apiMessage =
        err?.data?.message ||
        err?.data?.error ||
        err?.data?.errorMessage ||
        err?.data?.errorMessages?.[0]?.message ||
        err?.error ||
        err?.message ||
        "";
      const isAlreadyBooked = /already\s*book(ed)?/i.test(apiMessage);
      if (statusCode === 401) {
        setShowAuthModal(true);
      }
      toast.dismiss();
      toast.error(
        isAlreadyBooked
          ? "This security service is already booked for the selected dates"
          : apiMessage || "Failed to create booking. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProceedToPayment = async () => {
    if (!createdBookingId || !bookingDetails.user) {
      message.error("Booking information is incomplete");
      return;
    }

    setIsProcessing(true);
    try {
      const userEmail = bookingDetails.user.email;
      const userName = bookingDetails.user.name || "Customer";

      if (shouldUsePaystack) {
        // Handle Paystack payment
        const result = await createPaystackCheckout({
          bookingId: createdBookingId,
          body: {
            email: userEmail,
            amount: Math.round(total * 100), // Convert to kobo/pesewas
            currency: "NGN",
            metadata: {
              bookingId: createdBookingId,
              customerName: userName,
            },
          },
        }).unwrap();

        if (result?.data?.checkoutUrl) {
          window.location.href = result.data.checkoutUrl;
        } else {
          message.error("Failed to initialize payment. Please try again.");
        }
      } else {
        // Handle Stripe payment
        const result = await createStripeCheckout({
          bookingId: createdBookingId,
          body: {
            email: userEmail,
            name: userName,
            amount: Math.round(total * 100), // Convert to cents
            currency: "USD",
            metadata: {
              bookingId: createdBookingId,
              customerName: userName,
            },
            success_url: `${window.location.origin}/payment/success`,
            cancel_url: `${window.location.origin}/booking/cancel`,
          },
        }).unwrap();

        if (result?.data?.checkoutUrl) {
          window.location.href = result.data.checkoutUrl;
        } else {
          message.error("Failed to initialize payment. Please try again.");
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      message.error("Failed to process payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-8xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={handleGoBack}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Service Details
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Security Service Checkout
            </h1>
            <p className="text-gray-600 mt-2">
              Review your booking details before proceeding to payment
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Booking Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* User Information Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex items-center mb-4">
                  <UserOutlined className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Your Information
                  </h2>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">{bookingDetails.user?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">
                        {bookingDetails.user?.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">
                        {bookingDetails.user?.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Country</p>
                      <p className="font-medium">
                        {bookingDetails.user?.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Summary Card */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <Shield className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Booking Summary
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Booking ID */}
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Booking ID</span>
                    <span className="font-medium text-gray-900">
                      {bookingDetails.bookingId}
                    </span>
                  </div>

                  {/* Service Description */}
                  <div className="py-3 border-b border-gray-100">
                    <span className="text-gray-600 block mb-2">
                      Service Description
                    </span>
                    <span className="text-gray-900">
                      {bookingDetails.serviceDescription}
                    </span>
                  </div>

                  {/* Dates */}
                  <div className="py-3 border-b border-gray-100">
                    <div className="flex items-center mb-3">
                      <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-gray-600">Service Period</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">
                          Start Date
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatDate(bookingDetails.startDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">End Date</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatDate(bookingDetails.endDate)}
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
                      {servicePrice} × {days} {days === 1 ? "day" : "days"}
                    </span>
                    <span className="text-gray-900">
                      ${bookingDetails.total}
                    </span>
                  </div>

                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">
                        Total
                      </span>
                      <span className="text-lg font-semibold text-gray-900">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {!isReserved ? (
                    <button
                      onClick={handleProceedToBooking}
                      disabled={isProcessing}
                      className={`w-full py-3 text-white rounded-lg font-medium transition-all ${
                        isProcessing
                          ? "bg-blue-400 cursor-not-allowed"
                          : "bg-blue-700 hover:bg-blue-800"
                      }`}
                    >
                      {isProcessing ? "Processing..." : "Confirm Reservation"}
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-green-800 text-sm flex items-center">
                          <Check className="w-4 h-4 mr-2" />
                          Security service reserved successfully! Please proceed
                          with payment to confirm your booking.
                        </p>
                      </div>
                      <button
                        onClick={handleProceedToPayment}
                        disabled={isProcessing}
                        className="w-full py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium flex items-center justify-center"
                      >
                        {isProcessing
                          ? "Processing..."
                          : `Pay $${total.toFixed(2)}`}
                        {!isProcessing && (
                          <CreditCard className="ml-2 w-5 h-5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
