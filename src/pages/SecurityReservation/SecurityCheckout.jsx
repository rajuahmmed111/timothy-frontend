import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Calendar,
  Shield,
  CreditCard,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";
import {
  useCreateSecurityBookingMutation,
  useCreateSecurityStripeCheckoutSessionMutation,
  useCreateSecurityPaystackCheckoutSessionMutation,
} from "../../redux/api/security/securityBookingApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, message } from "antd";

export default function SecurityCheckout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [showPaymentChoiceModal, setShowPaymentChoiceModal] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // null, 'processing', 'success', 'error'
  const [shouldUsePaystack, setShouldUsePaystack] = useState(false);
  const [createBooking, { isLoading: isCreating }] =
    useCreateSecurityBookingMutation();
  const [createStripeSession, { isLoading: isCreatingStripe }] =
    useCreateSecurityStripeCheckoutSessionMutation();
  const [createPaystackSession, { isLoading: isCreatingPaystack }] =
    useCreateSecurityPaystackCheckoutSessionMutation();
  const [guestInfo, setGuestInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "+1",
    street: "",
    city: "",
    postcode: "",
    country: "",
  });

  // Get booking details from navigation state
  const bookingDetails = location.state?.bookingDetails || {};

  // Determine payment provider by user location (Africa => Paystack, otherwise Stripe)
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
  const storedUserRaw =
    typeof window !== "undefined"
      ? localStorage.getItem("user") || localStorage.getItem("profile") || null
      : null;
  let userCountry = "";
  try {
    const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;
    userCountry =
      storedUser?.country ||
      storedUser?.address?.country ||
      storedUser?.profile?.country ||
      storedUser?.location?.country ||
      "";
  } catch (e) {
    userCountry = "";
  }
  const isAfricanUser = AFRICAN_COUNTRIES.some(
    (c) => c.toLowerCase() === String(userCountry).toLowerCase()
  );

  // Calculate total price for display
  const totalPrice = bookingDetails?.total || 0;

  const isLoggedIn = Boolean(
    typeof window !== "undefined" &&
      (localStorage.getItem("accessToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("user"))
  );

  // Detect 401 errors passed via navigation state and open modal
  const apiError = location.state?.error || location.state?.apiError || null;
  useEffect(() => {
    const statusCode =
      apiError?.statusCode || apiError?.status || apiError?.err?.statusCode;
    const message = apiError?.message || apiError?.errorMessages?.[0]?.message;
    if (statusCode === 401 || /not authorized/i.test(message || "")) {
      setShowAuthModal(true);
    }
  }, [apiError]);

  console.log("booking", bookingDetails);
  // Calculate additional details
  const days =
    Math.ceil(
      (new Date(bookingDetails.endDate) - new Date(bookingDetails.startDate)) /
        (1000 * 60 * 60 * 24)
    ) || 1;
  const servicePrice = bookingDetails.total / days;
  const taxes = Math.round(bookingDetails.total * 0.08);
  const finalTotal = bookingDetails.total + taxes;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleProceedToPayment = async () => {
    try {
      setIsProcessing(true);
      const id = bookingDetails?.guardId;
      const body = {
        number_of_security: 1,
        securityBookedFromDate: bookingDetails?.startDate,
        securityBookedToDate: bookingDetails?.endDate,
        totalPrice: finalTotal,
      };
      console.log("Creating booking with:", { id, body });
      const resp = await createBooking({ id, body }).unwrap();
      console.log("Create booking response:", resp);
      const booking = resp?.data || resp;
      setCreatedBooking(booking);
      setPaymentStatus(null);
      setIsPaymentModalOpen(true);
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

  const handleLoginRedirect = () => {
    const redirectTo = encodeURIComponent(
      window.location.pathname + window.location.search
    );
    navigate(`/login?redirect=${redirectTo}`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGuestInfoChange = (field, value) => {
    setGuestInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCountrySelect = (countryCode) => {
    handleGuestInfoChange("countryCode", countryCode);
    setIsCountryDropdownOpen(false);
  };
  // Common country codes
  const countryCodes = [
    { code: "+1", country: "US/CA", flag: "🇺🇸" },
    { code: "+44", country: "UK", flag: "🇬🇧" },
    { code: "+91", country: "IN", flag: "🇮🇳" },
    { code: "+86", country: "CN", flag: "🇨🇳" },
    { code: "+81", country: "JP", flag: "🇯🇵" },
    { code: "+49", country: "DE", flag: "🇩🇪" },
    { code: "+33", country: "FR", flag: "🇫🇷" },
    { code: "+39", country: "IT", flag: "🇮🇹" },
    { code: "+34", country: "ES", flag: "🇪🇸" },
    { code: "+61", country: "AU", flag: "🇦🇺" },
    { code: "+55", country: "BR", flag: "🇧🇷" },
    { code: "+52", country: "MX", flag: "🇲🇽" },
    { code: "+7", country: "RU", flag: "🇷🇺" },
    { code: "+82", country: "KR", flag: "🇰🇷" },
    { code: "+65", country: "SG", flag: "🇸🇬" },
    { code: "+971", country: "AE", flag: "🇦🇪" },
    { code: "+966", country: "SA", flag: "🇸🇦" },
    { code: "+20", country: "EG", flag: "🇪🇬" },
    { code: "+27", country: "ZA", flag: "🇿🇦" },
    { code: "+234", country: "NG", flag: "🇳🇬" },
  ];

  const selectedCountry = countryCodes.find(
    (c) => c.code === guestInfo.countryCode
  );
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
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

                  {/* Service Type */}
                  {/* <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Service Type</span>
                    <span className="font-medium text-gray-900">
                      {bookingDetails.serviceType}
                    </span>
                  </div> */}

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

              {/* Guest Information Form (hidden if logged in) */}
              {!isLoggedIn && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Guest
                  </h2>

                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          value={guestInfo.firstName}
                          onChange={(e) =>
                            handleGuestInfoChange("firstName", e.target.value)
                          }
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                          placeholder="Enter your first name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          value={guestInfo.lastName}
                          onChange={(e) =>
                            handleGuestInfoChange("lastName", e.target.value)
                          }
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={guestInfo.email}
                        onChange={(e) =>
                          handleGuestInfoChange("email", e.target.value)
                        }
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                        placeholder="Enter your email address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="flex">
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setIsCountryDropdownOpen(!isCountryDropdownOpen)
                            }
                            className="flex items-center justify-between px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors bg-white hover:bg-gray-50 min-w-[130px]"
                          >
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">
                                {selectedCountry?.flag}
                              </span>
                              <span className="text-sm font-medium">
                                {selectedCountry?.code}
                              </span>
                            </div>
                            <ChevronDown
                              className={`w-4 h-4 text-gray-400 transition-transform ${
                                isCountryDropdownOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {isCountryDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                              {countryCodes.map((country) => (
                                <button
                                  key={country.code}
                                  type="button"
                                  onClick={() =>
                                    handleCountrySelect(country.code)
                                  }
                                  className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                                >
                                  <span className="text-lg">
                                    {country.flag}
                                  </span>
                                  <span className="text-sm font-medium">
                                    {country.code}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {country.country}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <input
                          type="tel"
                          value={guestInfo.phone}
                          onChange={(e) =>
                            handleGuestInfoChange("phone", e.target.value)
                          }
                          required
                          className="flex-1 px-4 py-3 border border-l-0 border-gray-300 rounded-r-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country *
                      </label>
                      <input
                        type="text"
                        value={guestInfo.country}
                        onChange={(e) =>
                          handleGuestInfoChange("country", e.target.value)
                        }
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                        placeholder="Enter your country"
                      />
                    </div>
                  </form>
                </div>
              )}
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

                  <div className="flex justify-between">
                    <span className="text-gray-600">VAT (5%)</span>
                    <span className="text-gray-900">{taxes}</span>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">
                        Total
                      </span>
                      <span className="text-lg font-semibold text-gray-900">
                        {finalTotal}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Proceed to Booking Button (visible only if logged in) */}
                {isLoggedIn && (
                  <button
                    onClick={handleProceedToPayment}
                    disabled={isProcessing || isCreating}
                    className="w-full mt-6 bg-[#0064D2] cursor-pointer text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center"
                  >
                    {isProcessing || isCreating ? (
                      "Processing..."
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Proceed to Booking
                      </>
                    )}
                  </button>
                )}

                {/* Payment Modal */}
                <Modal
                 
                  open={isPaymentModalOpen}
                  onOk={async () => {
                    if (!createdBooking?.id) {
                      message.error("No booking ID found to process payment");
                      return;
                    }
                    
                    setIsProcessingPayment(true);
                    
                    try {
                      if (shouldUsePaystack) {
                        // Process Paystack payment
                        const res = await createPaystackSession(createdBooking.id).unwrap();
                        const url = res?.data?.checkoutUrl || 
                                  res?.data?.url || 
                                  res?.data?.authorization_url || 
                                  res?.url;
                        
                        if (url) {
                          window.location.href = url; // Use location.href for full page redirect
                        } else {
                          throw new Error("Payment URL not received from Paystack");
                        }
                      } else {
                        // Process Stripe payment
                        const res = await createStripeSession(createdBooking.id).unwrap();
                        const url = res?.data?.checkoutUrl || 
                                  res?.data?.url || 
                                  res?.url;
                        
                        if (url) {
                          window.location.href = url; // Use location.href for full page redirect
                        } else {
                          throw new Error("Payment URL not received from Stripe");
                        }
                      }
                    } catch (error) {
                      console.error("Payment error:", error);
                      message.error(error?.message || "Failed to process payment");
                      setIsPaymentModalOpen(false);
                    } finally {
                      setIsProcessingPayment(false);
                    }
                  }}
                  onCancel={() => !isProcessingPayment && setIsPaymentModalOpen(false)}
                  okButtonProps={{ loading: isProcessingPayment }}
                  okText={shouldUsePaystack ? "Pay with Paystack" : "Pay with Stripe"}
                  cancelText="Cancel"
                  confirmLoading={isProcessingPayment}
                  closable={!isProcessingPayment}
                  centered
                >
                  <div className="space-y-4 p-4">
                    <div className="text-lg font-semibold text-gray-900">
                      Ready to pay?
                    </div>
                    <div className="text-gray-600 mb-4">
                      You will be redirected to {shouldUsePaystack ? 'Paystack' : 'Stripe'} to complete your payment.
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="stripe"
                          name="paymentMethod"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          checked={!shouldUsePaystack}
                          onChange={() => setShouldUsePaystack(false)}
                        />
                        <label htmlFor="stripe" className="ml-2 block text-sm font-medium text-gray-700">
                          Pay with Stripe (International Cards)
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="paystack"
                          name="paymentMethod"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          checked={shouldUsePaystack}
                          onChange={() => setShouldUsePaystack(true)}
                        />
                        <label htmlFor="paystack" className="ml-2 block text-sm font-medium text-gray-700">
                          Pay with Paystack (African Cards)
                        </label>
                      </div>
                    </div>
                  </div>
                </Modal>
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

      {/* Unauthorized Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowAuthModal(false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  You are not authorized
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Please log in to continue with your booking. Your current
                  selection will be preserved after login.
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowAuthModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Not now
              </button>
              <button
                onClick={handleLoginRedirect}
                className="px-4 py-2 rounded-lg bg-[#0064D2] text-white hover:bg-[#0052ad]"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
