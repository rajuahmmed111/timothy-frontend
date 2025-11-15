import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import { Country } from "country-state-city";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { useGuestLoginMutation } from "../../redux/api/hotel/hotelApi";

// Using country-state-city package for countries and phone codes

export default function GuestLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingDetails = location.state?.bookingDetails;
  const returnUrl = location.state?.returnUrl || "/event/checkout";
  const { token } = useSelector((state) => state.auth);
  console.log("guest login", bookingDetails);
  useEffect(() => {
    // If user is already logged in (has token), redirect to checkout
    if (token) {
      navigate(returnUrl, {
        state: {
          bookingDetails,
          userType: "registered",
        },
      });
    }
  }, [token, navigate, returnUrl, bookingDetails]);

  const [guestInfo, setGuestInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
  });
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const countries = Country.getAllCountries();
  const [selectedCountry, setSelectedCountry] = useState(
    countries && countries.length > 0 ? countries[0] : null
  );
  const dispatch = useDispatch();
  const [loginWebsite] = useGuestLoginMutation();

  const handleGuestInfoChange = (field, value) => {
    setGuestInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const isoToFlag = (isoCode) => {
    if (!isoCode) return "";
    try {
      const codePoints = isoCode
        .toUpperCase()
        .split("")
        .map((char) => 127397 + char.charCodeAt(0));
      return String.fromCodePoint(...codePoints);
    } catch {
      return "";
    }
  };

  const handleCountrySelect = (isoCode) => {
    const country = countries.find((c) => c.isoCode === isoCode);
    if (country) {
      setSelectedCountry(country);
      setGuestInfo((prev) => ({ ...prev, country: country.name }));
    }
    setIsCountryDropdownOpen(false);
  };

  const handleGuestLoginThenProceed = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoginLoading(true);
    if (!guestInfo.fullName || !guestInfo.email || !guestInfo.phone) {
      alert("Please fill in all required fields");
      return;
    }

    setIsLoginLoading(true);
    try {
      const contactNumber = `${
        selectedCountry?.phonecode ? `+${selectedCountry.phonecode}` : ""
      }${guestInfo.phone}`;
      const payload = {
        fullName: guestInfo.fullName,
        email: guestInfo.email,
        contactNumber,
        country: guestInfo.country,
        role: "USER",
      };

      const res = await loginWebsite(payload).unwrap();
      const accessToken = res?.data?.accessToken || res?.accessToken;
      const authUser = res?.data?.user || res?.user;

      if (accessToken) {
        try {
          localStorage.setItem("accessToken", accessToken);
        } catch {}
        dispatch(setCredentials({ accessToken, user: authUser }));
      }

      // Create updated booking data with user information
      const updatedBookingDetails = {
        ...bookingDetails,
        user: {
          _id: authUser?._id || "guest",
          name: guestInfo.fullName,
          email: guestInfo.email,
          phone: contactNumber,
          country: guestInfo.country,
        },
      };

      // Store guest info in localStorage
      localStorage.setItem(
        "guestInfo",
        JSON.stringify({
          ...guestInfo,
          countryCode: selectedCountry?.phonecode
            ? `+${selectedCountry.phonecode}`
            : "",
        })
      );

      // Navigate to the return URL with the updated booking details
      navigate(returnUrl, {
        state: {
          bookingDetails: updatedBookingDetails,
          guestInfo: {
            ...guestInfo,
            countryCode: selectedCountry?.phonecode
              ? `+${selectedCountry.phonecode}`
              : "",
          },
          userType: authUser?._id ? "registered" : "guest",
        },
      });
    } catch (error) {
      console.error("Error during guest login:", error);
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "An error occurred during login";
      setError(errorMessage);
    } finally {
      setIsLoginLoading(false);
    }
  };

  return (
    <div>
      <div className="min-h-screen items-center flex justify-between bg-gray-50 py-8">
        <div className="container mx-auto px-4 lg:max-w-[800px]">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Personal Information
            </h2>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

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
                      className="flex items-center justify-between px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors bg-white hover:bg-gray-50 min-w-[160px]"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">
                          {isoToFlag(selectedCountry?.isoCode)}
                        </span>
                        <span className="text-sm font-medium">
                          {selectedCountry?.phonecode
                            ? `+${selectedCountry.phonecode}`
                            : ""}
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
                        {countries.map((country) => (
                          <button
                            key={country.isoCode}
                            type="button"
                            onClick={() => handleCountrySelect(country.isoCode)}
                            className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                          >
                            <span className="text-lg">
                              {isoToFlag(country.isoCode)}
                            </span>
                            <span className="text-sm font-medium">
                              {country.phonecode ? `+${country.phonecode}` : ""}
                            </span>
                            <span className="text-sm text-gray-500">
                              {country.flag}
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
                <select
                  value={selectedCountry?.isoCode || ""}
                  onChange={(e) => handleCountrySelect(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors bg-white"
                >
                  {countries.map((c) => (
                    <option key={c.isoCode} value={c.isoCode}>
                      {c.name}
                    </option>
                  ))}
                </select>
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
        </div>
      </div>
    </div>
  );
}
