import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Country } from "country-state-city";

// Get all countries and format them for our use
const getFormattedCountries = () => {
  return Country.getAllCountries().map((country) => ({
    name: country.name,
    isoCode: country.isoCode,
    code: `+${country.phonecode}`,
    flag: country.flag || getFlagEmoji(country.isoCode),
    phonecode: country.phonecode,
  }));
};

// Helper function to get flag emoji from country code
const getFlagEmoji = (isoCode) => {
  const codePoints = isoCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
};

export default function GuestLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state?.bookingData;
  const returnUrl = location.state?.returnUrl || "/hotel/checkout";

  const countries = useMemo(() => getFormattedCountries(), []);
  const [guestInfo, setGuestInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
  });
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(
    // Default to Bangladesh or first country in list
    countries.find((c) => c.isoCode === "BD") || countries[0]
  );

  const handleGuestInfoChange = (field, value) => {
    setGuestInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCountrySelect = (code) => {
    const country = countries.find((c) => c.code === code);
    setSelectedCountry(country);
    if (country) {
      handleGuestInfoChange("country", country.name);
    }
    setIsCountryDropdownOpen(false);
  };

  const handleGuestLoginThenProceed = async () => {
    if (!guestInfo.fullName || !guestInfo.email || !guestInfo.phone) {
      alert("Please fill in all required fields");
      return;
    }

    setIsLoginLoading(true);
    try {
      // Store guest info in localStorage
      localStorage.setItem(
        "guestInfo",
        JSON.stringify({
          ...guestInfo,
          countryCode: selectedCountry.code,
        })
      );

      // Prepare updated booking data with guest user information
      const updatedBookingData = {
        ...bookingData,
        user: {
          fullName: guestInfo.fullName,
          email: guestInfo.email,
          phone: guestInfo.phone,
          country: guestInfo.country,
          countryCode: selectedCountry.code,
          isGuest: true,
        },
      };

      // Navigate to the return URL with the updated booking data
      navigate(returnUrl, {
        state: {
          bookingData: updatedBookingData,
        },
      });
    } catch (error) {
      console.error("Error during guest login:", error);
      alert("There was an error processing your request. Please try again.");
    } finally {
      setIsLoginLoading(false);
    }
  };
  return (
    <div>
      <div className="min-h-screen items-center flex justify-between bg-gray-50 py-8">
        <div className="container mx-auto px-4 lg:max-w-[500px]">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Guest</h2>

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
                        <span className="text-lg">{selectedCountry?.flag}</span>
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
                        {countries.map((country) => (
                          <button
                            key={country.isoCode}
                            type="button"
                            onClick={() => handleCountrySelect(country.code)}
                            className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                          >
                            <span className="text-lg">{country.flag}</span>
                            <span className="text-sm font-medium">
                              {country.code}
                            </span>
                            <span className="text-sm text-gray-500">
                              {country.name}
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
                  value={guestInfo.country}
                  onChange={(e) => {
                    const selectedCountryData = countries.find(
                      (c) => c.name === e.target.value
                    );
                    handleGuestInfoChange("country", e.target.value);
                    if (selectedCountryData) {
                      setSelectedCountry(selectedCountryData);
                    }
                  }}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                >
                  <option value="">Select your country</option>
                  {countries.map((country) => (
                    <option key={country.isoCode} value={country.name}>
                      {country.flag} {country.name}
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
                  {isLoginLoading ? "Logging in..." : "Login & Continue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
