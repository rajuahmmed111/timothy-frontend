import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Users,
  MapPin,
  ChevronDown,
  CreditCard,
} from "lucide-react";
import { useGuestLoginMutation } from "../../redux/api/hotel/hotelApi";
import { useCreateHotelBookingMutation } from "../../redux/api/hotel/hotelApi";
import { useCreateHotelPaystackCheckoutSessionMutation } from "../../redux/api/hotel/hotelApi";
import { useCreateHotelStripeCheckoutSessionWebsiteMutation } from "../../redux/api/hotel/hotelApi";

import { setCredentials } from "../../redux/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Modal, message } from "antd";
import { toast } from "react-toastify";

export default function Checkout() {
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
    
  });

  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [loginWebsite, { isLoading: isLoginLoading }] = useGuestLoginMutation();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [createHotelBooking, { isLoading: isCreatingBooking }] =
    useCreateHotelBookingMutation();
  const [createdBookingId, setCreatedBookingId] = useState(null);
  const [createHotelPaystackSession, { isLoading: isCreatingPayment }] =
    useCreateHotelPaystackCheckoutSessionMutation();
  const [createHotelStripeSession, { isLoading: isCreatingStripe }] =
    useCreateHotelStripeCheckoutSessionWebsiteMutation();
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

  const bookingData = location.state?.bookingData;

  const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
  const msPerDay = 1000 * 60 * 60 * 24;
  const days = Math.max(
    1,
    Math.floor(
      (new Date(bookingData.checkOut) - new Date(bookingData.checkIn)) /
        msPerDay
    )
  );

  const safeGuests = bookingData?.guests || {
    adults: 1,
    children: 0,
    rooms: 1,
  };
  const hotelPrice = round2(bookingData.total / days);
  const taxes = round2(bookingData.total * 0.05);
  const finalTotal = round2(bookingData.total + taxes);
  const displayFinalTotal = serverTotal ?? finalTotal;
  const displayVat = serverTotal
    ? round2(displayFinalTotal - round2(displayFinalTotal / 1.05))
    : taxes;
  const displaySubtotal = serverTotal
    ? round2(displayFinalTotal / 1.05)
    : bookingData.total;
  const displayUnit = round2(displaySubtotal / days);

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
      const roomId = bookingData?.roomId;
      const toYMD = (d) => new Date(d).toISOString().slice(0, 10);

      if (!roomId) {
        message.error("Room not selected.");
        return;
      }

      const res = await createHotelBooking({
        bookingId: roomId,
        data: {
          rooms: Number(bookingData?.rooms ?? 1),
          adults: Number(bookingData?.adults ?? 1),
          children: Number(bookingData?.children ?? 0),
          bookedFromDate: toYMD(
            bookingData?.bookedFromDate || bookingData?.checkIn
          ),
          bookedToDate: toYMD(
            bookingData?.bookedToDate || bookingData?.checkOut
          ),
        },
      }).unwrap();

      const created = res?.data || res;
      if (created?.id) {
        setCreatedBookingId(created.id);
      }
      if (typeof created?.totalPrice === "number") {
        setServerTotal(round2(created.totalPrice));
      }
      setIsConfirmOpen(true);

      
    } catch (e) {
      const msg = e?.data?.message || e?.message || "Failed to create booking";
      const lc = typeof msg === "string" ? msg.toLowerCase() : "";
      if (lc.includes("already booked") || lc.includes("already booked for the selected dates")) {
        toast.error("This hotel is already booked for the selected dates");
      } else {
        message.error(msg);
      }
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
      !guestInfo.phone ||
      !guestInfo.country
    ) {
      return;
    }
    try {
      const contactNumber = `${guestInfo.countryCode || ""}${guestInfo.phone}`;
      const res = await loginWebsite({
        fullName: guestInfo.fullName,
        email: guestInfo.email,
        contactNumber,
        country: guestInfo.country,
        role: "USER",
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
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="max-w-6xl mx-auto px-4">
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

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {bookingData.hotelName}
                    </h3>
                    <p className="text-gray-600">{bookingData.location}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-gray-900">
                      {formatDate(bookingData.bookedFromDate)} -{" "}
                      {formatDate(bookingData.bookedToDate)}
                    </p>
                    <p className="text-gray-600">{bookingData.nights} nights</p>
                  </div>
                </div>

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

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">
                      {bookingData.roomType}
                    </span>
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
                    ${bookingData.roomPrice} × {bookingData.nights} nights
                  </span>
                  <span>${bookingData.subtotal}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>VAT</span>
                  <span>${Math.round(bookingData.subtotal * 0.12)}</span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${bookingData.total}</span>
                  </div>
                </div>
              </div>

              {/* <button
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
              </button> */}

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
                      const res = await createHotelPaystackSession({
                        bookingId: createdBookingId,
                        body: {},
                      }).unwrap();
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
                      const res = await createHotelStripeSession({
                        bookingId: createdBookingId,
                        body: {},
                      }).unwrap();
                      const url = res?.data?.checkoutUrl || res?.url;
                      const ref = res?.data?.checkoutSessionId || res?.data?.id;
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
        <div className="mt-5">
          {" "}
          {/* Guest Information Form */}
          {!user && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Guest
              </h2>

              <form className="space-y-6">
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
                              onClick={() => handleCountrySelect(country.code)}
                              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                            >
                              <span className="text-lg">{country.flag}</span>
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
                    {isLoginLoading ? "Logging in..." : "Continue"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
