import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
import { setCredentials } from "../../redux/features/auth/authSlice";
import { handleError, handleSuccess } from "../../../toast";
import { currencyByCountry } from "../../components/curenci";

export default function Checkout() {
  const [userCurrency, setUserCurrency] = useState("USD");
  const [userCountry, setUserCountry] = useState(null);
  const [conversionRate, setConversionRate] = useState(1);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.auth?.user);
  const bookingData = location.state?.bookingData || {};
  console.log("Booking Data:", bookingData);
  const guestInfo = location.state?.guestInfo || {};

  const [isProcessing, setIsProcessing] = useState(false);
  const [createHotelBooking, { isLoading }] = useCreateHotelBookingMutation();

  // Currency detection and conversion
  const basePrice = bookingData?.roomPrice ?? bookingData?.total ?? 0;
  const baseCurrency = bookingData?.displayCurrency ?? "USD";
  console.log("basePrice", basePrice, "baseCurrency", baseCurrency);

  useEffect(() => {
    const detect = async () => {
      try {
        console.log("Starting currency detection...");
        const res = await fetch("https://api.country.is/");
        const data = await res.json();
        console.log("Location API response:", data);
        const country = data.country;
        console.log("Detected country:", country);

        if (country && currencyByCountry[country]) {
          console.log("Country found in mapping:", country);
          setUserCountry(country);
          const userCurr = currencyByCountry[country].code;
          console.log("User currency code:", userCurr);
          setUserCurrency(userCurr);

          // Fetch conversion: baseCurrency → user's currency
          let rate = 1;

          if (baseCurrency !== userCurr) {
            console.log("Converting from", baseCurrency, "to", userCurr);
            const rateRes = await fetch(
              "https://open.er-api.com/v6/latest/USD"
            );
            const rateData = await rateRes.json();
            console.log("Exchange rate data:", rateData);

            if (rateData?.rates) {
              const baseToUSD =
                baseCurrency === "USD" ? 1 : 1 / rateData.rates[baseCurrency];
              const usdToUser = rateData.rates[userCurr] || 1;
              rate = baseToUSD * usdToUser;
              console.log("Calculated conversion rate:", rate);
            }
          } else {
            console.log("No conversion needed - same currency");
          }

          setConversionRate(rate);
        } else {
          console.log(
            "Country not found in mapping or country detection failed"
          );
          console.log("Available currencies:", Object.keys(currencyByCountry));
        }
      } catch (e) {
        console.error("Detection or conversion failed:", e);
        setUserCurrency("USD");
        setConversionRate(1);
      }
    };

    detect();
  }, [baseCurrency]);

  const safeGuests = {
    adults: bookingData?.adults || 1,
    children: bookingData?.children || 0,
    rooms: bookingData?.rooms || 1,
  };

  const vatRate = Number(bookingData?.vat) || 5;

  // Use converted prices for calculations
  const baseSubtotal = Number(
    bookingData.convertedPrice || bookingData.total || 0
  );
  const subtotal =
    baseSubtotal *
    conversionRate *
    (bookingData.nights || 1) *
    safeGuests.rooms;

  const vatAmount = subtotal * (vatRate / 100);
  const discountAmount =
    Number(bookingData.discountedPrice || 0) * conversionRate;
  const serviceFee = Number(bookingData.serviceFee || 0) * conversionRate;
  const totalAmount = subtotal + vatAmount - discountAmount + serviceFee;

  // Price converted for display
  const convertedDisplayPrice = Number(baseSubtotal * conversionRate).toFixed(
    2
  );
  console.log("Conversion details:", {
    baseSubtotal,
    baseCurrency,
    userCurrency,
    conversionRate,
    convertedDisplayPrice,
    totalAmount,
  });

  const [updatedUser, setUpdatedUser] = useState({
    name: guestInfo.fullName || user?.name || bookingData?.user?.fullName || "",
    email: guestInfo.email || user?.email || bookingData?.user?.email || "",
    phone:
      guestInfo.phone || user?.phone || bookingData?.user?.contactNumber || "",
    address:
      guestInfo.country || user?.address || bookingData?.user?.country || "",
  });

  console.log("Guest Info:", guestInfo);
  console.log("Updated User:", updatedUser);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReserveConfirm = async () => {
    if (!bookingData?.roomId) {
      handleError("Room information is missing");
      return;
    }
    if (!bookingData?.hotelId) {
      handleError("Hotel information is missing");
      return;
    }
    if (!user) return;

    setIsProcessing(true);

    try {
      // Required fields filled properly
      const toYMD = (d) => new Date(d).toISOString().slice(0, 10);

      const bookingPayload = {
        roomId: bookingData.roomId,
        hotelId: bookingData.hotelId,
        userId: user.id || bookingData.user?._id,
        partnerId: bookingData.partnerId,
        rooms: Number(bookingData.rooms ?? 1),
        adults: Number(bookingData.adults ?? 1),
        children: Number(bookingData.children ?? 0),
        bookedFromDate: toYMD(
          bookingData.bookedFromDate || bookingData.checkIn
        ),
        bookedToDate: toYMD(bookingData.bookedToDate || bookingData.checkOut),
        totalPrice: Number(totalAmount || 0),
        convertedPrice: Number(baseSubtotal * conversionRate || 0),
        displayCurrency: userCurrency || "USD",
        discountedPrice: Number(discountAmount || 0),
        specialRequest: bookingData.specialRequest || null,
        bookingStatus: bookingData.bookingStatus || "PENDING",
        category: bookingData.roomType || "Standard",
        name: updatedUser.name || user.name,
        email: updatedUser.email || user.email,
        phone: updatedUser.phone || user.phone,
        address: updatedUser.address || "Not provided",
      };

      console.log("Booking payload sent to API:", bookingPayload);

      const res = await createHotelBooking({
        bookingId: bookingData.roomId, // API expects roomId in URL
        data: bookingPayload,
      }).unwrap();
      console.log("res", res);

      // Get the created booking ID from the response
      const createdBookingId =
        res.data?._id || res.data?.id || res._id || res.id;

      if (!createdBookingId) {
        console.error("No booking ID in response:", res);
        toast.error(
          "Booking was created but could not retrieve booking reference. Please check your bookings."
        );
        return;
      }

      // Combine API response with existing booking data
      const paymentData = {
        ...res,

        hotelName: bookingData.hotelName,
        location: bookingData.location,
        roomType: bookingData.roomType,
        cancelationPolicy: bookingData.cancelationPolicy,
        roomPrice: bookingData.roomPrice,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        nights: bookingData.nights,
        adults: bookingData.adults,
        children: bookingData.children || 0,
        rooms: bookingData.rooms || 1,
        vat: bookingData.vat || vatRate,
        subtotal,
        vatAmount,
        total: totalAmount,
        discountedPrice: discountAmount,
        serviceFee,
        isRefundable: bookingData.isRefundable || false,
        user: {
          ...res.user,
          name: updatedUser.name || user?.name,
          email: updatedUser.email || user?.email,
          phone: updatedUser.phone || user?.phone,
          country: updatedUser.address || user?.country || "Bangladesh",
        },
      };

      handleSuccess("Room reserved successfully!");
      navigate(
        `/hotel/payment-confirm?bookingId=${encodeURIComponent(
          createdBookingId
        )}`,
        {
          state: {
            data: {
              ...paymentData,
              createdBookingId, // Include the booking ID in state as well
            },
          },
          replace: true, // Replace current entry in history
        }
      );
    } catch (e) {
      const msg = e?.data?.message || e?.message || "Failed to create booking";
      if (msg.toLowerCase().includes("already booked")) {
        handleError("This hotel is already booked for the selected dates");
      } else {
        handleError(msg);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToBooking = () => {
    navigate("/hotel");
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

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
          {/* Left section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>

              {/* Guest Info */}
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h3 className="text-md font-medium mb-3">Guest Information</h3>
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
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
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
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
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
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
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
                      className="mt-1 w-full outline-none select-none  rounded-md border-gray-300 shadow-sm p-2 border"
                    />
                  </div>
                </form>
              </div>

              {/* Hotel Info */}
              <div className="flex items-start space-x-4">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">
                    {bookingData.hotelName}
                  </h3>
                  <p className="text-gray-600">{bookingData.location}</p>
                </div>
              </div>

              {/* Dates */}
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

              {/* Guests */}
              <div className="flex items-center space-x-4 mt-4">
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
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold mb-4">Price Summary</h3>

              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>
                    {userCurrency} {convertedDisplayPrice}× {bookingData.nights}{" "}
                    nights × {safeGuests.rooms}
                  </span>
                  <span>
                    {userCurrency} {subtotal.toFixed(2)}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>
                      {userCurrency} {discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>VAT ({vatRate}%)</span>
                  <span>
                    {userCurrency} {vatAmount.toFixed(2)}
                  </span>
                </div>

                {serviceFee > 0 && (
                  <div className="flex justify-between">
                    <span>Service Fee</span>
                    <span>
                      {userCurrency} {serviceFee.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="border-t pt-3 mt-3 font-semibold text-lg flex justify-between">
                  <span>Total</span>
                  <span>
                    {userCurrency} {totalAmount.toFixed(2)}
                  </span>
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  Includes VAT and all applicable taxes
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
