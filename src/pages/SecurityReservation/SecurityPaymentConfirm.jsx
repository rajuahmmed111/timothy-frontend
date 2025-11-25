import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  useCreateSecurityPaystackCheckoutSessionMutation,
  useCreateSecurityStripeCheckoutSessionMutation,
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

export default function PaymentConfirm() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const data = location.state?.data2;
  const cancelationPolicy = data.cancellationPolicy;

  // Accept data from multiple shapes: {resp}, {data}, {payload}, or direct object
  const raw = location.state;
  const bookingDetails =
    raw?.resp?.data ||
    raw?.resp ||
    raw?.data?.data ||
    raw?.data ||
    raw?.payload?.data ||
    raw?.payload ||
    {};

  const hotelData = bookingDetails; // alias to satisfy existing JSX bindings without UI changes
  console.log("bookingDetails", bookingDetails);
  // Set payment method based on country/address when component mounts or changes
  useEffect(() => {
    const countrySrc = bookingDetails?.user?.country || bookingDetails?.address;
    if (countrySrc) {
      const country = String(countrySrc).toLowerCase();
      const isUserInAfrica = isAfricanCountry(country);
      setPaymentMethod(isUserInAfrica ? "paystack" : "stripe");
    }
  }, [bookingDetails?.user?.country, bookingDetails?.address]);

  // Payment mutations
  const [createPaystackSession] =
    useCreateSecurityPaystackCheckoutSessionMutation();
  const [createStripeSession] =
    useCreateSecurityStripeCheckoutSessionMutation();

  const calculateTotal = () => {
    const price = Number(bookingDetails?.convertedPrice || 0);
    const discount = Number(bookingDetails?.discountedPrice || 0);
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
    bookingDetails?.securityBookedFromDate,
    bookingDetails?.securityBookedToDate
  );
  // Get booking ID from URL params or state
  const searchParams = new URLSearchParams(location.search);

  // Debug logging for all potential ID sources
  console.log("Debug - Booking ID sources:", {
    fromUrl: searchParams.get("bookingId"),
    fromLocationState: location.state?.createdBookingId,
    fromBookingDetails: bookingDetails?.id,
    fullLocationState: location.state,
    fullBookingDetails: bookingDetails,
  });

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

    // If we have a booking reference in the URL path
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
      console.log("Payment not processed: Invalid total amount");
      return;
    }
    // Use the already retrieved bookingId
    const currentBookingId = bookingId;
    const countrySrc = bookingDetails?.user?.country || bookingDetails?.address;
    if (!countrySrc) {
      toast.error("Please provide country/address for payment method");
      return;
    }

    setIsLoading(true);
    try {
      if (!currentBookingId) {
        console.error("No booking ID found in any source");
        toast.error(
          "Booking reference not found. Please try refreshing the page or contact support."
        );
        return;
      }
      const successUrl = `${window.location.origin}/booking-confirmation`;
      const cancelUrl = `${window.location.origin}/booking-cancellation`;
      // Use the already retrieved bookingId

      // Prepare user information
      const userInfo = bookingDetails.user;

      const { vatAmount, total } = calculateTotal();

      const bookingConfirmationData = {
        bookingId: currentBookingId,
        securityName: bookingDetails.securityName,
        checkIn: bookingDetails.checkIn,
        checkOut: bookingDetails.checkOut,
        guests: bookingDetails.guests || 1,
        total,
        roomType: bookingDetails.roomType,
        location: bookingDetails.location,
        rooms: bookingDetails.rooms,
        adults: bookingDetails.adults,
        children: bookingDetails.children,
        isRefundable: bookingDetails.isRefundable,
        vat: bookingDetails.vat,
        nights: bookingDetails.nights,
        user: userInfo,
      };

      // Store in session storage as fallback
      sessionStorage.setItem(
        "lastBooking",
        JSON.stringify(bookingConfirmationData)
      );

      const userCountry = String(countrySrc || "").toLowerCase();
      const isUserInAfrica = isAfricanCountry(userCountry);

      if (paymentMethod === "paystack" && isUserInAfrica) {
        console.log("Processing Paystack payment for:", userCountry);
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
        console.log("Processing Stripe payment for:", userCountry);
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
              <div className="bg-gray-50 p-5 rounded-lg ">
                <h3 className="text-xl font-semibold mb-2">
                  Security Service:{" "}
                  {bookingDetails?.securityName ||
                    bookingDetails?.guardName ||
                    "Security"}
                </h3>

                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>
                    {bookingDetails?.address ||
                      bookingDetails?.location ||
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
                        {formatDate(bookingDetails.securityBookedFromDate) ||
                          "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">End Date</p>
                      <p className="font-medium">
                        {formatDate(bookingDetails.securityBookedToDate) ||
                          "Not specified"}
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
                        {bookingDetails?.number_of_security || 1}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Booking Condition</p>
                      <p
                        className={`font-semibold ${
                          cancelationPolicy ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {cancelationPolicy ? "Refundable" : "Non-Refundable"}
                      </p>
                      <p className="text-sm text-gray-700">
                        {cancelationPolicy}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Country</p>
                      <p className="font-medium">
                        {bookingDetails.address || "Not provided"}
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
                    <span>Service Price (Inc.Vat)</span>
                    <span>
                      {hotelData.displayCurrency}{" "}
                      {(hotelData.totalPrice * 1.05).toFixed(2)}
                    </span>
                  </div>

                  {hotelData.discountedPrice > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>
                        -{hotelData.displayCurrency} {hotelData.discountedPrice}
                      </span>
                    </div>
                  )}

                  {/* Divider */}
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>
                        {hotelData.displayCurrency}{" "}
                        {(hotelData.totalPrice * 1.05).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isLoading}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium disabled:opacity-60"
                >
                  {isLoading ? "Processing..." : "Confirm & Pay"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
