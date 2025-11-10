import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
} from "lucide-react";
import img1 from "/burj.png";
import { useGetAttractionAppealByIdQuery } from "../../redux/api/attraction/attractionApi";
import ImageGallery from "./ImageGallery";

export default function EventReservationPage() {
  const navigate = useNavigate();
  const { id: appealId = "" } = useParams();
  const { data, isLoading, error } = useGetAttractionAppealByIdQuery(appealId, {
    skip: !appealId,
  });
  const a = data?.data;

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [selectedTo, setSelectedTo] = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [guests, setGuests] = useState("1");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // ---------- Calendar Generation ----------
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

  // ---------- Selected weekday (derived from selected date) ----------
  const selectedWeekday = useMemo(() => {
    if (!selectedDate) return "";
    try {
      return new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long" });
    } catch {
      return "";
    }
  }, [selectedDate]);

  // ---------- Update available slots when selected date changes ----------
  useEffect(() => {
    if (!selectedDate || !a?.attractionSchedule) return;
    const weekday = new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long" });
    const daySchedule = (a.attractionSchedule || []).find(
      (item) => String(item.day || "").toLowerCase() === String(weekday).toLowerCase()
    );
    setAvailableSlots(daySchedule?.slots || []);
  }, [selectedDate, a]);

  // ---------- Days available from schedule ----------
  const scheduleDays = useMemo(() => {
    const days = (a?.attractionSchedule || []).map((s) => s?.day).filter(Boolean);
    return [...new Set(days)];
  }, [a]);

  // ---------- Default Images ----------
  const images = useMemo(() => {
    const arr = a?.attractionImages || [];
    if (arr.length > 0) return arr;
    return [img1, img1, img1];
  }, [a]);

  // ---------- Amenities ----------
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
    return (
      <div className="min-h-screen container mx-auto px-5 md:px-0 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow p-6 animate-pulse h-48"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !a) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Failed to load event details.</p>
      </div>
    );
  }

  // ---------- UI ----------
  return (
    <div className="min-h-screen container mx-auto px-5 md:px-0 py-10">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {a?.attractionDestinationType}
            </h1>
            <p className="text-gray-600">{a?.attractionDescription}</p>
          </div>
          <button
            onClick={() => navigate(`/attraction-details?appealId=${appealId}`)}
            disabled={!appealId}
            className={`px-4 py-2 rounded-lg font-medium border ${
              !appealId
                ? "opacity-60 cursor-not-allowed"
                : "bg-[#0064D2] text-white border-[#0064D2] hover:bg-blue-700"
            }`}
          >
            View Attraction Details
          </button>
        </div>

        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-current text-yellow-500" />
            <span className="font-medium">{a?.attractionRating}</span>
            <span className="text-gray-600">
              ({a?.attractionReviewCount} reviews)
            </span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-gray-600" />
            <span className="text-gray-600">
              {a?.attractionCity}, {a?.attractionCountry}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          {/* <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            <div className="col-span-2 row-span-2">
              <img
                src={images[0] || "/placeholder.svg"}
                alt="Main View"
                className="w-full h-64 md:h-80 object-cover rounded-lg shadow-md"
              />
            </div>
            {images.slice(1).map((image, index) => (
              <div key={index}>
                <img
                  src={image || "/placeholder.svg"}
                  alt={`View ${index + 2}`}
                  className="w-full h-32 md:h-38 object-cover rounded-lg shadow-md"
                />
              </div>
            ))}
          </div> */}
          <ImageGallery data={a}/>
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
        </div>

        {/* Right Column - Booking */}
        <div className="lg:col-span-1 pb-10">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
            {/* Price */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-2xl font-bold">
                ${a?.attractionAdultPrice}
              </span>
              <span className="text-sm text-gray-600">per person</span>
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
                          <div key={d} className="text-xs font-medium text-gray-500 text-center py-1">
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
                    Selected: {new Date(selectedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} ({selectedWeekday})
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
                            : "bg-white hover:bg-gray-50 border-gray-200"
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
              <div>
                <label
                  htmlFor="guests"
                  className="text-xs font-medium block mb-1"
                >
                  GUESTS
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={String(i + 1)}>
                      {i + 1} guest{i > 0 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 my-4"></div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    ${a?.attractionAdultPrice} x {guests} guest
                    {parseInt(guests) > 1 ? "s" : ""}
                  </span>
                  <span>
                    ${(a?.attractionAdultPrice || 0) * parseInt(guests)}
                  </span>
                </div>
                {/* <div className="flex justify-between text-sm">
                  <span>Service fee</span>
                  <span>$50</span>
                </div> */}
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>
                    ${(a?.attractionAdultPrice || 0) * parseInt(guests) }
                  </span>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={() => {
                  const unitPrice = a?.attractionAdultPrice || 0;
                  const bookingDetails = {
                    bookingId:
                      "EVT" + Math.floor(10000000 + Math.random() * 90000000),
                    eventName: a?.attractionDestinationType || "Event",
                    location: `${a?.attractionCity || ""}, ${
                      a?.attractionCountry || ""
                    }`.trim(),
                    selectedDate,
                    selectedTime,
                    selectedFrom,
                    selectedTo,
                    selectedSlotId,
                    guests,
                    unitPrice,
                    total: unitPrice * parseInt(guests) ,
                    appealId,
                    discountPercent: a?.discount || 0,
                    vatPercent: a?.vat || 0,
                  };
                  navigate("/event/checkout", { state: { bookingDetails } });
                }}
                disabled={!selectedDate || !selectedTime}
                className={`w-full bg-[#0064D2] text-white py-3 px-6 rounded-lg font-medium transition-colors mt-4 ${
                  !selectedDate || !selectedTime
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-blue-700"
                }`}
              >
                Continue to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
