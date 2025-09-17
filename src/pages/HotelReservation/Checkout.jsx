import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Users, MapPin, Star, ChevronDown } from "lucide-react";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingData } = location.state || {};

  const [guestInfo, setGuestInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "+1",
    country: "",
    street: "",
    city: "",
    postcode: "",
    zipCode: "",
  });

  const [isProcessing] = useState(false);
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
  const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
    "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
    "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
    "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
    "Croatia", "Cuba", "Cyprus", "Czech Republic", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador",
    "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
    "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
    "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
    "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
    "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
    "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
    "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal",
    "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan",
    "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
    "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia",
    "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
    "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan",
    "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
    "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
    "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
  ];

  if (!bookingData) {
    navigate("/");
    return null;
  }

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

  

  const selectedCountry = countryCodes.find(c => c.code === guestInfo.countryCode);

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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 ml-2 md:ml-4">Checkout</h1>
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
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">
                Guest Information
              </h2>

              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg transition-colors text-sm md:text-base"
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
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg transition-colors text-sm md:text-base"
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
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg transition-colors text-sm md:text-base"
                    placeholder="Enter your email address"
                  />
                </div>

                

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                        className="flex items-center justify-between w-full sm:w-auto px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg sm:rounded-l-lg sm:rounded-r-none transition-colors bg-white min-w-[110px] md:min-w-[130px]"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-base md:text-lg">{selectedCountry?.flag}</span>
                          <span className="text-sm md:text-base font-medium">{selectedCountry?.code}</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {isCountryDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto w-full sm:min-w-[200px]">
                          {countryCodes.map((country) => (
                            <button
                              key={country.code}
                              type="button"
                              onClick={() => handleCountrySelect(country.code)}
                              className="w-full flex items-center space-x-3 px-3 md:px-4 py-2.5 md:py-3 hover:bg-gray-50 transition-colors text-left"
                            >
                              <span className="text-base md:text-lg">{country.flag}</span>
                              <span className="text-sm md:text-base font-medium">{country.code}</span>
                              <span className="text-xs md:text-sm text-gray-500">{country.country}</span>
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
                      className="flex-1 w-full mt-2 sm:mt-0 px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg sm:border-l-0 sm:rounded-l-none sm:rounded-r-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors text-sm md:text-base"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsCountrySelectOpen(!isCountrySelectOpen)}
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg transition-colors text-sm md:text-base bg-white text-left flex items-center justify-between hover:border-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    >
                      <span className={guestInfo.country ? "text-gray-900" : "text-gray-500"}>
                        {guestInfo.country || "Select your country"}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isCountrySelectOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isCountrySelectOpen && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto mt-1">
                        {countries.map((country) => (
                          <button
                            key={country}
                            type="button"
                            onClick={() => handleCountryChange(country)}
                            className="w-full px-3 md:px-4 py-2.5 md:py-3 hover:bg-gray-50 transition-colors text-left text-sm md:text-base border-b border-gray-100 last:border-b-0"
                          >
                            {country}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
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
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-[#0064D2] text-white hover:bg-[#0052A3]'
                  }`}
                >
                  {isProcessing ? "Processing..." : "Continue to Payment"}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
