import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  useCreateSecurityPaystackCheckoutSessionMutation,
  useCreateSecurityStripeCheckoutSessionMutation,
  useCreateSecurityBookingMutation,
} from "../../redux/api/security/securityBookingApi";

// Helper function to check if a country is in Africa
const isAfricanCountry = (country) => {
  if (!country) return false;
  const africanCountries = [
    "nigeria",
    "ghana",
    "kenya",
    "south africa",
    "algeria",
    "angola",
    "benin",
    "botswana",
    "burkina faso",
    "burundi",
    "cameroon",
    "cape verde",
    "central african republic",
    "chad",
    "comoros",
    "congo",
    "democratic republic of the congo",
    "cote d'ivoire",
    "ivory coast",
    "djibouti",
    "egypt",
    "equatorial guinea",
    "eritrea",
    "eswatini",
    "ethiopia",
    "gabon",
    "gambia",
    "ghana",
    "guinea",
    "guinea-bissau",
    "kenya",
    "lesotho",
    "liberia",
    "libya",
    "madagascar",
    "malawi",
    "mali",
    "mauritania",
    "mauritius",
    "morocco",
    "mozambique",
    "namibia",
    "niger",
    "nigeria",
    "rwanda",
    "sao tome and principe",
    "senegal",
    "seychelles",
    "sierra leone",
    "somalia",
    "south africa",
    "south sudan",
    "sudan",
    "tanzania",
    "togo",
    "tunisia",
    "uganda",
    "zambia",
    "zimbabwe",
  ];
  return africanCountries.includes(country.toLowerCase().trim());
};

import {
  Calendar,
  CreditCard,
  MapPin,
  Users,
  Wallet,
  ShieldCheck,
  ArrowLeft,
  Phone,
} from "lucide-react";
import { ToastContainer } from "react-toastify";

export default function PaymentConfirm() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [createdBookingId, setCreatedBookingId] = useState(null);

  const data = location.state?.data2;
  const cancelationPolicy = data?.cancellationPolicy;
  const raw = location.state;
  const totalPrice = raw?.data?.bookingPayload;

  // The data structure is: { bookingData: bookingPayload, data: paymentData }
  // paymentData contains: { bookingPayload, data: bookingDetails, user: updatedUser, ... }
  const paymentData = raw?.data || {};
  const bookingPayloadForCreation = raw?.bookingData || {};

  // Get the actual booking details from paymentData.data
  const bookingDetails = paymentData?.data || {};
  const userInfo = paymentData?.user || bookingDetails?.user || {};

  // Add fallback data to ensure something displays
  const displayData = {
    securityName:
      paymentData?.bookingPayload?.guardName ||
      bookingDetails?.securityName ||
      bookingDetails?.guardName ||
      "Security Service",
    address:
      paymentData?.bookingPayload?.address ||
      bookingDetails?.address ||
      bookingDetails?.location ||
      paymentData?.location ||
      "Location not specified",
    securityBookedFromDate:
      paymentData?.bookingPayload?.securityBookedFromDate ||
      bookingDetails?.securityBookedFromDate ||
      bookingDetails?.startDate,
    securityBookedToDate:
      paymentData?.bookingPayload?.securityBookedToDate ||
      bookingDetails?.securityBookedToDate ||
      bookingDetails?.endDate,
    number_of_security:
      paymentData?.bookingPayload?.number_of_security ||
      bookingDetails?.number_of_security ||
      bookingDetails?.personnelCount ||
      1,
    displayCurrency:
      paymentData?.bookingPayload?.displayCurrency ||
      paymentData?.bookingPayload?.currency ||
      bookingDetails?.displayCurrency ||
      bookingDetails?.currency ||
      "USD",
    convertedPrice:
      paymentData?.bookingPayload?.convertedPrice ||
      paymentData?.bookingPayload?.pricePerDay ||
      bookingDetails?.convertedPrice ||
      bookingDetails?.pricePerDay ||
      0,
    discountedPrice:
      paymentData?.bookingPayload?.discountedPrice ||
      bookingDetails?.discountedPrice ||
      0,
    user: userInfo || {},
    cancellationPolicy:
      paymentData?.bookingPayload?.cancelationPolicy ||
      data?.cancellationPolicy ||
      bookingDetails?.cancellationPolicy ||
      "Non-refundable",
  };

  const hotelData = bookingDetails;
  useEffect(() => {
    // Use country from bookingPayload or userInfo
    const countrySrc =
      paymentData?.bookingPayload?.address ||
      userInfo?.country ||
      bookingDetails?.user?.country ||
      bookingDetails?.address;

    if (countrySrc) {
      const country = String(countrySrc).toLowerCase();
      const isUserInAfrica = isAfricanCountry(country);
      setPaymentMethod(isUserInAfrica ? "paystack" : "stripe");
    }
  }, [
    paymentData?.bookingPayload?.address,
    userInfo?.country,
    bookingDetails?.user?.country,
    bookingDetails?.address,
  ]);

  // Payment mutations
  const [createPaystackSession] =
    useCreateSecurityPaystackCheckoutSessionMutation();
  const [createStripeSession] =
    useCreateSecurityStripeCheckoutSessionMutation();
  const [createSecurityBooking] = useCreateSecurityBookingMutation();

  const calculateTotal = () => {
    const price = Number(displayData?.convertedPrice || 0);
    const discount = Number(displayData?.discountedPrice || 0);
    const subtotal = price - discount;
    const vatRate = 5; // Fixed 5% VAT
    const vatAmount = Number(((subtotal * vatRate) / 100).toFixed(2));
    const total = subtotal + vatAmount;

    return {
      vatAmount,
      total,
    };
  };

  const { vatAmount, total } = calculateTotal();

  // Create booking function
  const createBooking = async () => {
    // Use the booking payload from paymentData instead of bookingData
    const actualBookingPayload =
      paymentData?.bookingPayload || bookingPayloadForCreation;

    if (!actualBookingPayload) {
      toast.error("Booking data not found");
      return null;
    }

    // Try different ID fields in order of preference
    const idToUse =
      actualBookingPayload.securityId ||
      actualBookingPayload.securityProtocolId ||
      actualBookingPayload.securityGuardId ||
      actualBookingPayload.id ||
      actualBookingPayload.guardId;

    // Validate ID exists
    if (!idToUse || idToUse === "null" || idToUse === "undefined") {
      toast.error("Security ID is missing or invalid");
      return null;
    }

    setIsCreatingBooking(true);
    try {
      const res = await createSecurityBooking({
        id: idToUse,
        body: actualBookingPayload,
      }).unwrap();

      const bookingId = res.data?._id || res.data?.id || res._id || res.id;
      setCreatedBookingId(bookingId);

      toast.success("Security booking created successfully!");
      return bookingId;
    } catch (err) {
      const msg =
        err?.data?.message || err?.message || "Failed to create booking";

      // Debug logging to see the actual error structure

      // Enhanced duplicate booking detection
      const isDuplicateBooking =
        msg.toLowerCase().includes("already") ||
        msg.toLowerCase().includes("duplicate") ||
        msg.toLowerCase().includes("exists") ||
        msg.toLowerCase().includes("booking") ||
        msg.toLowerCase().includes("security") ||
        msg.toLowerCase().includes("taken") ||
        msg.toLowerCase().includes("conflict") ||
        err?.data?.code === "P2002" ||
        err?.data?.error === "Unique constraint" ||
        err?.name === "PrismaClientKnownRequestError" ||
        (err?.data?.meta?.modelName === "Security_Booking" &&
          err?.data?.meta?.message?.includes("Unique constraint"));

      if (isDuplicateBooking) {
        const duplicateMessage =
          "You already have a booking for this security service in the selected days";
        toast.error(duplicateMessage);
        // Also show alert as fallback to ensure message appears
        alert(duplicateMessage);
      } else {
        toast.error(msg);
      }

      return null;
    } finally {
      setIsCreatingBooking(false);
    }
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };
  // Calculate full-day difference between two dates
  const daysBetween = (from, to) => {
    if (!from || !to) return null;
    const start = new Date(from);
    const end = new Date(to);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()))
      return null;
    const ms = end.getTime() - start.getTime();
    if (ms < 0) return 0;
    return Math.ceil(ms / (1000 * 60 * 60 * 24));
  };
  const durationDays = daysBetween(
    displayData?.securityBookedFromDate,
    displayData?.securityBookedToDate
  );
  // Get booking ID from URL params or state
  const searchParams = new URLSearchParams(location.search);

  // Get booking ID from multiple sources with fallback
  const bookingId = (() => {
    // Try URL parameters first
    const fromUrl = searchParams.get("bookingId");
    if (fromUrl) return fromUrl;

    // Then try location state
    if (location.state?.createdBookingId) {
      return location.state.createdBookingId;
    }

    // Then try booking details
    if (bookingDetails?.id) {
      return bookingDetails.id.toString();
    }

    const pathParts = window.location.pathname.split("/");
    const possibleId = pathParts[pathParts.length - 1];
    if (possibleId && possibleId.length > 10) {
      // Simple validation for ID length
      return possibleId;
    }

    return null;
  })();

  const handlePayment = async () => {
    // Prevent execution if total is not valid
    if (!total || total <= 0) {
      toast.error("Invalid total amount");
      return;
    }

    // First create the booking
    const currentBookingId = createdBookingId || (await createBooking());
    if (!currentBookingId) {
      toast.error("Failed to create booking");
      return;
    }

    // Validate booking ID is a valid MongoDB ObjectId (24-character hex string)
    if (
      !currentBookingId ||
      currentBookingId === "null" ||
      currentBookingId.length !== 24
    ) {
      toast.error("Invalid booking ID");
      return;
    }

    // Go directly to payment without modal
    proceedToPayment(currentBookingId);
  };

  const proceedToPayment = async (bookingId) => {
    // Use country from bookingPayload for payment method detection
    const countrySrc =
      paymentData?.bookingPayload?.address ||
      userInfo?.country ||
      bookingDetails?.user?.country ||
      bookingDetails?.address;

    if (!countrySrc) {
      toast.error("Please provide country/address for payment method");
      return;
    }

    // Use the passed booking ID instead of createdBookingId state
    const currentBookingId = bookingId || createdBookingId;
    if (
      !currentBookingId ||
      currentBookingId === "null" ||
      currentBookingId.length !== 24
    ) {
      toast.error("Invalid booking ID for payment");
      return;
    }

    setIsLoading(true);
    try {
      const successUrl = `${window.location.origin}/booking-confirmation`;
      const cancelUrl = `${window.location.origin}/booking-cancellation`;

      // Prepare user information
      const userInfoData = userInfo || bookingDetails?.user || {};

      const bookingConfirmationData = {
        bookingId: currentBookingId,
        securityName: displayData?.securityName || displayData?.guardName,
        checkIn: displayData?.securityBookedFromDate || displayData?.startDate,
        checkOut: displayData?.securityBookedToDate || displayData?.endDate,
        guests: 1,
        total,
        roomType: "Security",
        location: displayData?.address,
        rooms: 1,
        adults: 1,
        children: 0,
        isRefundable: !!displayData?.cancellationPolicy,
        vat: vatAmount,
        nights: durationDays || 1,
        user: userInfoData,
      };

      // Store in session storage as fallback
      sessionStorage.setItem(
        "lastBooking",
        JSON.stringify(bookingConfirmationData)
      );

      const userCountry = String(countrySrc || "").toLowerCase();
      const isUserInAfrica = isAfricanCountry(userCountry);

      if (paymentMethod === "paystack" && isUserInAfrica) {
        const response = await createPaystackSession(currentBookingId).unwrap();

        const checkoutUrl =
          response?.data?.checkoutUrl ||
          response?.checkoutUrl ||
          response?.data?.authorization_url ||
          response?.authorization_url;

        if (!checkoutUrl)
          throw new Error("No valid checkout URL found in Paystack response");

        // Store booking data in session storage before redirecting
        sessionStorage.setItem(
          "pendingBooking",
          JSON.stringify({
            bookingId: currentBookingId,
            paymentMethod: "paystack",
            timestamp: new Date().toISOString(),
            successUrl,
            cancelUrl,
          })
        );

        // Redirect directly to Paystack checkout
        window.location.href = checkoutUrl;
      } else {
        const result = await createStripeSession(currentBookingId).unwrap();

        const checkoutUrl =
          result?.data?.checkoutUrl || result?.data?.url || result?.url;

        if (!checkoutUrl)
          throw new Error("Could not retrieve Stripe checkout URL");

        // Store booking data in session storage before redirecting
        sessionStorage.setItem(
          "pendingBooking",
          JSON.stringify({
            bookingId: currentBookingId,
            paymentMethod: "stripe",
            timestamp: new Date().toISOString(),
            successUrl,
            cancelUrl,
          })
        );

        // Redirect directly to Stripe checkout
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error("Payment error:", error);
      const errorMessage =
        error?.data?.message ||
        error?.error ||
        error?.message ||
        "Payment processing failed. Please try again.";
      toast.error(`Payment Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="text-lg font-semibold">Back to previous page</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-md">
          <h1 className="text-center text-2xl font-bold py-6 border-b">
            Booking Details
          </h1>

          <div className="p-6 md:flex gap-10">
            {/* LEFT COLUMN */}
            <div className="md:w-2/3 space-y-8">
              {/* Security Info Card */}
              <div className="bg-gray-50 p-5 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">
                  Security Service:{" "}
                  {displayData?.securityName ||
                    displayData?.guardName ||
                    "Security"}
                </h3>

                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>
                    {displayData?.address ||
                      displayData?.location ||
                      "Not provided"}
                  </span>
                </div>
              </div>

              {/* GRID CARDS */}
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Date Range Card */}
                <div className="bg-white  rounded-lg p-4 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Start Date</p>
                      <p className="font-medium">
                        {formatDate(
                          displayData?.securityBookedFromDate ||
                            displayData?.startDate
                        ) || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">End Date</p>
                      <p className="font-medium">
                        {formatDate(
                          displayData?.securityBookedToDate ||
                            displayData?.endDate
                        ) || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Total Duration</p>
                      <p className="font-medium">
                        {durationDays !== null
                          ? `${durationDays} day${
                              durationDays === 1 ? "" : "s"
                            }`
                          : "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Security Conditions Card */}
                <div className="bg-white  rounded-lg p-4 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Total Guards</p>
                      <p className="font-medium">
                        {displayData?.number_of_security ||
                          displayData?.personnelCount ||
                          1}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Booking Condition</p>
                      <p
                        className={`font-semibold ${
                          displayData?.cancellationPolicy
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {displayData?.cancellationPolicy
                          ? "Refundable"
                          : "Non-Refundable"}
                      </p>
                      <p className="text-sm text-gray-700">
                        {displayData?.cancellationPolicy ||
                          "No cancellation policy"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Country</p>
                      <p className="font-medium">
                        {userInfo?.country ||
                          bookingDetails?.user?.country ||
                          displayData?.address ||
                          "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN — PRICE */}
            <div className="md:w-1/3 mt-10 md:mt-0">
              <div className="bg-white p-6  rounded-lg shadow-sm sticky top-6">
                <h2 className="text-xl font-semibold mb-6">Price Summary</h2>

                <div className="space-y-3 text-gray-700">
                  <div className="flex justify-between">
                    <span>Service Price</span>
                    <span>
                      {displayData?.displayCurrency ||
                        displayData?.currency ||
                        "USD"}{" "}
                      {totalPrice?.totalPrice
                        ? Number(totalPrice.totalPrice).toFixed(2)
                        : Number(
                            displayData?.convertedPrice ||
                              displayData?.pricePerDay ||
                              0
                          ).toFixed(2)}
                    </span>
                  </div>

                  {displayData?.discountedPrice > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>
                        -{displayData?.displayCurrency || displayData?.currency}{" "}
                        {Number(displayData?.discountedPrice).toFixed(2)}
                      </span>
                    </div>
                  )}

                  {/* Divider */}
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>
                        {displayData?.displayCurrency ||
                          displayData?.currency ||
                          "USD"}{" "}
                        {totalPrice?.totalPrice
                          ? Number(totalPrice.totalPrice).toFixed(2)
                          : total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isLoading || isCreatingBooking}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium disabled:opacity-60"
                >
                  {isCreatingBooking
                    ? "Creating Booking..."
                    : isLoading
                    ? "Processing Payment..."
                    : "Confirm & Pay"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
