import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Calendar,
  Car,
  CreditCard,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  useLoginWebsiteMutation,
  useCreateCarBookingMutation,
  useCreateCarPaystackSessionMutation,
  useCreateCarStripeSessionMutation,
} from "../../redux/api/car/carApi";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Modal, message } from "antd";

export default function CarCheckout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.auth?.user);
  const [isProcessing, setIsProcessing] = useState(false);
  const [guestInfo, setGuestInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    countryCode: "+1",
    street: "",
    city: "",
    postcode: "",
    country: "",
    password: "",
  });

  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [loginWebsite, { isLoading: isLoginLoading }] =
    useLoginWebsiteMutation();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [createCarBooking, { isLoading: isCreatingBooking }] =
    useCreateCarBookingMutation();
  const [createdBookingId, setCreatedBookingId] = useState(null);
  const [createCarPaystackSession, { isLoading: isCreatingPayment }] =
    useCreateCarPaystackSessionMutation();
  const [createCarStripeSession, { isLoading: isCreatingStripe }] =
    useCreateCarStripeSessionMutation();
  const [serverTotal, setServerTotal] = useState(null);

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

  // Get booking details from navigation state
  const bookingDetails = location.state?.bookingDetails;

  console.log(bookingDetails);

  // Calculate additional details
  const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
  const msPerDay = 1000 * 60 * 60 * 24;
  const days = Math.max(
    1,
    Math.floor(
      (new Date(bookingDetails.returnDate) -
        new Date(bookingDetails.pickupDate)) /
        msPerDay
    )
  );
  const carPrice = round2(bookingDetails.total / days);
  const taxes = round2(bookingDetails.total * 0.05);
  const finalTotal = round2(bookingDetails.total + taxes);

  // Prefer server totals (after booking create) if available
  const displayFinalTotal = serverTotal ?? finalTotal;
  const displayVat = serverTotal
    ? round2(displayFinalTotal - round2(displayFinalTotal / 1.05))
    : taxes;
  const displaySubtotal = serverTotal
    ? round2(displayFinalTotal / 1.05)
    : bookingDetails.total;
  const displayUnit = round2(displaySubtotal / days);

  // Determine if Paystack should be used (Africa) else Stripe
  const africanPrefix = "+2"; // Most African countries start with +2
  const userCountry = user?.country || "";
  const phoneCode = guestInfo?.countryCode || "";
  const isAfricaByPhone =
    typeof phoneCode === "string" && phoneCode.startsWith(africanPrefix);
  const isAfricaByCountry =
    typeof userCountry === "string" &&
    /\b(Algeria|Angola|Benin|Botswana|Burkina|Burundi|Cameroon|Cape Verde|Central African Republic|Chad|Comoros|Congo|DRC|Cote d'Ivoire|Ivory Coast|Djibouti|Egypt|Equatorial Guinea|Eritrea|Eswatini|Ethiopia|Gabon|Gambia|Ghana|Guinea|Guinea-Bissau|Kenya|Lesotho|Liberia|Libya|Madagascar|Malawi|Mali|Mauritania|Mauritius|Morocco|Mozambique|Namibia|Niger|Nigeria|Rwanda|Sao Tome|Senegal|Seychelles|Sierra Leone|Somalia|South Africa|South Sudan|Sudan|Tanzania|Togo|Tunisia|Uganda|Zambia|Zimbabwe)\b/i.test(
      userCountry
    );
  const shouldUsePaystack = isAfricaByCountry || isAfricaByPhone;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  const selectedCountry = countryCodes.find(
    (c) => c.code === guestInfo.countryCode
  );

  const handleProceedToPayment = () => {
    setIsProcessing(true);

  

    setIsProcessing(false);
  };

  const handleProceedClick = async () => {
    if (!user) return;
    setIsProcessing(true);
    try {
      const carId = bookingDetails?.carId;
      if (carId && bookingDetails?.pickupDate && bookingDetails?.returnDate) {
        const res = await createCarBooking({
          carId,
          data: {
            carBookedFromDate: bookingDetails.pickupDate,
            carBookedToDate: bookingDetails.returnDate,
            vat: taxes,
            totalPrice: finalTotal,
            days,
            unitPrice: displayUnit,
            // promo_code: 'CAR28',
          },
        }).unwrap();
        const created = res?.data || res;
        if (created?.id) setCreatedBookingId(created.id);
        if (typeof created?.totalPrice === "number")
          setServerTotal(round2(created.totalPrice));
      }
      setIsConfirmOpen(true);
    } catch (e) {
      const msg = e?.data?.message || e?.message || "Failed to create booking";
      try {
        message.error(msg);
      } catch {}
      setIsConfirmOpen(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToBooking = () => {
    navigate(-1);
  };

  const handleGuestLoginThenProceed = async () => {
    if (
      !guestInfo.fullName ||
      !guestInfo.email ||
      !guestInfo.password ||
      !guestInfo.phone ||
      !guestInfo.country
    ) {
      return;
    }
    try {
      const res = await loginWebsite({
        fullName: guestInfo.fullName,
        email: guestInfo.email,
        password: guestInfo.password,
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={handleBackToBooking}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Car Details
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Car Rental Checkout
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
                  <Car className="w-6 h-6 text-blue-600 mr-3" />
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

                  {/* Car Description */}
                  <div className="py-3 border-b border-gray-100">
                    <span className="text-gray-600 block mb-2">
                      Vehicle Description
                    </span>
                    <span className="text-gray-900">
                      {bookingDetails.carDescription}
                    </span>
                  </div>

                  {/* Dates */}
                  <div className="py-3 border-b border-gray-100">
                    <div className="flex items-center mb-3">
                      <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-gray-600">Rental Period</span>
                    </div>
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

              {/* Guest Information Form (only for not logged-in users) */}
              {!user && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Guest
                  </h2>

                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={guestInfo.fullName}
                          onChange={(e) =>
                            handleGuestInfoChange("fullName", e.target.value)
                          }
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                          placeholder="Enter your first name"
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
                        Password *
                      </label>
                      <input
                        type="password"
                        value={guestInfo.password}
                        onChange={(e) =>
                          handleGuestInfoChange("password", e.target.value)
                        }
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                        placeholder="Enter your password"
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
                              className={`w-4 h-4 text-gray-400 transition-transform {
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
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleGuestLoginThenProceed}
                        disabled={isLoginLoading}
                        className={`w-full bg-gray-800 text-white py-3 px-6 rounded-lg font-medium transition-colors {
                          isLoginLoading
                            ? "opacity-70 cursor-not-allowed"
                            : "hover:bg-gray-900"
                        }`}
                      >
                        {isLoginLoading ? "Logging in..." : "Login & Continue"}
                      </button>
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
                      {carPrice} × {days} {days === 1 ? "day" : "days"}
                    </span>
                    <span className="text-gray-900">
                      {bookingDetails.total}
                    </span>
                  </div>

                  {/* <div className="flex justify-between">
                    <span className="text-gray-600">Service fee</span>
                    <span className="text-gray-900">${serviceFee}</span>
                  </div> */}

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
                        {displayFinalTotal}/=
                      </span>
                    </div>
                  </div>
                </div>

                {/* Proceed to Payment Button */}
                <button
                  onClick={handleProceedClick}
                  disabled={isProcessing || !user}
                  className={`w-full mt-6 bg-[#0064D2] text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center {
                    isProcessing || !user ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isProcessing ? (
                    "Processing..."
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Proceed to Checkout
                    </>
                  )}
                </button>

                <Modal
                  open={isConfirmOpen}
                  onOk={async () => {
                    if (!createdBookingId) {
                      try {
                        message.error("No booking id to pay for");
                      } catch {}
                      return;
                    }
                    try {
                      if (shouldUsePaystack) {
                        const res = await createCarPaystackSession(
                          createdBookingId
                        ).unwrap();
                        const url =
                          res?.data?.checkoutUrl ||
                          res?.data?.url ||
                          res?.data?.authorization_url ||
                          res?.url;
                        const ref = res?.data?.reference;
                        try {
                          console.log("Paystack URL:", url);
                          if (ref) console.log("Paystack Reference:", ref);
                        } catch {}
                        if (url) {
                          window.open(url, "_blank");
                        } else {
                          try {
                            message.error("Payment URL not received");
                          } catch {}
                        }
                      } else {
                        const res = await createCarStripeSession(
                          createdBookingId
                        ).unwrap();
                        const url =
                          res?.data?.checkoutUrl || res?.data?.url || res?.url;
                        const ref =
                          res?.data?.reference ||
                          res?.data?.id ||
                          res?.data?.checkoutSessionId;
                        try {
                          console.log("Stripe URL:", url);
                          if (ref) console.log("Stripe Reference:", ref);
                        } catch {}
                        if (url) {
                          window.location.assign(url);
                          console.log("Checkout Session ID:", ref);
                        } else {
                          try {
                            message.error("Payment URL not received");
                          } catch {}
                        }
                      }
                    } catch (e) {
                      const msg =
                        e?.data?.message ||
                        e?.message ||
                        "Failed to start payment";
                      try {
                        message.error(msg);
                      } catch {}
                    } finally {
                      setIsConfirmOpen(false);
                    }
                  }}
                  onCancel={() => setIsConfirmOpen(false)}
                  okText={
                    shouldUsePaystack ? "Pay with Paystack" : "Pay with Stripe"
                  }
                  cancelText="Later"
                  centered
                >
                  <div className="space-y-2">
                    <div className="text-lg font-semibold text-gray-900">
                      Ready to pay?
                    </div>
                    <div className="text-gray-600">
                      Choose Pay Now to continue to payment, or Later to stay on
                      this page.
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
