import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  Calendar,
  Users,
  MapPin,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { useCreateHotelBookingMutation } from "../../redux/api/hotel/hotelApi";
import { handleError, handleSuccess } from "../../../toast";
import { currencyByCountry } from "../../components/curenci";

export default function Checkout() {
  const [userCurrency, setUserCurrency] = useState("USD");
  const [userCountry, setUserCountry] = useState(null);
  const [conversionRate, setConversionRate] = useState(1);

  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state?.auth?.user);

  const bookingData = location.state?.bookingData || {};
  const guestInfo = location.state?.guestInfo || {};

  const [isProcessing, setIsProcessing] = useState(false);
  const [createHotelBooking, { isLoading }] = useCreateHotelBookingMutation();

  const basePrice = bookingData?.roomPrice ?? bookingData?.total ?? 0;
  const baseCurrency = bookingData?.displayCurrency ?? "USD";

  // ---------- SAFE CURRENCY SYSTEM ----------
  useEffect(() => {
    const detectCurrency = async () => {
      try {
        const res = await fetch("https://api.country.is/");
        const data = await res.json();
        const country = data.country;

        const foundCurrency = currencyByCountry[country]?.code || "USD";
        setUserCountry(country);
        setUserCurrency(foundCurrency);

        // Load USD → rates
        const rateRes = await fetch("https://open.er-api.com/v6/latest/USD");
        const rateData = await rateRes.json();

        if (!rateData?.rates) {
          setConversionRate(1);
          return;
        }

        const baseRate = rateData.rates[baseCurrency];
        const userRate = rateData.rates[foundCurrency];

        if (!baseRate || !userRate) {
          setConversionRate(1);
          return;
        }

        let rate =
          baseCurrency === "USD" ? userRate : (1 / baseRate) * userRate;

        if (!rate || isNaN(rate) || !isFinite(rate)) {
          rate = 1;
        }

        setConversionRate(rate);
      } catch (err) {
        console.error("Currency detect failed:", err);
        setConversionRate(1);
        setUserCurrency("USD");
      }
    };

    detectCurrency();
  }, [baseCurrency]);

  // ---------- PRICE CALCULATIONS ----------
  const nights = Number(bookingData.nights || 1);
  const rooms = Number(bookingData.rooms || 1);

  // Use the total from BookingForm if available, otherwise calculate
  const bookingFormTotal = bookingData?.total || 0;
  let totalAmount;
  let subtotal;
  let vatAmount;
  const vatRate = Number(bookingData?.vat) || 5;

  if (bookingFormTotal > 0) {
    // Use the total from BookingForm (this is subtotal without VAT)
    subtotal = bookingFormTotal;
    // Add VAT to get total
    totalAmount = subtotal + (subtotal * vatRate) / 100;
    vatAmount = totalAmount - subtotal;
  } else {
    // Fallback calculation
    const baseSubtotal = Number(basePrice || 0);
    const convertedRoomPrice = baseSubtotal * conversionRate;
    subtotal = convertedRoomPrice * nights * rooms;
    vatAmount = subtotal * (vatRate / 100);
    totalAmount = subtotal + vatAmount;
  }

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: userCurrency || "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Get user info for guest details
  const [updatedUser, setUpdatedUser] = useState({
    name: guestInfo.fullName || user?.name || bookingData?.user?.fullName || "",
    email: guestInfo.email || user?.email || bookingData?.user?.email || "",
    phone:
      guestInfo.phone || user?.phone || bookingData?.user?.contactNumber || "",
    address:
      guestInfo.country || user?.address || bookingData?.user?.country || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({ ...prev, [name]: value }));
  };

  // ---------- CONFIRM BOOKING ----------
  const handleReserveConfirm = async () => {
    if (!bookingData?.roomId) return handleError("Room info missing");
    if (!bookingData?.hotelId) return handleError("Hotel info missing");
    if (!user) return;

    setIsProcessing(true);

    try {
      const toYMD = (d) => new Date(d).toISOString().slice(0, 10);

      const bookingPayload = {
        roomId: bookingData.roomId,
        hotelId: bookingData.hotelId,
        userId: user.id || bookingData.user?._id,
        partnerId: bookingData.partnerId,
        rooms,
        adults: Number(bookingData.adults || 1),
        children: Number(bookingData.children || 0),
        bookedFromDate: toYMD(
          bookingData.bookedFromDate || bookingData.checkIn
        ),
        bookedToDate: toYMD(bookingData.bookedToDate || bookingData.checkOut),
        totalPrice: totalAmount,
        convertedPrice: subtotal / nights / rooms,
        displayCurrency: userCurrency,
        specialRequest: bookingData.specialRequest || null,
        bookingStatus: bookingData.bookingStatus || "PENDING",
        category: bookingData.roomType || "Standard",
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address || "Not provided",
      };

      const paymentData = {
        bookingPayload,
        hotelName: bookingData.hotelName,
        location: bookingData.location,
        roomType: bookingData.roomType,
        cancelationPolicy: bookingData.cancelationPolicy,
        roomPrice: bookingData.roomPrice,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        nights,
        adults: bookingData.adults,
        children: bookingData.children || 0,
        rooms,
        vat: vatRate,
        subtotal,
        vatAmount,
        total: totalAmount,
        discountedPrice: 0,
        serviceFee: 0,
        isRefundable: bookingData.isRefundable || false,
        user: {
          ...user,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          country: updatedUser.address || user?.country || "Bangladesh",
        },
      };

      handleSuccess("Proceeding to payment...");

      navigate(`/hotel/payment-confirm`, {
        state: {
          bookingData: bookingPayload,
          data: paymentData,
        },
        replace: true,
      });
    } catch (err) {
      const msg =
        err?.data?.message || err?.message || "Failed to proceed to payment";
      handleError(msg);
    }

    setIsProcessing(false);
  };

  const handleBackToBooking = () => navigate("/hotel");

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // ---------- UI ----------
  return (
    <div className="min-h-screen items-center bg-gray-50 py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBackToBooking}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SECTION */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>

              {/* GUEST INFO */}
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h3 className="text-md font-medium mb-3">
                  Personal Information
                </h3>

                <form className="space-y-4">
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                      <User className="w-4 h-4" /> <span>Full Name</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={updatedUser.name}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                      <Mail className="w-4 h-4" /> <span>Email</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={updatedUser.email}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                      <Phone className="w-4 h-4" /> <span>Phone</span>
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={updatedUser.phone}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                      <MapPin className="w-4 h-4" /> <span>Country</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={updatedUser.address}
                      readOnly
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    />
                  </div>
                </form>
              </div>

              {/* HOTEL INFO */}
              <div className="flex items-start space-x-4">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">
                    {bookingData.hotelName}
                  </h3>
                  <p className="text-gray-600">{bookingData.location}</p>
                </div>
              </div>

              {/* DATES */}
              <div className="flex items-center space-x-4 mt-4">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-gray-900">
                    {formatDate(bookingData.checkIn)} -{" "}
                    {formatDate(bookingData.checkOut)}
                  </p>
                  <p className="text-gray-600">{bookingData.nights} nights</p>
                </div>
              </div>

              {/* GUESTS */}
              <div className="flex items-center space-x-4 mt-4">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-gray-900">
                    {bookingData.adults}{" "}
                    {bookingData.adults > 1 ? "adults" : "adult"}
                    {bookingData.children > 0 &&
                      `, ${bookingData.children} ${
                        bookingData.children > 1 ? "children" : "child"
                      }`}
                  </p>
                  <p className="text-gray-600">
                    {bookingData.rooms}{" "}
                    {bookingData.rooms > 1 ? "rooms" : "room"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold mb-4">Price Summary</h3>

              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>
                    {userCurrency} {(subtotal / nights / rooms).toFixed(2)} ×{" "}
                    {nights} nights × {rooms}
                  </span>
                  <span>
                    {userCurrency} {subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>VAT (5%)</span>
                  <span>
                    {userCurrency} {(totalAmount - subtotal).toFixed(2)}
                  </span>
                </div>

                <div className="border-t pt-3 mt-3 font-semibold text-lg flex justify-between">
                  <span>Total</span>
                  <span>
                    {userCurrency} {totalAmount.toFixed(2)}
                  </span>
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  Includes VAT & all applicable taxes
                </p>
              </div>

              <button
                onClick={handleReserveConfirm}
                disabled={isProcessing || isLoading}
                className={`w-full mt-6 py-3 text-white rounded-lg font-medium ${
                  isProcessing || isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-700 hover:bg-blue-800"
                }`}
              >
                {isProcessing || isLoading ? "Processing..." : "Continue"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
