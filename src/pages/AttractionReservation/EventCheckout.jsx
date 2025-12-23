import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCreateAttractionBookingMutation } from "../../redux/api/attraction/attractionApi";
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
import { handleError, handleSuccess } from "../../../toast";
import { currencyByCountry } from "../../components/curenci";

export default function EventCheckout() {
  const location = useLocation();
  const [createAttractionBooking] = useCreateAttractionBookingMutation();
  const navigate = useNavigate();
  const user = useSelector((state) => state?.auth?.user);
  const raw = location.state || {};
  const bookingDetails =
    raw.bookingDetails ||
    raw.bookingData ||
    raw.payload ||
    raw.data?.data ||
    raw.data ||
    raw.resp?.data ||
    raw.resp ||
    raw.payload?.data ||
    {};
  const guestInfo = location.state?.guestInfo || {};
  const [isProcessing, setIsProcessing] = useState(false);
  const cancelationPolicy = bookingDetails?.cancelationPolicy;
  // Currency detection states
  const [userCurrency, setUserCurrency] = useState(
    bookingDetails?.userCurrency || "USD"
  );
  const [userCountry, setUserCountry] = useState(
    bookingDetails?.userCountry || null
  );
  const [conversionRate, setConversionRate] = useState(
    bookingDetails?.conversionRate || 1
  );

  // Currency detection effect (only if not provided from booking details)
  React.useEffect(() => {
    if (bookingDetails?.userCurrency && bookingDetails?.conversionRate) {
      return;
    }

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
        console.error("EventCheckout: Detection or conversion failed:", e);
        setUserCurrency("USD");
        setConversionRate(1);
      }
    };

    detect();
  }, [bookingDetails]);
  const unitPrice = Number(bookingDetails?.unitPrice || 0);
  const guestCount = Number(bookingDetails?.guests || 1);
  const total = Number(bookingDetails?.total || unitPrice * guestCount);
  const currencyLabel = userCurrency || bookingDetails?.displayCurrency || "";
  const adultCount = Number(
    bookingDetails?.adults ?? bookingDetails?.guests ?? 1
  );
  const childCount = Number(bookingDetails?.children ?? 0);

  let finalAdultPrice = Number(
    bookingDetails?.convertedAdultPrice ?? unitPrice
  );
  let finalChildPrice = Number(
    bookingDetails?.convertedChildPrice ?? finalAdultPrice
  );
  let finalTotal = Number(
    bookingDetails?.total ||
      finalAdultPrice * adultCount + finalChildPrice * childCount
  );

  // Calculate VAT (5%)
  const vatRate = 0.05;
  const subtotal = finalTotal;
  const vatAmount = subtotal * vatRate;
  const totalWithVat = subtotal + vatAmount;

  if (bookingDetails?.baseAdultPrice && conversionRate && userCurrency) {
    const baseCurrency = bookingDetails?.baseCurrency || "NGN";

    if (baseCurrency === "NGN" && userCurrency === "USD") {
      const ngnToUsdRate = 1 / 1515;
      finalAdultPrice = Number(bookingDetails.baseAdultPrice * ngnToUsdRate);
      finalChildPrice = Number(bookingDetails.baseChildPrice * ngnToUsdRate);
    } else if (baseCurrency === "USD") {
      finalAdultPrice = Number(bookingDetails.baseAdultPrice * conversionRate);
      finalChildPrice = Number(bookingDetails.baseChildPrice * conversionRate);
    } else if (userCurrency === "USD") {
      finalAdultPrice = Number(bookingDetails.baseAdultPrice / conversionRate);
      finalChildPrice = Number(bookingDetails.baseChildPrice / conversionRate);
    } else {
      finalAdultPrice = Number(bookingDetails.baseAdultPrice * conversionRate);
      finalChildPrice = Number(bookingDetails.baseChildPrice * conversionRate);
    }

    finalTotal = finalAdultPrice * adultCount + finalChildPrice * childCount;

    // Recalculate VAT with updated total
    const updatedSubtotal = finalTotal;
    const updatedVatAmount = updatedSubtotal * vatRate;
    finalTotal = updatedSubtotal + updatedVatAmount;
  }

  const convertedAdultPrice = finalAdultPrice;
  const convertedChildPrice = finalChildPrice;
  const deriveGuest = () => ({
    name:
      guestInfo?.name ||
      guestInfo?.fullName ||
      bookingDetails?.user?.name ||
      bookingDetails?.user?.fullName ||
      user?.name ||
      user?.fullName ||
      "",
    email: guestInfo?.email || bookingDetails?.user?.email || user?.email || "",
    contactNo:
      guestInfo?.contactNo ||
      guestInfo?.phone ||
      guestInfo?.contactNumber ||
      bookingDetails?.user?.contactNo ||
      bookingDetails?.user?.phone ||
      bookingDetails?.user?.contactNumber ||
      user?.contactNo ||
      user?.phone ||
      user?.contactNumber ||
      "",
    address:
      guestInfo?.address ||
      guestInfo?.country ||
      bookingDetails?.user?.address ||
      bookingDetails?.user?.country ||
      user?.address ||
      user?.country ||
      "",
  });

  const [updatedUser, setUpdatedUser] = useState(deriveGuest());

  React.useEffect(() => {
    setUpdatedUser(deriveGuest());
  }, [
    JSON.stringify(guestInfo),
    JSON.stringify(bookingDetails?.user),
    JSON.stringify(user),
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReserveConfirm = async () => {
    if (!bookingDetails || !bookingDetails?.bookingId) {
      handleError("Booking information is missing");
      return;
    }

    if (!user) {
      handleError("Please sign in to confirm your booking");
      return;
    }

    const attractionId =
      bookingDetails.appealId || bookingDetails.bookingId || bookingDetails.id;
    if (!attractionId) {
      handleError("Event identifier is missing");
      return;
    }

    setIsProcessing(true);
    try {
      // Create a temporary booking ID for navigation
      const tempBookingId = `temp_${Date.now()}_${attractionId}`;

      // Create booking data object with user and event information
      const bookingData = {
        id: tempBookingId,
        ...bookingDetails,
        user: updatedUser,
        status: "pending_payment",
        createdAt: new Date().toISOString(),
        isTemporary: true,
      };

      handleSuccess("Proceeding to payment confirmation!");
      navigate("/event/payment-confirm/" + encodeURIComponent(tempBookingId), {
        state: {
          data: bookingData,
          bookingDetails,
          userInfo: updatedUser,
        },
      });
    } catch (error) {
      const msg =
        error?.data?.message || error?.message || "Failed to create booking";
      handleError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToBooking = () => {
    navigate(-1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
                      placeholder="Full name"
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
                      placeholder="Email address"
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                      <Phone className="w-4 h-4" /> <span>Contact Number</span>
                    </label>
                    <input
                      type="text"
                      name="contactNo"
                      value={updatedUser.contactNo}
                      onChange={handleInputChange}
                      placeholder="Contact number"
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                      <MapPin className="w-4 h-4" /> <span>Address</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={updatedUser.address}
                      readOnly
                      placeholder="Address / Country"
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm outline-none p-2 border"
                    />
                  </div>
                </form>
              </div>

              {/* Event Info */}
              <div className="flex items-start gap-4">
                {bookingDetails?.image && (
                  <img
                    src={bookingDetails.image}
                    alt={bookingDetails.eventName || "Event"}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium text-gray-900 truncate">
                      {bookingDetails.eventName || "Selected Event"}
                    </h3>
                  </div>
                  <p className="text-gray-600 mt-1">
                    {bookingDetails.location}
                  </p>
                </div>
              </div>

              {/* Dates */}
              <div className="flex items-center space-x-4 mt-4">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-gray-900">
                    {formatDate(bookingDetails.selectedDate)}
                  </p>
                  <p className="text-gray-600">{bookingDetails.selectedTime}</p>
                </div>
              </div>

              {/* Guests */}
              <div className="flex items-center space-x-4 mt-4">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-gray-900">
                    {guestCount || 1} {guestCount === 1 ? "guest" : "guests"}
                  </p>
                  <p className="text-gray-600">
                    {`Adults: ${
                      (bookingDetails?.adults ?? guestCount) || 1
                    } | Children: ${bookingDetails?.children ?? 0}`}
                  </p>
                  <p className="text-gray-600">
                    {bookingDetails?.eventName || "Event booking"}
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
                {/* Adults line */}
                <div className="flex justify-between">
                  <span>
                    {currencyLabel}{" "}
                    {Number(convertedAdultPrice).toLocaleString()} ×{" "}
                    {adultCount} adult
                    {adultCount === 1 ? "" : "s"}
                  </span>
                  <span>
                    {currencyLabel}{" "}
                    {Number(convertedAdultPrice * adultCount).toLocaleString()}
                  </span>
                </div>

                {/* Children line */}
                {childCount > 0 && (
                  <div className="flex justify-between">
                    <span>
                      {currencyLabel}{" "}
                      {Number(convertedChildPrice).toLocaleString()} ×{" "}
                      {childCount} child
                      {childCount === 1 ? "" : "ren"}
                    </span>
                    <span>
                      {currencyLabel}{" "}
                      {Number(
                        convertedChildPrice * childCount
                      ).toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="border-t pt-3 mt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>VAT (5%)</span>
                    <span>
                      {currencyLabel} {Number(vatAmount).toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t pt-2 mt-2 font-semibold text-lg flex justify-between">
                    <span>Total (incl. VAT)</span>
                    <span>
                      {currencyLabel} {Number(finalTotal).toLocaleString()}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  All prices include 5% VAT
                </p>
              </div>

              <button
                onClick={handleReserveConfirm}
                disabled={isProcessing}
                className={`w-full mt-6 py-3 text-white rounded-lg font-medium ${
                  isProcessing
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-700 hover:bg-blue-800"
                }`}
              >
                {isProcessing ? "Processing..." : "Continue"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
