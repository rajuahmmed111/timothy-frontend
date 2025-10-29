import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Users,
  MapPin,
  Star,
  ChevronDown,
} from "lucide-react";
import { useGuestLoginMutation } from "../../redux/api/hotel/hotelApi";
import { useSelector } from "react-redux";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingData } = location.state || {};
  const { user } = useSelector((state) => state.auth) || {};
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

  const [loginWebsite, { isLoading: isLoginLoading }] = useGuestLoginMutation();
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isCountrySelectOpen, setIsCountrySelectOpen] = useState(false);

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

  // Comprehensive list of countries

  if (!bookingData) {
    navigate("/");
    return null;
  }
  console.log("bookingData", bookingData);

  const safeGuests = bookingData.guests || { adults: 1, children: 0, rooms: 1 };

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

  const handleCountryChange = (country) => {
    handleGuestInfoChange("country", country);
    setIsCountrySelectOpen(false);
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

  const selectedCountry = countryCodes.find(
    (c) => c.code === guestInfo.countryCode
  );

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
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-4 md:mb-6">
          <button
            onClick={() => navigate(-1)}
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
                      {formatDate(bookingData.checkIn)} -{" "}
                      {formatDate(bookingData.checkOut)}
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

            {/* Guest Information Form */}
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
                      {isLoginLoading ? "Logging in..." : "Login & Continue"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Sidebar - Price Summary */}
          <div className="lg:col-span-1">
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

              <Link to="/hotel/payment">
                <button
                  type="submit"
                  // onClick={handleSubmit}
                  disabled={isProcessing}
                  className={`w-full mt-4 md:mt-6 px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-colors ${
                    isProcessing
                      ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                      : "bg-[#0064D2] text-white hover:bg-[#0052A3]"
                  }`}
                >
                  {isProcessing ? "Processing..." : "Continue to Booking"}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
