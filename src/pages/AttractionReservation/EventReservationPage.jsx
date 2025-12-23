import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  MapPin,
  Star,
  Wifi,
  Car,
  Coffee,
  Tv,
  Wind,
  Waves,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useGetAttractionAppealByIdQuery } from "../../redux/api/attraction/attractionApi";
import ImageGallery from "./ImageGallery";
import Loader from "../../shared/Loader/Loader";
import { currencyByCountry } from "../../components/curenci";

export default function EventReservationPage() {
  const navigate = useNavigate();
  const { id: appealId = "" } = useParams();
  const { data, isLoading, error } = useGetAttractionAppealByIdQuery(appealId, {
    skip: !appealId,
  });
  const accessToken = useSelector((state) => state?.auth?.accessToken);
  const a = data?.data;
  const cancelationPolicy = a?.attraction?.attractionCancelationPolicy;

  // Currency detection states
  const [userCurrency, setUserCurrency] = useState("USD");
  const [userCountry, setUserCountry] = useState(null);
  const [conversionRate, setConversionRate] = useState(1);

  // Currency detection and conversion
  useEffect(() => {
    const detect = async () => {
      try {
        const res = await fetch("https://api.country.is/");
        const data = await res.json();
        const country = data.country;

        if (country && currencyByCountry[country]) {
          setUserCountry(country);
          const userCurr = currencyByCountry[country].code;
          setUserCurrency(userCurr);

          // Fetch conversion: USD → user's currency
          let rate = 1;

          if ("USD" !== userCurr) {
            const rateRes = await fetch(
              "https://open.er-api.com/v6/latest/USD"
            );
            const rateData = await rateRes.json();

            if (rateData?.rates) {
              const usdToUser = rateData.rates[userCurr] || 1;
              rate = usdToUser;
            }
          } else {
          }

          setConversionRate(rate);
        } else {
          setUserCurrency("USD");
          setConversionRate(1);
        }
      } catch (e) {
        console.error(
          "EventReservationPage: Detection or conversion failed:",
          e
        );
        setUserCurrency("USD");
        setConversionRate(1);
      }
    };

    detect();
  }, []);

  const displayCurrency = a?.currency || a?.displayCurrency;
  const baseAdultPrice =
    Number(a?.originalAdultPrice) || Number(a?.attractionAdultPrice) || 0;
  const baseChildPrice =
    Number(a?.originalChildPrice) || Number(a?.attractionChildPrice) || 0;
  const baseCurrency = displayCurrency || "USD";

  // Calculate converted prices
  let convertedAdultPrice = baseAdultPrice;
  let convertedChildPrice = baseChildPrice;
  let finalDisplayCurrency = userCurrency || baseCurrency;

  // Convert from base currency to user currency
  if (userCurrency && baseCurrency !== userCurrency && conversionRate) {
    // If base currency is NGN and user wants USD
    if (baseCurrency === "NGN" && userCurrency === "USD") {
      // Convert NGN to USD (assuming 1 USD = 1515 NGN)
      const ngnToUsdRate = 1 / 1515;
      convertedAdultPrice = Number(baseAdultPrice * ngnToUsdRate);
      convertedChildPrice = Number(baseChildPrice * ngnToUsdRate);
    }
    // If base currency is USD and user has different currency
    else if (baseCurrency === "USD") {
      convertedAdultPrice = Number(baseAdultPrice * conversionRate);
      convertedChildPrice = Number(baseChildPrice * conversionRate);
    }
    // If base currency is not USD but user wants USD
    else if (userCurrency === "USD") {
      convertedAdultPrice = Number(baseAdultPrice / conversionRate);
      convertedChildPrice = Number(baseChildPrice / conversionRate);
    }
    // For other conversions, use the provided conversion rate
    else {
      convertedAdultPrice = Number(baseAdultPrice * conversionRate);
      convertedChildPrice = Number(baseChildPrice * conversionRate);
    }
  }

  const adultPrice = Number(convertedAdultPrice);
  const childPrice = Number(convertedChildPrice);

  const attractionAddressParts = [
    a?.attractionAddress,
    a?.attractionCity,
    a?.attractionCountry,
  ].filter(Boolean);
  const fullAddress = attractionAddressParts.join(", ");
  const encodedQuery = encodeURIComponent(fullAddress || "");
  const displayRating = Number(a?.attractionRating) || 0;
  const reviewCount = Number(
    a?.attractionReviewCount ??
      a?.totalReviews ??
      a?.reviewCount ??
      a?.reviewsCount ??
      0
  );

  const openFullMap = () => {
    if (fullAddress) {
      const url = `https://www.google.com/maps/search/${encodedQuery}`;
      window.open(url, "_blank");
    } else {
      window.open("https://www.google.com/maps", "_blank");
    }
  };

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [selectedTo, setSelectedTo] = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [adults, setAdults] = useState("1");
  const [children, setChildren] = useState("0");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const generateCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const calendar = [];
    const today = new Date();

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      calendar.push({
        date: date.getDate(),
        fullDate: date.toISOString().split("T")[0],
        isCurrentMonth: date.getMonth() === currentMonth,
        isToday: date.toDateString() === today.toDateString(),
        isPast: date < today && date.toDateString() !== today.toDateString(),
      });
    }
    return calendar;
  };

  const calendar = generateCalendar();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const handleBooking = (e) => {
    e?.preventDefault?.();

    if (!selectedDate || !selectedTime || !a) {
      return;
    }

    const unitPrice = adultPrice || 0;
    const adultCount = parseInt(adults || "0", 10);
    const childCount = parseInt(children || "0", 10);
    const guestCount = adultCount + childCount;
    const finalChildPrice = childPrice || adultPrice;
    const total = adultCount * unitPrice + childCount * finalChildPrice;

    const bookingDetails = {
      bookingId: appealId || a?.id || "",
      eventName: a?.attractionDestinationType || "Event",
      location: `${a?.attractionCity || ""}, ${
        a?.attractionCountry || ""
      }`.trim(),
      selectedDate,
      selectedTime,
      selectedFrom,
      selectedTo,
      selectedSlotId,
      guests: guestCount,
      adults: adultCount,
      children: childCount,
      unitPrice,
      total,
      convertedAdultPrice: adultPrice,
      convertedChildPrice: finalChildPrice,
      displayCurrency: finalDisplayCurrency,
      appealId,
      cancelationPolicy,
      discountPercent: a?.discount || 0,
      vatPercent: a?.vat || 0,

      // Add currency conversion details
      userCurrency,
      userCountry,
      conversionRate,
      baseCurrency,
      baseAdultPrice,
      baseChildPrice,
    };
    if (accessToken) {
      navigate("/event/checkout", { state: { bookingDetails } });
    } else {
      navigate("/event/guest-login", {
        state: {
          bookingDetails,
          returnUrl: "/event/checkout",
        },
      });
    }
  };

  const selectedWeekday = useMemo(() => {
    if (!selectedDate) return "";
    try {
      return new Date(selectedDate).toLocaleDateString("en-US", {
        weekday: "long",
      });
    } catch {
      return "";
    }
  }, [selectedDate]);

  useEffect(() => {
    if (!selectedDate || !a?.attractionSchedule) return;
    const weekday = new Date(selectedDate).toLocaleDateString("en-US", {
      weekday: "long",
    });
    const daySchedule = (a.attractionSchedule || []).find(
      (item) =>
        String(item.day || "").toLowerCase() === String(weekday).toLowerCase()
    );
    setAvailableSlots(daySchedule?.slots || []);
  }, [selectedDate, a]);

  const amenities = useMemo(
    () => [
      {
        icon: Wifi,
        label: `Free WiFi: ${a?.attractionFreeWifi ? "Yes" : "No"}`,
      },
      {
        icon: Car,
        label: `Free parking: ${a?.attractionFreeParking ? "Yes" : "No"}`,
      },
      {
        icon: Coffee,
        label: `Kitchen: ${a?.attractionKitchen ? "Yes" : "No"}`,
      },
      { icon: Tv, label: `TV: ${a?.attractionTv ? "Yes" : "No"}` },
      {
        icon: Wind,
        label: `Air conditioning: ${
          a?.attractionAirConditioning ? "Yes" : "No"
        }`,
      },
      { icon: Waves, label: `Pool: ${a?.attractionPool ? "Yes" : "No"}` },
    ],
    [a]
  );

  if (isLoading) {
    return <Loader />;
  }

  if (error || !a) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Failed to load event details.</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen container mx-auto px-5 md:px-0 py-10">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {a?.attractionDestinationType}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4 text-gray-600" />
          <span className="text-gray-600">
            {a?.attractionCity}, {a?.attractionCountry}
          </span>
        </div>

        <div className="flex items-center mt-3 gap-2">
          <span className="text-xl font-normal ">Average Rating : </span>
          {[1, 2, 3, 4, 5].map((s, i) => (
            <Star
              key={s}
              className={`w-5 h-5 ${
                i < Math.round(displayRating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-sm text-gray-700">
            {displayRating.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <ImageGallery data={a} />
          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-gray-600 leading-relaxed">
              {a?.attractionDescription}
            </p>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="text-xl font-semibold mb-3">
              What this place offers
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {amenities.map((amenity, index) => {
                const IconComponent = amenity.icon;
                return (
                  <div key={index} className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">{amenity.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-3">Booking Policy</h2>
            <p className="text-black text-lg leading-relaxed">
              {cancelationPolicy}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-semibold">Guest Reviews</h2>
              <span className="inline-flex items-center rounded-full bg-green-100 text-green-800 px-3 py-1 text-sm font-medium">
                Rating {displayRating.toFixed(1)} · {reviewCount}{" "}
                {reviewCount === 1 ? "review" : "reviews"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((s, i) => (
                <Star
                  key={s}
                  className={`w-5 h-5 ${
                    i < Math.round(displayRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600">
                ({displayRating.toFixed(1)})
              </span>
            </div>
          </div>
        </div>

        {/* Right Column - Booking */}
        <div className="lg:col-span-1 pb-10">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="relative h-[200px]">
              <iframe
                src={`https://maps.google.com/maps?q=${encodedQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                className="absolute inset-0"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Hotel Location Map"
              ></iframe>

              {/* Map Overlay with Attraction Info */}
              <div className="absolute top-2 left-2 right-2 bg-white/80 backdrop-blur-md rounded-xl shadow-md p-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
                  <div className="min-w-0">
                    <h5 className="font-semibold text-xs text-gray-900 truncate">
                      {a?.attractionDestinationType || "Attraction"}
                    </h5>
                    {a?.attractionCity && (
                      <p className="text-[11px] text-gray-600 truncate">
                        {a.attractionCity}
                      </p>
                    )}
                    <div className="mt-1 flex items-center gap-2">
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-yellow-50 px-1.5 py-0.5 text-[10px] text-yellow-800">
                        {[1, 2, 3, 4, 5].map((star, i) => (
                          <Star
                            key={star}
                            className={`w-2.5 h-2.5 ${
                              i < Math.round(displayRating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        {displayRating.toFixed(1)}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] text-blue-700">
                        {finalDisplayCurrency}
                        {Number(convertedAdultPrice).toLocaleString()}/person
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* View in full map link */}
            <div className="bg-white border-t border-gray-100 p-2">
              <button
                onClick={openFullMap}
                className="flex items-center justify-center w-full text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors py-1"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                View in full map
              </button>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
            {/* Price */}
            <div className="flex items-center  mb-6">
              <span className="text-2xl font-bold">
                {finalDisplayCurrency}{" "}
                {Number(convertedAdultPrice).toLocaleString()}
              </span>
              <span className="text-sm text-gray-600">(Per Adult)</span>
            </div>
            <div className="flex items-center mb-6">
              <span className="text-2xl font-bold">
                {finalDisplayCurrency}{" "}
                {Number(convertedChildPrice).toLocaleString()}
              </span>
              <span className="text-sm text-gray-600">(Per Child)</span>
            </div>

            {/* Day Selector */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-3 block">
                  SELECT DAY
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg text-left bg-white hover:bg-gray-50 flex items-center justify-between"
                  >
                    <span
                      className={
                        selectedDate ? "text-gray-900" : "text-gray-500"
                      }
                    >
                      {selectedDate || "Select a day"}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        isCalendarOpen ? "rotate-90" : ""
                      }`}
                    />
                  </button>

                  {isCalendarOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
                      {/* Calendar Header */}
                      <div className="flex items-center justify-between mb-4">
                        <button
                          onClick={() => {
                            if (currentMonth === 0) {
                              setCurrentMonth(11);
                              setCurrentYear(currentYear - 1);
                            } else {
                              setCurrentMonth(currentMonth - 1);
                            }
                          }}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <h3 className="font-medium text-sm">
                          {monthNames[currentMonth]} {currentYear}
                        </h3>
                        <button
                          onClick={() => {
                            if (currentMonth === 11) {
                              setCurrentMonth(0);
                              setCurrentYear(currentYear + 1);
                            } else {
                              setCurrentMonth(currentMonth + 1);
                            }
                          }}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Weekday Headers */}
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                          <div
                            key={d}
                            className="text-xs font-medium text-gray-500 text-center py-1"
                          >
                            {d}
                          </div>
                        ))}
                      </div>

                      {/* Calendar Grid */}
                      <div className="grid grid-cols-7 gap-1">
                        {calendar.map((day, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              if (!day.isPast && day.isCurrentMonth) {
                                setSelectedDate(day.fullDate);
                                setIsCalendarOpen(false);
                              }
                            }}
                            disabled={day.isPast || !day.isCurrentMonth}
                            className={`w-8 h-8 text-xs rounded transition-all ${
                              selectedDate === day.fullDate
                                ? "bg-blue-600 text-white"
                                : day.isToday
                                ? "bg-blue-100 text-blue-600 font-medium"
                                : day.isPast || !day.isCurrentMonth
                                ? "text-gray-300 cursor-not-allowed"
                                : "hover:bg-gray-100 text-gray-700"
                            }`}
                          >
                            {day.date}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedDate && (
                <div className="mb-2">
                  <span className="text-sm text-gray-600">
                    Selected:{" "}
                    {new Date(selectedDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    ({selectedWeekday})
                  </span>
                </div>
              )}

              {/* Time Slots */}
              <div>
                <label className="text-xs font-medium mb-3 block">
                  SELECT TIME:
                </label>
                <div className=" gap-2 flex flex-wrap">
                  {availableSlots.length > 0 ? (
                    availableSlots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => {
                          setSelectedTime(`${slot.from} - ${slot.to}`);
                          setSelectedFrom(slot.from);
                          setSelectedTo(slot.to);
                          setSelectedSlotId(slot.id ?? slot._id ?? null);
                        }}
                        className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                          selectedTime === `${slot.from} - ${slot.to}`
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        {slot.from} - {slot.to}
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm col-span-4 text-center">
                      {selectedDate
                        ? "No slots available for this day"
                        : "Select a day first"}
                    </p>
                  )}
                </div>
              </div>

              {/* Guests */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="adults"
                    className="text-xs font-medium block mb-1"
                  >
                    ADULTS
                  </label>
                  <select
                    id="adults"
                    value={adults}
                    onChange={(e) => setAdults(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={String(i + 1)}>
                        {i + 1} adult{i > 0 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="children"
                    className="text-xs font-medium block mb-1"
                  >
                    CHILDREN
                  </label>
                  <select
                    id="children"
                    value={children}
                    onChange={(e) => setChildren(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i} value={String(i)}>
                        {i} child{i === 1 ? "" : "ren"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 my-4"></div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    {finalDisplayCurrency}{" "}
                    {Number(convertedAdultPrice).toLocaleString()} x{" "}
                    {parseInt(adults || "0", 10)} adult
                    {parseInt(adults || "0", 10) > 1 ? "s" : ""}
                  </span>
                  <span>
                    {finalDisplayCurrency}{" "}
                    {Number(
                      convertedAdultPrice * parseInt(adults || "0", 10)
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>
                    {finalDisplayCurrency}{" "}
                    {Number(convertedChildPrice).toLocaleString()} x{" "}
                    {parseInt(children || "0", 10)} child
                    {parseInt(children || "0", 10) === 1 ? "" : "ren"}
                  </span>
                  <span>
                    {finalDisplayCurrency}{" "}
                    {Number(
                      convertedChildPrice * parseInt(children || "0", 10)
                    ).toLocaleString()}
                  </span>
                </div>

                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>
                    {finalDisplayCurrency}{" "}
                    {Number(
                      convertedAdultPrice * parseInt(adults || "0", 10) +
                        convertedChildPrice * parseInt(children || "0", 10)
                    ).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleBooking}
                disabled={!selectedDate || !selectedTime}
                className={`w-full bg-[#0064D2] text-white py-3 px-6 rounded-lg font-medium transition-colors mt-4 ${
                  !selectedDate || !selectedTime
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-blue-700"
                }`}
              >
                Reserve
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
