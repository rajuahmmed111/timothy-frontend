import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { useCreateSecurityBookingMutation } from "../../redux/api/security/securityBookingApi";
import { handleError, handleSuccess } from "../../../toast";
import { currencyByCountry } from "../../components/curenci";

export default function SecurityCheckout() {
  const [userCurrency, setUserCurrency] = useState("USD");
  const [userCountry, setUserCountry] = useState(null);
  const [conversionRate, setConversionRate] = useState(1);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state?.auth?.user);

  console.log("userinfo form security", user);

  // Accept data from multiple shapes
  const raw = location.state || {};
  console.log("SecurityCheckout raw state:", raw);

  const bookingDetails =
    raw.payload ||
    raw.bookingData ||
    raw.data?.data ||
    raw.data ||
    raw.resp?.data ||
    raw.resp ||
    raw.payload?.data ||
    {};

  console.log("SecurityCheckout bookingDetails:", bookingDetails);
  console.log("SecurityCheckout guard info:", {
    guardId: bookingDetails?.guardId,
    guardName: bookingDetails?.guardName,
    serviceType: bookingDetails?.serviceType,
    pricePerDay: bookingDetails?.pricePerDay,
    convertedPrice: bookingDetails?.convertedPrice,
    displayCurrency: bookingDetails?.displayCurrency,
  });

  // Fallback guard info if missing
  const guardInfo = {
    guardId:
      bookingDetails?.guardId || bookingDetails?.id || bookingDetails?._id,
    guardName:
      bookingDetails?.guardName ||
      bookingDetails?.securityGuardName ||
      bookingDetails?.securityName ||
      bookingDetails?.name ||
      "Security Guard",
    serviceType: bookingDetails?.serviceType || "Security",
    serviceDescription:
      bookingDetails?.serviceDescription || "Professional security service",
    startDate:
      bookingDetails?.startDate || bookingDetails?.securityBookedFromDate,
    endDate: bookingDetails?.endDate || bookingDetails?.securityBookedToDate,
    personnelCount:
      bookingDetails?.personnelCount || bookingDetails?.number_of_security || 1,
    photo:
      bookingDetails?.photo || bookingDetails?.guardPhoto || "/placeholder.svg",
  };

  console.log("Final guard info:", guardInfo);

  const guestInfo = raw.guestInfo || {};

  const [createSecurityBooking, { isLoading }] =
    useCreateSecurityBookingMutation();

  const [isProcessing, setIsProcessing] = useState(false);

  // Currency detection and conversion
  const baseCurrency =
    bookingDetails?.currency || bookingDetails?.displayCurrency || "USD";
  const basePrice =
    bookingDetails?.pricePerDay || bookingDetails?.convertedPrice || 0;

  console.log(
    "Security checkout basePrice",
    basePrice,
    "baseCurrency",
    baseCurrency
  );

  useEffect(() => {
    const detect = async () => {
      try {
        console.log("Starting currency detection for security checkout...");
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
          console.log("Country not found in mapping, using USD");
          setUserCurrency("USD");
          setConversionRate(1);
        }
      } catch (e) {
        console.error("Detection or conversion failed:", e);
        setUserCurrency("USD");
        setConversionRate(1);
      }
    };

    detect();
  }, [baseCurrency]);

  // =============================
  // Calculate Days
  // =============================
  const days = (() => {
    const start = bookingDetails?.startDate
      ? new Date(bookingDetails.startDate)
      : null;
    const end = bookingDetails?.endDate
      ? new Date(bookingDetails.endDate)
      : null;

    if (!start || !end) return 1;

    const diff = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    return diff > 0 ? diff : 1;
  })();

  // =============================
  // CONVERTED PRICE CALCULATION
  // =============================

  // fallback values (price always comes)
  const pricePerDay =
    Number(bookingDetails?.pricePerDay) ||
    Number(bookingDetails?.securityPriceDay) ||
    Number(bookingDetails?.unitPrice) ||
    Number(bookingDetails?.convertedPrice) ||
    0;

  const personnelCount = Number(guardInfo.personnelCount || 1);

  // Convert price to user's currency
  const convertedPricePerDay = Number(pricePerDay * conversionRate).toFixed(2);

  // Always fresh subtotal with converted prices
  const calculatedSubtotal =
    Number(convertedPricePerDay) * days * personnelCount;

  // Static 5% VAT
  const vatRate = 5;
  const vatAmount = Number((calculatedSubtotal * 0.05).toFixed(2));

  // Final Total = subtotal + VAT
  const finalTotal = Number((calculatedSubtotal + vatAmount).toFixed(2));

  console.log("💰 Security checkout conversion details:", {
    basePrice: pricePerDay,
    baseCurrency,
    userCurrency,
    conversionRate,
    convertedPricePerDay,
    calculatedSubtotal,
    vatAmount,
    finalTotal,
  });

  // =============================
  // Guest Information
  // =============================
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
    phone:
      guestInfo?.phone ||
      guestInfo?.contactNumber ||
      bookingDetails?.user?.phone ||
      bookingDetails?.user?.contactNumber ||
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
    setUpdatedUser((prev) => ({ ...prev, [name]: value }));
  };

  // =============================
  // Confirm Booking
  // =============================
  const handleReserveConfirm = async () => {
    // Use the actual security protocol ID from booking details
    if (!bookingDetails?.guardId) {
      handleError("Guard information is missing");
      return;
    }
    if (!user) return;

    setIsProcessing(true);

    try {
      const body = {
        // Booking Info
        number_of_security:
          bookingDetails?.number_of_security ??
          bookingDetails?.personnelCount ??
          1,

        securityBookedFromDate:
          bookingDetails?.securityBookedFromDate || bookingDetails?.startDate,

        securityBookedToDate:
          bookingDetails?.securityBookedToDate || bookingDetails?.endDate,

        // TOTAL PRICE ALWAYS SUBTOTAL + VAT (using converted prices)
        totalPrice: finalTotal,
        vatAmount: vatAmount,
        vatRate: 5,

        // Use converted prices and user currency
        convertedPrice: Number(convertedPricePerDay),
        displayCurrency: userCurrency,
        currency: userCurrency,

        discountedPrice: bookingDetails?.discountedPrice ?? 0,
        cancelationPolicy: bookingDetails?.cancellationPolicy,

        // Identification - Use security protocol ID (the actual guard entry)
        guardId: bookingDetails?.guardId, // This should be "6918e5fcc17c4e67050efc64" for Danny Khan
        guardName: bookingDetails?.guardName,
        serviceType: bookingDetails?.serviceType || "Security",
        serviceDescription: bookingDetails?.serviceDescription,
        pricePerDay: Number(convertedPricePerDay),

        // Contact / User
        name: updatedUser?.name,
        email: updatedUser?.email,
        phone: updatedUser?.phone,
        address: updatedUser?.address,

        status: "pending",
        paymentStatus: "pending",
      };

      console.log("📤 FINAL BOOKING BODY →", body);
      console.log("🎯 Using security protocol ID:", bookingDetails?.guardId);

      // Use the security protocol ID (the actual guard entry ID)
      const resp = await createSecurityBooking({
        id: bookingDetails?.guardId, // This should be "6918e5fcc17c4e67050efc64" not "6918e333c17c4e67050efc60"
        body,
      }).unwrap();

      handleSuccess("Security service reserved successfully!");

      const createdBookingId = resp?.data?.id || resp?.id || "";

      navigate(
        `/security/payment-confirm?bookingId=${encodeURIComponent(
          createdBookingId
        )}`,
        {
          state: { data: resp, data2: bookingDetails },
          replace: true,
        }
      );
    } catch (e) {
      const msg =
        e?.data?.message || e?.message || "Failed to create security booking";
      handleError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToBooking = () => {
    navigate("/security-details");
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // =============================
  // UI
  // =============================

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
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>

              {/* Guest Info */}
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h3 className="text-md font-medium mb-3">Guest Information</h3>

                <form className="space-y-4">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <User className="w-4 h-4" /> Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={updatedUser.name}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-md border-gray-300 p-2 border"
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <Mail className="w-4 h-4" /> Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={updatedUser.email}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-md border-gray-300 p-2 border"
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <Phone className="w-4 h-4" /> Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={updatedUser.phone}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-md border-gray-300 p-2 border"
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <MapPin className="w-4 h-4" /> Country
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={updatedUser.address}
                      readOnly
                      className="mt-1 w-full rounded-md border-gray-300 p-2 border bg-gray-100"
                    />
                  </div>
                </form>
              </div>

              {/* Guard Info */}
              <div className="flex items-center space-x-4 mb-6">
                {guardInfo.photo && (
                  <img
                    src={guardInfo.photo}
                    alt={guardInfo.guardName}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}

                <div>
                  <h3 className="font-medium text-gray-900">
                    {guardInfo.guardName}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {userCurrency}{" "}
                    {Number(convertedPricePerDay).toLocaleString()} / day
                  </p>
                </div>
              </div>

              {/* Dates */}
              <div className="flex items-center space-x-4 mt-4">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-gray-900">
                    {formatDate(guardInfo.startDate)} -{" "}
                    {formatDate(guardInfo.endDate)}
                  </p>
                  <p className="text-gray-600">
                    {days} {days === 1 ? "day" : "days"}
                  </p>
                </div>
              </div>

              {/* Service Type */}
              <div className="flex items-center space-x-4 mt-4">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-gray-900">{guardInfo.serviceType}</p>
                  <p className="text-gray-600">
                    {personnelCount}{" "}
                    {personnelCount === 1 ? "person" : "people"}
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
                    {userCurrency}{" "}
                    {Number(convertedPricePerDay).toLocaleString()} × {days} ×{" "}
                    {personnelCount}
                  </span>
                  <span>
                    {userCurrency} {Number(calculatedSubtotal).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>VAT ({vatRate}%)</span>
                  <span>
                    {userCurrency} {Number(vatAmount).toLocaleString()}
                  </span>
                </div>

                <div className="border-t pt-3 mt-3 font-semibold text-lg flex justify-between">
                  <span>Total</span>
                  <span>
                    {userCurrency} {Number(finalTotal).toLocaleString()}
                  </span>
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
    </div>
  );
}
