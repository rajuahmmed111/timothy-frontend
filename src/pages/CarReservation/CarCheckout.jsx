import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { useCreateCarBookingMutation } from "../../redux/api/car/carApi";
import { handleError, handleSuccess } from "./../../../toast";
import { currencyByCountry } from "../../components/curenci";

export default function CarCheckout() {
  const location = useLocation();
  const navigate = useNavigate();

  const guest = location.state?.guestInfo || {};
  const rawState = location.state ?? null;
  const bookingDetails =
    rawState?.bookingDetails ?? rawState?.bookingData ?? rawState ?? null;

  const user = useSelector((state) => state?.auth?.user);
  const accessToken = useSelector((state) => state?.auth?.accessToken);

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
          }

          setConversionRate(rate);
        } else {
          setUserCurrency("USD");
          setConversionRate(1);
        }
      } catch (e) {
        setUserCurrency("USD");
        setConversionRate(1);
      }
    };

    detect();
  }, [bookingDetails]);

  const decodedUserInfo = useMemo(() => {
    if (!accessToken) return null;
    try {
      const decoded = jwtDecode(accessToken);
      return { ...user, ...decoded, token: accessToken };
    } catch (error) {
      return null;
    }
  }, [accessToken, user]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [modalTimer, setModalTimer] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [createdBookingId, setCreatedBookingId] = useState(null);
  const [createCarBooking] = useCreateCarBookingMutation();

  const days = useMemo(() => {
    if (!bookingDetails?.pickupDate || !bookingDetails?.returnDate) return 1;

    const start = new Date(bookingDetails.pickupDate);
    const end = new Date(bookingDetails.returnDate);

    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [bookingDetails]);

  /* PRICE CALCULATIONS */
  const carPrice = useMemo(() => {
    if (!bookingDetails) return 0;

    // Use converted price if available, otherwise convert base price
    let price = Number(
      bookingDetails.unitPrice || bookingDetails.pricePerDay || 0
    );

    // If we have base price and conversion rate, convert it
    if (bookingDetails.basePrice && conversionRate && userCurrency) {
      price = Number(bookingDetails.basePrice * conversionRate).toFixed(2);
    }

    // If total is provided and greater than 0, calculate per-day price
    const totalValue = Number(bookingDetails.total || 0);
    const daysCount = days || 1;
    if (totalValue > 0) {
      price = totalValue / daysCount;
    }

    return price;
  }, [bookingDetails, days, conversionRate, userCurrency]);

  const displayVat = useMemo(() => {
    return (carPrice * days * 0.05).toFixed(2);
  }, [carPrice, days]);

  const displayFinalTotal = useMemo(() => {
    return (carPrice * days + Number(displayVat)).toFixed(2);
  }, [carPrice, days, displayVat]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  /* -------------------------------------------------------------------------- */
  /*                          🔹 USER INFO HANDLING                             */
  /* -------------------------------------------------------------------------- */
  const [updatedUser, setUpdatedUser] = useState({
    name:
      guest.fullName ||
      user?.fullName ||
      user?.name ||
      bookingDetails?.user?.fullName ||
      decodedUserInfo?.name ||
      "",
    email:
      guest.email ||
      user?.email ||
      bookingDetails?.user?.email ||
      decodedUserInfo?.email ||
      "",

    contactNo:
      guest.contactNo ||
      user?.contactNo ||
      user?.contactNumber ||
      bookingDetails?.user?.contactNo ||
      decodedUserInfo?.contactNo ||
      "",
    address:
      guest?.country ||
      user?.country ||
      bookingDetails?.user?.country ||
      bookingDetails?.carCountry ||
      decodedUserInfo?.country ||
      guest.address ||
      user?.address ||
      bookingDetails?.user?.address ||
      decodedUserInfo?.address ||
      "",
    country:
      guest?.country ||
      user?.country ||
      bookingDetails?.user?.country ||
      bookingDetails?.carCountry ||
      decodedUserInfo?.country ||
      "",
  });

  const userInfo = {
    id:
      user?.id ||
      user?._id ||
      decodedUserInfo?.id ||
      bookingDetails?.user?.id ||
      null,
    name: updatedUser?.name,
    email: updatedUser?.email,
    phone: updatedUser?.phone,
    contactNo: updatedUser?.contactNo,
    address: updatedUser?.address,
    country: updatedUser?.country,
  };

  const handleUpdatedUserChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleBackToBooking = () => navigate(-1);

  /* -------------------------------------------------------------------------- */
  /*                     🔹 CONTINUE TO PAYMENT (BOOKING)                       */
  /* -------------------------------------------------------------------------- */
  // inside CarCheckout.jsx

  const handleContinueToPayment = async () => {
    if (!bookingDetails?.carId) {
      handleError("Unable to proceed: missing car selection.");
      return;
    }

    setIsProcessing(true);

    try {
      // Create a temporary booking ID for navigation
      const tempBookingId = `temp_car_${Date.now()}_${bookingDetails.carId}`;

      // Prepare data to pass to payment page (no booking creation)
      const paymentData = {
        ...bookingDetails,
        tempBookingId,
        user: updatedUser,
        userInfo,

        // Price information
        carPrice,
        displayVat: Number(displayVat),
        displayFinalTotal: Number(displayFinalTotal),
        days,

        // Currency information
        userCurrency,
        userCountry,
        conversionRate,
        displayCurrency:
          userCurrency ||
          bookingDetails.displayCurrency ||
          bookingDetails.currency ||
          "USD",
      };

      handleSuccess("Proceeding to payment!");

      // Navigate to payment page with user info and car details
      navigate("/car/payment", {
        state: {
          bookingDetails: paymentData,
        },
      });
    } catch (error) {
      const msg =
        error?.data?.message ||
        error?.message ||
        "Failed to proceed to payment";
      handleError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* HEADER */}
        <div className="my-10 flex items-center justify-start">
          <button
            onClick={handleBackToBooking}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-8 h-8 mr-2" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        {!bookingDetails ? (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <p className="text-gray-700 mb-4">No booking details found.</p>
            <button
              onClick={handleBackToBooking}
              className="bg-[#0064D2] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0053ad]"
            >
              Go Back
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT SECTION — USER INFO + BOOKING SUMMARY */}
            <div className="lg:col-span-2 space-y-5 bg-white rounded-xl shadow-sm p-5">
              {/* Guest Info Form */}
              <div className="bg-blue-50 rounded-lg p-5">
                <h2 className="text-xl font-semibold mb-5">
                  Guest Information
                </h2>

                <form className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={updatedUser.name}
                      onChange={handleUpdatedUserChange}
                      className="mt-1 w-full rounded-md border p-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={updatedUser.email}
                      onChange={handleUpdatedUserChange}
                      className="mt-1 w-full rounded-md border p-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      name="contactNo"
                      value={updatedUser.contactNo}
                      onChange={handleUpdatedUserChange}
                      className="mt-1 w-full rounded-md border p-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={updatedUser.address}
                      onChange={handleUpdatedUserChange}
                      className="mt-1 w-full rounded-md border p-2"
                    />
                  </div>
                </form>
              </div>

              {/* Booking Summary */}
              <div>
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">Car Model</span>
                    <span className="font-medium text-gray-900">
                      {bookingDetails.carName}
                    </span>
                  </div>

                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">Pickup Location</span>
                    <span className="font-medium text-gray-900">
                      {bookingDetails.location}
                    </span>
                  </div>

                  <div className="py-3 border-b space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Pickup Date</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(bookingDetails.pickupDate)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Return Date</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(bookingDetails.returnDate)}
                      </span>
                    </div>

                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-sm text-gray-500">Duration</span>
                      <span className="font-medium text-gray-900">
                        {days} {days === 1 ? "day" : "days"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SECTION – PRICE SUMMARY */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Price Summary
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {userCurrency ||
                        bookingDetails.displayCurrency ||
                        bookingDetails.currency}{" "}
                      {Number(carPrice).toLocaleString()} × {days}{" "}
                      {days === 1 ? "day" : "days"}
                    </span>
                    <span className="text-gray-900">
                      {userCurrency ||
                        bookingDetails.displayCurrency ||
                        bookingDetails.currency}{" "}
                      {Number(carPrice * days).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">VAT 5%</span>
                    <span className="text-gray-900">
                      {userCurrency ||
                        bookingDetails.displayCurrency ||
                        bookingDetails.currency}{" "}
                      {Number(displayVat).toLocaleString()}
                    </span>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">
                        Total Amount
                      </span>
                      <span className="text-lg font-semibold">
                        {userCurrency ||
                          bookingDetails.displayCurrency ||
                          bookingDetails.currency}{" "}
                        {Number(displayFinalTotal).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleContinueToPayment}
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
        )}
      </div>

      {/* Booking Confirmation Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Car Booking Confirmed!
              </h3>
              <p className="text-gray-600 mb-2">
                Your car booking has been successfully created. Booking ID:{" "}
                {createdBookingId}
              </p>
              <p className="text-sm text-blue-600 font-medium">
                Redirecting to payment in {countdown}...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
