import React, { useState, useEffect, useMemo } from "react";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Select, Space, Button, Input } from "antd";
import { UserOutlined, TeamOutlined, HomeOutlined } from "@ant-design/icons";
import { DatePicker } from "antd";
import { useBooking } from "../../context/BookingContext";
import { jwtDecode } from "jwt-decode";

import { useSelector, useDispatch } from "react-redux";

export default function BookingForm({ hotel }) {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { bookingData, updateBookingData, updateGuests } = useBooking();
  const [selectedRoom, setSelectedRoom] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [specialRequest, setSpecialRequest] = useState("");
  const { Option } = Select;
  const { RangePicker } = DatePicker;
  const user = useSelector((state) => state?.auth?.user);
  const accessToken = useSelector((state) => state?.auth?.accessToken);
  console.log("Hotel", hotel);
  const userInfo = useMemo(() => {
    if (!accessToken) return null;
    try {
      const decoded = jwtDecode(accessToken);
      return {
        ...user,
        ...decoded,
        token: accessToken,
      };
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }, [accessToken, user]);
  console.log("fdasf", userInfo);
  const handleGuestsChange = (type, value) => {
    updateGuests({
      [type]: value,
    });
  };

  const handleDateChange = (dates) => {
    updateBookingData({
      dateRange: dates,
    });
  };

  const validateForm = () => {
    if (
      !bookingData.dateRange ||
      !bookingData.dateRange[0] ||
      !bookingData.dateRange[1]
    ) {
      alert("Please select check-in and check-out dates");
      return false;
    }
    if (bookingData.guests.adults === 0) {
      alert("Please select at least 1 adult");
      return false;
    }
    if (bookingData.guests.rooms === 0) {
      alert("Please select at least 1 room");
      return false;
    }
    return true;
  };

  const rooms = useMemo(() => {
    if (Array.isArray(hotel?.room) && hotel.room.length > 0) {
      return hotel.room.map((r) => ({
        id: r?._id || r?.id || r?.roomId || r?.hotelRoomType,
        name: r?.hotelRoomType || "Room",
        price: Number(r?.price) || Number(hotel?.averagePrice) || 0,
        convertedPrice:
          Number(r?.convertedPrice) ||
          Number(r?.price) ||
          Number(hotel?.averagePrice) ||
          0,
        discountedPrice: Number(r?.discountedPrice) || Number(r?.discount) || 0,
        displayCurrency: r?.displayCurrency || hotel?.displayCurrency || "USD",
        features: [
          r?.hotelRoomCapacity ? String(r.hotelRoomCapacity) : undefined,
          r?.category ? String(r.category) : undefined,
        ].filter(Boolean),
        rating: Number(r?.hotelRating) || Number(hotel?.averageRating) || 0,
      }));
    }
    return [
      {
        id: "default",
        name: hotel?.hotelName,
        price: Number(hotel?.averagePrice) || 0,
        convertedPrice:
          Number(hotel?.convertedPrice) || Number(hotel?.averagePrice) || 0,
        discountedPrice: Number(hotel?.discountedPrice) || 0,
        displayCurrency: hotel?.displayCurrency,
        features: [hotel?.hotelAccommodationType].filter(Boolean),
        rating: Number(hotel?.averageRating) || 0,
      },
    ];
  }, [hotel]);

  // Initialize selected room to first option
  useEffect(() => {
    if (!selectedRoom && rooms.length > 0) {
      setSelectedRoom(rooms[0].id);
    }
  }, [rooms, selectedRoom]);

  const selectedRoomData =
    rooms.find((room) => room.id === selectedRoom) || rooms[0];
  const nightlyBase = Number(
    selectedRoomData?.convertedPrice || selectedRoomData?.price || 0
  );
  const nightlyDiscountPct = Number(
    selectedRoomData?.discountedPrice || selectedRoomData?.discount || 0
  );
  const nightlyPrice =
    nightlyDiscountPct > 0
      ? Math.max(
          0,
          Math.round((nightlyBase * (100 - nightlyDiscountPct)) / 100)
        )
      : nightlyBase;

  // Format price with currency
  const formatPrice = (
    amount,
    currency = selectedRoomData?.displayCurrency || "USD"
  ) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
      .format(amount)
      .replace(/^\D+/, "");
  };

  // Get currency symbol
  const getCurrencySymbol = (
    currency = selectedRoomData?.displayCurrency || "USD"
  ) => {
    return (0)
      .toLocaleString("en-US", {
        style: "currency",
        currency: currency || "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
      .replace(/[0-9.,\s]/g, "");
  };

  const currencySymbol = getCurrencySymbol();
  const roomsCount = Math.max(1, Number(bookingData?.guests?.rooms || 1));

  // Calculate nights from dateRange
  const nights =
    bookingData.dateRange &&
    bookingData.dateRange[0] &&
    bookingData.dateRange[1]
      ? Math.ceil(
          (bookingData.dateRange[1].toDate().getTime() -
            bookingData.dateRange[0].toDate().getTime()) /
            (1000 * 3600 * 24)
        )
      : 1;

  const handleBooking = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsBooking(true);
    try {
      const checkInDate = bookingData?.dateRange?.[0]?.toDate?.() || null;
      const checkOutDate = bookingData?.dateRange?.[1]?.toDate?.() || null;

      const bookedFromDate = checkInDate ? checkInDate.toISOString() : null;
      const bookedToDate = checkOutDate ? checkOutDate.toISOString() : null;

      const subtotal = Math.round(nightlyPrice * nights * roomsCount);
      const vat = Math.round(subtotal * 0.12);
      const total = subtotal + vat;

      const payload = {
        hotelId: hotel?._id ?? hotel?.id ?? hotel?.hotelId ?? null,
        roomId: selectedRoomData?.id ?? null,
        hotelName: hotel?.hotelName ?? hotel?.name ?? "",
        location:
          hotel?.location ?? hotel?.hotelAddress ?? hotel?.address ?? "",
        roomType: selectedRoomData?.name ?? "",
        roomPrice: nightlyPrice,
        nights,
        rooms: roomsCount,
        adults: Number(bookingData?.guests?.adults ?? 1),
        children: Number(bookingData?.guests?.children ?? 0),
        user: userInfo,
        subtotal,
        total,
        vat,
        bookedFromDate,
        bookedToDate,
        checkIn: bookedFromDate,
        checkOut: bookedToDate,
        convertedPrice: selectedRoomData.convertedPrice,
        displayCurrency: selectedRoomData.displayCurrency,
        discountedPrice: selectedRoomData.discountedPrice,
        originalPrice: selectedRoomData.price,
      };
      console.log("payload", payload);

      if (accessToken) {
        // If user is logged in, navigate to checkout
        navigate("/hotel/checkout", { state: { bookingData: payload } });
      } else {
        // If user is not logged in, navigate to guest login with booking data
        navigate("/hotel/guest-login", {
          state: {
            bookingData: payload,
            returnUrl: "/hotel/checkout",
          },
        });
      }
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-5 sticky top-5">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {currencySymbol}:{formatPrice(nightlyBase * roomsCount)}
            </span>
            {selectedRoomData?.discountedPrice > 0 && (
              <>
                <span className="text-sm text-gray-400 line-through">
                  {currencySymbol}:{formatPrice(nightlyPrice * roomsCount)}
                </span>

                <span className="text-xs bg-red-100 text-red-700 font-medium px-2 py-0.5 rounded">
                  -{Math.round(Number(selectedRoomData.discountedPrice))}%
                </span>
              </>
            )}
          </div>
        </div>
        <span className="text-gray-600">
          Per night{roomsCount > 1 ? ` · for ${roomsCount} rooms` : ""}
        </span>
      </div>

      <form onSubmit={handleBooking} className="space-y-4">
        {/* Dates */}
        <div className="">
          {/* Check-in & Check-out */}
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-in and Check-out
          </label>
          <RangePicker
            placeholder={["Check-in", "Check-out"]}
            value={bookingData.dateRange}
            onChange={handleDateChange}
            style={{ width: "100%", height: "48px" }}
            className="border-gray-300 rounded-lg focus:border-[#0064D2] focus:ring-1 focus:ring-[#0064D2]"
            disabledDate={(current) =>
              current && current < new Date().setHours(0, 0, 0, 0)
            }
          />
        </div>

        {/* Guests */}
        <div className="space-y-2 h-full flex flex-col">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Guests and Rooms
          </label>
          <Select
            value="guests"
            placeholder="0 adults · 0 children · 0 rooms"
            className="w-full h-full [&>div]:h-full [&>div]:py-2.5 [&>div]:px-3 [&_.ant-select-selection-placeholder]:text-gray-400 focus:outline-none focus:border-[#0064D2]"
            style={{ height: "100%" }}
            dropdownMatchSelectWidth={false}
            dropdownRender={() => (
              <div className="p-4 space-y-4 min-w-[300px]">
                {/* Adults Counter */}
                <div className="flex justify-between items-center">
                  <Space>
                    <UserOutlined className="text-gray-600" />
                    <span>Adults</span>
                  </Space>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() =>
                        handleGuestsChange(
                          "adults",
                          Math.max(0, bookingData.guests.adults - 1)
                        )
                      }
                      disabled={bookingData.guests.adults <= 0}
                      className="flex items-center justify-center w-8 h-8"
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">
                      {bookingData.guests.adults}
                    </span>
                    <Button
                      onClick={() =>
                        handleGuestsChange(
                          "adults",
                          bookingData.guests.adults + 1
                        )
                      }
                      disabled={bookingData.guests.adults >= 8}
                      className="flex items-center justify-center w-8 h-8"
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Children Counter */}
                <div className="flex justify-between items-center">
                  <Space>
                    <TeamOutlined className="text-gray-600" />
                    <span>Children</span>
                  </Space>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() =>
                        handleGuestsChange(
                          "children",
                          Math.max(0, bookingData.guests.children - 1)
                        )
                      }
                      disabled={bookingData.guests.children <= 0}
                      className="flex items-center justify-center w-8 h-8"
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">
                      {bookingData.guests.children}
                    </span>
                    <Button
                      onClick={() =>
                        handleGuestsChange(
                          "children",
                          bookingData.guests.children + 1
                        )
                      }
                      disabled={bookingData.guests.children >= 4}
                      className="flex items-center justify-center w-8 h-8"
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Rooms Counter */}
                <div className="flex justify-between items-center">
                  <Space>
                    <HomeOutlined className="text-gray-600" />
                    <span>Rooms</span>
                  </Space>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() =>
                        handleGuestsChange(
                          "rooms",
                          Math.max(0, bookingData.guests.rooms - 1)
                        )
                      }
                      disabled={bookingData.guests.rooms <= 0}
                      className="flex items-center justify-center w-8 h-8"
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">
                      {bookingData.guests.rooms}
                    </span>
                    <Button
                      onClick={() =>
                        handleGuestsChange(
                          "rooms",
                          bookingData.guests.rooms + 1
                        )
                      }
                      disabled={bookingData.guests.rooms >= 5}
                      className="flex items-center justify-center w-8 h-8"
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            )}
          >
            <Option value="guests">
              {`${bookingData.guests.adults} ${
                bookingData.guests.adults !== 1 ? "adults" : "adult"
              } · ${bookingData.guests.children} ${
                bookingData.guests.children !== 1 ? "children" : "child"
              } · ${bookingData.guests.rooms} ${
                bookingData.guests.rooms !== 1 ? "rooms" : "room"
              }`}
            </Option>
          </Select>
        </div>

        <div className="space-y-2">
          {rooms.map((room) => (
            <div
              key={room.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedRoom === room.id
                  ? "border-[#0064D2] bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedRoom(room.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900">{room.name}</h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="w-3 h-3 text-yellow-400 mr-1" />
                      <span>{room.rating}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {room.features.map((feature, index) => (
                      <span
                        key={index}
                        className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {getCurrencySymbol(room.displayCurrency)}:
                    {room.discountedPrice > 0
                      ? Math.max(
                          0,
                          Math.round(
                            (room.convertedPrice *
                              (100 - room.discountedPrice)) /
                              100
                          )
                        )
                      : room.convertedPrice}
                  </div>
                  {Number(room.discountedPrice) > 0 && (
                    <div className="text-xs text-gray-400 line-through">
                      {getCurrencySymbol(room.displayCurrency)}:
                      {Number(room.convertedPrice || 0)}
                    </div>
                  )}
                  {Number(room.discountedPrice) > 0 && (
                    <div className="text-[10px] text-red-700 bg-red-100 inline-block mt-0.5 px-1.5 py-0.5 rounded">
                      -{Math.round(Number(room.discountedPrice))}%
                    </div>
                  )}
                  <div className="text-xs text-gray-500">Per night</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Special Request */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Request(optional)
          </label>
          <Input.TextArea
            placeholder="Any special requests or preferences..."
            value={specialRequest}
            onChange={(e) => setSpecialRequest(e.target.value)}
            rows={3}
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Cannot be guaranteed but the property will do its best to meet your
            needs.
          </p>
        </div>

        {/* Price Breakdown */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              {getCurrencySymbol(selectedRoomData?.displayCurrency)}
              {Number(nightlyPrice).toFixed(2)} × {nights}{" "}
              {nights === 1 ? "night" : "nights"}
              {roomsCount > 1 ? ` × ${roomsCount} rooms` : ""}
            </span>
            <span>
              {getCurrencySymbol(selectedRoomData?.displayCurrency)}
              {Number(nightlyPrice * nights * roomsCount).toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span>VAT (12%)</span>
            <span>
              {getCurrencySymbol(selectedRoomData?.displayCurrency)}
              {Number(nightlyPrice * nights * roomsCount * 0.12).toFixed(2)}
            </span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>
                {getCurrencySymbol(selectedRoomData?.displayCurrency)}
                {(
                  Number(nightlyPrice * nights * roomsCount) +
                  Number(nightlyPrice * nights * roomsCount * 0.12)
                ).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isBooking}
          className="w-full bg-[#0064D2] text-white px-4 py-2 rounded-lg text-sm font-bold"
        >
          {isBooking ? "Processing..." : "Reserve"}
        </button>
      </form>
    </div>
  );
}
