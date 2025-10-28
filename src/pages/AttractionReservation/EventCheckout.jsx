import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginWebsiteMutation } from "../../redux/services/authApi";
import { setCredentials } from "../../redux/features/auth/authSlice";
import {
  useCreateAttractionBookingMutation,
  useCreatePaystackCheckoutSessionMutation,
  useCreateStripeCheckoutSessionWebsiteMutation,
} from "../../redux/api/attraction/attractionApi";
import { useCreateSecurityStripeCheckoutSessionMutation } from "../../redux/api/security/securityBookingApi";
import {
  Calendar,
  MapPin,
  Star,
  Users,
  CreditCard,
  ArrowLeft,
  Clock,
  ChevronDown,
} from "lucide-react";

export default function EventCheckout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = useSelector((s) => s?.auth?.accessToken);
  const authUser = useSelector((s) => s?.auth?.user);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [bookingCreated, setBookingCreated] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState(null);
  const [serverTotal, setServerTotal] = useState(null);
  const [geoCountry, setGeoCountry] = useState("");
  const [geoCallingCode, setGeoCallingCode] = useState("");
  const [shouldUsePaystackState, setShouldUsePaystackState] = useState(null);
  const [loginWebsite, { isLoading: isLoginLoading, error: loginError }] =
    useLoginWebsiteMutation();
  const [createAttractionBooking] = useCreateAttractionBookingMutation();
  const [createPaystackCheckoutSession, { isLoading: isPaystackLoading }] =
    useCreatePaystackCheckoutSessionMutation();
  const [createStripeCheckoutSessionWebsite, { isLoading: isStripeLoading }] =
    useCreateStripeCheckoutSessionWebsiteMutation();
  const [createSecurityStripeCheckoutSession] =
    useCreateSecurityStripeCheckoutSessionMutation();
  const [guestInfo, setGuestInfo] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    countryCode: "+1",
    street: "",
    city: "",
    postcode: "",
    country: "",
  });

  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  // Common country codes
  const countryCodes = [
    { code: "+1", country: "US/CA", flag: "" },
    { code: "+44", country: "UK", flag: "" },
    { code: "+91", country: "IN", flag: "" },
    { code: "+86", country: "CN", flag: "" },
    { code: "+81", country: "JP", flag: "" },
    { code: "+49", country: "DE", flag: "" },
    { code: "+33", country: "FR", flag: "" },
    { code: "+39", country: "IT", flag: "" },
    { code: "+34", country: "ES", flag: "" },
    { code: "+61", country: "AU", flag: "" },
    { code: "+55", country: "BR", flag: "" },
    { code: "+52", country: "MX", flag: "" },
    { code: "+7", country: "RU", flag: "" },
    { code: "+82", country: "KR", flag: "" },
    { code: "+65", country: "SG", flag: "" },
    { code: "+971", country: "AE", flag: "" },
    { code: "+966", country: "SA", flag: "" },
    { code: "+20", country: "EG", flag: "" },
    { code: "+27", country: "ZA", flag: "" },
    { code: "+234", country: "NG", flag: "" },
  ];

  // Get booking details from navigation state
  const bookingDetails = location.state?.bookingDetails;

  // Calculate additional details
  const unitPrice = bookingDetails.unitPrice ?? 600;
  const qty = Number.parseInt(bookingDetails.guests || "1");
  const discountPercent = Number.isFinite(
    Number(bookingDetails.discountPercent)
  )
    ? Number(bookingDetails.discountPercent)
    : 0;
  const vatPercent = Number.isFinite(Number(bookingDetails.vatPercent))
    ? Number(bookingDetails.vatPercent)
    : 0;
  const subtotal = unitPrice * qty;
  const discount = Math.round((subtotal * discountPercent) / 100);
  const taxable = Math.max(subtotal - discount, 0);
  const taxes = Math.round((taxable * vatPercent) / 100);
  const finalTotal = taxable + taxes;

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

  const handleGuestLoginThenProceed = async () => {
    try {
      const payload = {
        fullName:
          guestInfo.fullName && guestInfo.fullName.trim() !== ""
            ? guestInfo.fullName.trim()
            : null,
        email: guestInfo.email,
        password: guestInfo.password,
        contactNumber: guestInfo.phone,
        country: guestInfo.country,
        role: "USER",
      };
      const res = await loginWebsite(payload).unwrap();
      const { accessToken: at, refreshToken, user } = res?.data || {};
      dispatch(setCredentials({ accessToken: at, refreshToken, user }));
      // stay on checkout; proceed button becomes enabled after login
    } catch (e) {
      // error is exposed via loginError; optional console for dev
      console.error("Inline login failed", e);
    }
  };

  const handleStripeCheckout = async (bookingId) => {
    try {
      console.log("Creating Stripe checkout session for booking:", bookingId);
      const response = await createSecurityStripeCheckoutSession(
        bookingId
      ).unwrap();
      console.log("Stripe checkout response:", response);

      if (response?.success && response?.data?.checkoutUrl) {
        console.log(
          "Redirecting to Stripe checkout:",
          response.data.checkoutUrl
        );
        // Force a full page reload to ensure clean state for Stripe
        window.location.replace(response.data.checkoutUrl);
      } else {
        const errorMsg = response?.message || "No checkout URL in response";
        console.error("Failed to create Stripe checkout session:", errorMsg);
        alert(
          `Payment error: ${errorMsg}. Please try again or contact support.`
        );
      }
    } catch (error) {
      console.error("Error during Stripe checkout:", error);
      alert(
        `Payment error: ${
          error.message || "Failed to process payment"
        }. Please try again.`
      );
    }
  };

  const handleProceedToPayment = async () => {
    if (isProcessing || bookingCreated) return;
    try {
      setIsProcessing(true);

      const adults = parseInt(bookingDetails.guests || "1");
      const children = Number.isFinite(parseInt(bookingDetails.children))
        ? parseInt(bookingDetails.children)
        : 0;
      // Use today's date and day per requirement
      const now = new Date();
      const sel = bookingDetails.selectedDate;
      const day = sel
        ? new Date(sel)
            .toLocaleDateString("en-US", { weekday: "long" })
            .toUpperCase()
        : now.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();

      // Prefer exact start time captured from slot; keep as-is unless 24:00/24:00:00
      const rawTime = String(bookingDetails.selectedTime || "").trim();
      const startPart = rawTime.includes("-")
        ? rawTime.split("-")[0].trim()
        : rawTime;
      let from = bookingDetails.selectedFrom || startPart || "00:00";
      if (from === "24:00:00") from = "00:00:00";
      else if (from === "24:00") from = "00:00";

      const id = bookingDetails.appealId || authUser?.lastAppealId;

      const body = {
        adults,
        children,
        date: sel,
        day,
        from,
        total: finalTotal,
      };

      const bookingRes = await createAttractionBooking({ id, body }).unwrap();
      const newBookingId =
        bookingRes?.id ||
        bookingRes?.data?.id ||
        bookingRes?.data?._id ||
        bookingRes?._id ||
        null;

      if (newBookingId) {
        setCreatedBookingId(newBookingId);
        // Proceed directly to Stripe checkout
        await handleStripeCheckout(newBookingId);
      }

      const serverPrice = bookingRes?.data?.totalPrice;
      if (typeof serverPrice === "number" && !Number.isNaN(serverPrice)) {
        setServerTotal(serverPrice);
      }

      setBookingCreated(true);
    } catch (e) {
      console.error("Failed to create booking", e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToBooking = () => {
    navigate(-1);
  };

  // Resolve user location via IP-based geolocation when modal opens
  useEffect(() => {
    const fetchGeo = async () => {
      try {
        // Try ipapi.co first, graceful fallback if blocked
        const res = await fetch("https://ipapi.co/json/");
        if (res.ok) {
          const data = await res.json();
          if (data?.country_name) setGeoCountry(String(data.country_name));
          if (data?.country_calling_code)
            setGeoCallingCode(String(data.country_calling_code));
          return;
        }
      } catch {}
      try {
        const res2 = await fetch("https://geolocation-db.com/json/");
        if (res2.ok) {
          const data2 = await res2.json();
          if (data2?.country_name) setGeoCountry(String(data2.country_name));
          // geolocation-db may not include calling code
        }
      } catch {}
    };
    if (isPaymentModalOpen) {
      fetchGeo();
    }
  }, [isPaymentModalOpen]);

  // Decide provider ONCE per modal open to avoid flicker
  useEffect(() => {
    if (!isPaymentModalOpen) return;
    if (shouldUsePaystackState !== null) return;
    const africanPrefix = "+2";
    const phoneCode = guestInfo.countryCode || authUser?.countryCode || "";
    const userCountry = (guestInfo.country || authUser?.country || "").trim();
    const isAfricaByPhone =
      typeof phoneCode === "string" && phoneCode.startsWith(africanPrefix);
    const isAfricaByCountry =
      typeof userCountry === "string" &&
      /\b(Algeria|Angola|Benin|Botswana|Burkina|Burundi|Cameroon|Cape Verde|Central African Republic|Chad|Comoros|Congo|DRC|Cote d'Ivoire|Ivory Coast|Djibouti|Egypt|Equatorial Guinea|Eritrea|Eswatini|Ethiopia|Gabon|Gambia|Ghana|Guinea|Guinea-Bissau|Kenya|Lesotho|Liberia|Libya|Madagascar|Malawi|Mali|Mauritania|Mauritius|Morocco|Mozambique|Namibia|Niger|Nigeria|Rwanda|Sao Tome|Senegal|Seychelles|Sierra Leone|Somalia|South Africa|South Sudan|Sudan|Tanzania|Togo|Tunisia|Uganda|Zambia|Zimbabwe)\b/i.test(
        userCountry
      );
    if (isAfricaByCountry || isAfricaByPhone) {
      setShouldUsePaystackState(true);
      return;
    }

    setShouldUsePaystackState(false);
  }, [
    isPaymentModalOpen,
    shouldUsePaystackState,
    guestInfo.countryCode,
    guestInfo.country,
    authUser?.countryCode,
    authUser?.country,
    geoCountry,
    geoCallingCode,
  ]);

  return (
    <>
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
                Back to Event Details
              </button>
              <h1 className="text-3xl font-bold text-gray-900">
                Event Booking Checkout
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
                    <Star className="w-6 h-6 text-blue-600 mr-3" />
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

                    {/* Event Name */}
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600">Event</span>
                      <span className="font-medium text-gray-900">
                        {bookingDetails.eventName}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600">Location</span>
                      <span className="font-medium text-gray-900">
                        {bookingDetails.location}
                      </span>
                    </div>

                    {/* Date & Time */}
                    <div className="py-3 border-b border-gray-100">
                      <div className="flex items-center mb-3">
                        <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-gray-600">Event Schedule</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">
                            Selected Date
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {formatDate(bookingDetails.selectedDate)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">
                            Event Time
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {bookingDetails.selectedTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Guests */}
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600">Number of Guests</span>
                      <span className="font-medium text-gray-900">
                        {bookingDetails.guests}{" "}
                        {parseInt(bookingDetails.guests) === 1
                          ? "guest"
                          : "guests"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Guest Information Form */}
                {!accessToken && (
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
                            placeholder="Enter your full name"
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
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={handleGuestLoginThenProceed}
                          disabled={isLoginLoading}
                          className={`w-full bg-gray-800 text-white py-3 px-6 rounded-lg font-medium transition-colors ${
                            isLoginLoading
                              ? "opacity-70 cursor-not-allowed"
                              : "hover:bg-gray-900"
                          }`}
                        >
                          {isLoginLoading
                            ? "Logging in..."
                            : "Login & Continue"}
                        </button>
                        {loginError ? (
                          <p className="text-red-500 text-sm mt-2">
                            {loginError?.data?.message || "Login failed"}
                          </p>
                        ) : null}
                      </div>
                    </form>
                  </div>
                )}

                {/* Event Information */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Event Information
                  </h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <p>
                      <strong>Duration:</strong> Approximately 1-2 hours
                    </p>
                    <p>
                      <strong>Meeting Point:</strong> Burj Khalifa Main Entrance
                    </p>
                    <p>
                      <strong>What to Bring:</strong> Valid ID required for
                      entry
                    </p>
                    <p>
                      <strong>Cancellation:</strong> Free cancellation up to 24
                      hours before the event
                    </p>
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
                        {unitPrice} × {bookingDetails.guests}{" "}
                        {parseInt(bookingDetails.guests) === 1
                          ? "guest"
                          : "guests"}
                      </span>
                      <span className="text-gray-900">
                        {unitPrice * parseInt(bookingDetails.guests)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">VAT ({5}%)</span>
                      <span className="text-gray-900">{taxes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Discount.......... ({-discountPercent}%)
                      </span>
                      <span className="text-gray-900">{discount}</span>
                    </div>

                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-gray-900">
                          Total (Incl. VAT)
                        </span>
                        <span className="text-lg font-semibold text-gray-900">
                          {finalTotal}/=
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Proceed to Payment Button */}
                  <button
                    onClick={handleProceedToPayment}
                    disabled={isProcessing || !accessToken || bookingCreated}
                    className={`w-full mt-6 bg-[#0064D2] text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center ${
                      isProcessing || !accessToken || bookingCreated
                        ? "opacity-60 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {isProcessing ? (
                      "Processing..."
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        {bookingCreated
                          ? "Booking Created"
                          : "Proceed to Booking"}
                      </>
                    )}
                  </button>
                  {!accessToken && (
                    <p className="text-sm text-gray-600 mt-2">
                      Please log in to continue to checkout.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h4 className="text-lg font-semibold mb-2">Booking Created</h4>
            <p className="text-sm text-gray-600 mb-6">
              Choose how you want to proceed.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Pay Later
              </button>
              {(() => {
                const paymentProvider =
                  shouldUsePaystackState === null
                    ? null
                    : shouldUsePaystackState
                    ? "paystack"
                    : "stripe";
                const label =
                  shouldUsePaystackState === null
                    ? "Loading..."
                    : shouldUsePaystackState
                    ? isPaystackLoading
                      ? "Initializing..."
                      : "Pay with Paystack"
                    : isStripeLoading
                    ? "Initializing..."
                    : "Pay with Stripe";
                const onClick = async () => {
                  if (shouldUsePaystackState) {
                    try {
                      const bookingId = createdBookingId;
                      const body = {
                        amount: serverTotal ?? finalTotal,
                        email: authUser?.email || guestInfo.email,
                      };
                      const res = await createPaystackCheckoutSession({
                        bookingId,
                        body,
                      }).unwrap();
                      const url = res?.data?.checkoutUrl;
                      if (url) {
                        window.location.assign(url);
                      }
                    } catch (e) {
                      console.error("Failed to init Paystack session", e);
                    }
                  } else {
                    try {
                      const bookingId = createdBookingId;
                      const body = {
                        amount: serverTotal ?? finalTotal,
                        email: authUser?.email || guestInfo.email,
                      };
                      const res = await createStripeCheckoutSessionWebsite({
                        bookingId,
                        body,
                      }).unwrap();
                      const url = res?.data?.checkoutUrl;
                      if (url) {
                        window.location.assign(url);
                      }
                    } catch (e) {
                      console.error("Failed to init Stripe session", e);
                    }
                  }
                };
                return (
                  <button
                    onClick={onClick}
                    disabled={
                      shouldUsePaystackState === null ||
                      isPaystackLoading ||
                      isStripeLoading ||
                      !createdBookingId
                    }
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    {label}
                  </button>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
