import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MapPin,
  Star,
  Users,
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

export default function EventReservationPage() {
  const navigate = useNavigate();
  const { id: appealId = "" } = useParams();
  const { data, isLoading, error } = useGetAttractionAppealByIdQuery(appealId, { skip: !appealId });
  const a = data?.data;
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [guests, setGuests] = useState("1");
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

  const timeSlots = [
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
  ];

  const images = useMemo(() => {
    const arr = a?.attractionImages || [];
    if (arr.length > 0) return arr;
    return [img1, img1, img1];
  }, [a]);

  const amenities = useMemo(() => [
    { icon: Wifi, label: `Free WiFi: ${a?.attractionFreeWifi ? 'Yes' : 'No'}` },
    { icon: Car, label: `Free parking: ${a?.attractionFreeParking ? 'Yes' : 'No'}` },
    { icon: Coffee, label: `Kitchen: ${a?.attractionKitchen ? 'Yes' : 'No'}` },
    { icon: Tv, label: `TV: ${a?.attractionTv ? 'Yes' : 'No'}` },
    { icon: Wind, label: `Air conditioning: ${a?.attractionAirConditioning ? 'Yes' : 'No'}` },
    { icon: Waves, label: `Pool: ${a?.attractionPool ? 'Yes' : 'No'}` },
  ], [a]);

  const ratingDistribution = [
    { stars: 5, count: 98, percentage: 77 },
    { stars: 4, count: 22, percentage: 17 },
    { stars: 3, count: 6, percentage: 5 },
    { stars: 2, count: 1, percentage: 1 },
    { stars: 1, count: 1, percentage: 1 },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen container mx-auto px-5 md:px-0 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-6 animate-pulse h-48"></div>
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

  return (
    <div className="min-h-screen container mx-auto px-5 md:px-0 py-10">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {a?.attractionDestinationType}
            </h1>
            <p className="text-gray-600">
              {a?.attractionDescription}
            </p>
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
            <span className="text-gray-600">({a?.attractionReviewCount} reviews)</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-gray-600" />
            <span className="text-gray-600">{a?.attractionCity}, {a?.attractionCountry}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images and Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            <div className="col-span-2 row-span-2">
              <img
                src={images[0] || "/placeholder.svg"}
                alt="Burj Khalifa Main View"
                className="w-full h-64 md:h-80 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              />
            </div>
            {images.slice(1).map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Burj Khalifa View ${index + 2}`}
                  className="w-full h-32 md:h-38 object-cover rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105"
                />
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-gray-600 leading-relaxed">{a?.attractionDescription}</p>
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

          {/* Reviews */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Reviews</h2>

            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-current text-yellow-500" />
                  <span className="text-2xl font-bold">{a?.attractionRating}</span>
                </div>
                <div className="text-gray-600">
                  <span className="font-medium">{a?.attractionReviewCount}</span> reviews
                </div>
              </div>

              <div className="space-y-2">
                {ratingDistribution.map((rating) => (
                  <div key={rating.stars} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12">
                      <span className="text-sm">{rating.stars}</span>
                      <Star className="h-3 w-3 fill-current text-yellow-500" />
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: `${rating.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 w-8 text-right">
                      {rating.count}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    S
                  </div>
                  <div>
                    <p className="font-medium">Sarah</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3 fill-current text-yellow-500"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Amazing experience! The views from the top are absolutely
                  breathtaking. Well organized and the staff was very helpful.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Booking Form */}
        <div className="lg:col-span-1 pb-10">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
            <div className="flex items-center justify-between mb-6">
              <span className="text-2xl font-bold">${a?.attractionAdultPrice}</span>
              <span className="text-sm text-gray-600">per person</span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-3 block">
                  SELECT DATE
                </label>
                <div className="relative">
                  {/* Date Input Dropdown */}
                  <button
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <span
                      className={
                        selectedDate ? "text-gray-900" : "text-gray-500"
                      }
                    >
                      {selectedDate
                        ? new Date(selectedDate).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "Select a date"}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        isCalendarOpen ? "rotate-90" : ""
                      }`}
                    />
                  </button>

                  {/* Calendar Dropdown */}
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
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(
                          (day) => (
                            <div
                              key={day}
                              className="text-xs font-medium text-gray-500 text-center py-1"
                            >
                              {day}
                            </div>
                          )
                        )}
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

              {/* Time Slots */}
              <div>
                <label className="text-xs font-medium mb-3 block">
                  SELECT TIME:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                        selectedTime === time
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white hover:bg-gray-50 border-gray-200"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg "
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={String(i + 1)}>
                      {i + 1} guest{i > 0 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-t border-gray-200 my-4"></div>

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    ${a?.attractionAdultPrice} x {guests} guest{parseInt(guests) > 1 ? "s" : ""}
                  </span>
                  <span>${(a?.attractionAdultPrice || 0) * parseInt(guests)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Service fee</span>
                  <span>$50</span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>${((a?.attractionAdultPrice || 0) * parseInt(guests)) + 50}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  const bookingDetails = {
                    bookingId:
                      "EVT" + Math.floor(10000000 + Math.random() * 90000000),
                    eventName: "Burj Khalifa: Floors 124 & 125",
                    location: "Dubai, UAE",
                    selectedDate,
                    selectedTime,
                    guests,
                    total: 600 * parseInt(guests) + 50,
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
