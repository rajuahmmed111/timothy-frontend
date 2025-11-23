import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
// Import the payment mutations from your API slice
import {
  useCreateHotelPaystackCheckoutSessionMutation,
  useCreateHotelStripeCheckoutSessionWebsiteMutation,
} from "../../redux/api/hotel/hotelApi";

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
  const bookingDetails = location.state?.data;
  const hotelData = bookingDetails?.data || bookingDetails || {};
  console.log("Booking details:", bookingDetails);

  // Set payment method based on country when component mounts or country changes
  useEffect(() => {
    if (bookingDetails?.user?.country) {
      const country = bookingDetails.user.country.toLowerCase();
      const isUserInAfrica = isAfricanCountry(country);
      setPaymentMethod(isUserInAfrica ? "paystack" : "stripe");
    }
  }, [bookingDetails?.user?.country]);

  // Payment mutations
  const [createPaystackSession] =
    useCreateHotelPaystackCheckoutSessionMutation();
  const [createStripeSession] =
    useCreateHotelStripeCheckoutSessionWebsiteMutation();

  const calculateTotal = () => {
    const parsedSubtotal = Number(
      bookingDetails?.subtotal ?? hotelData?.subtotal ?? 0
    );
    const discount = Number(
      bookingDetails?.discountedPrice ?? hotelData?.discountedPrice ?? 0
    );
    const vatRate = Number(bookingDetails?.vat ?? hotelData?.vat ?? 12) || 12;
    const baseVatAmount = parsedSubtotal * (vatRate / 100);
    const vatAmount =
      Number(bookingDetails?.vatAmount ?? hotelData?.vatAmount ?? 0) ||
      baseVatAmount;
    const serviceFee = Number(
      bookingDetails?.serviceFee ?? hotelData?.serviceFee ?? 0
    );
    const fallbackTotal = parsedSubtotal + vatAmount - discount + serviceFee;
    const total =
      Number(bookingDetails?.total ?? hotelData?.total ?? 0) || fallbackTotal;

    return {
      subtotal: parsedSubtotal,
      discount,
      vatRate,
      vatAmount,
      serviceFee,
      total,
    };
  };

  const { subtotal, discount, vatRate, vatAmount, serviceFee, total } =
    calculateTotal();

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };
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

  console.log("Current booking ID:", bookingId);

  const handlePayment = async () => {
    // Prevent execution if total is not valid
    if (!total || total <= 0) {
      console.log("Payment not processed: Invalid total amount");
      return;
    }
    // Use the already retrieved bookingId
    const currentBookingId = bookingId;
    if (!bookingDetails?.user?.country) {
      toast.error("Please select a country");
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
      const cancelUrl = `${window.location.origin}/hotel/checkout`;
      // Use the already retrieved bookingId

      // Prepare user information
      const userInfo = bookingDetails.user;

      const bookingConfirmationData = {
        bookingId: currentBookingId,
        hotelName: bookingDetails.hotelName,
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
        cancelationPolicy: bookingDetails.cancelationPolicy,
        vat: bookingDetails.vat,
        nights: bookingDetails.nights,
        user: userInfo,
      };

      // Store in session storage as fallback
      sessionStorage.setItem(
        "lastBooking",
        JSON.stringify(bookingConfirmationData)
      );

      const paymentData = {
        amount: Math.round(total * 100), // smallest currency unit
        email: bookingDetails.user.email || "",
        name:
          bookingDetails.user.fullName ||
          bookingDetails.user.name ||
          "Customer",
        phone:
          bookingDetails.user.contactNumber || bookingDetails.user.phone || "",
        currency: "NGN", // default Paystack
        hotelId: bookingDetails.hotelId,
        roomId: bookingDetails.roomId,
        userId: bookingDetails.user.id,
        successUrl,
        cancelUrl,
        metadata: {
          bookingId: currentBookingId,
          hotelId: bookingDetails.hotelId,
          roomId: bookingDetails.roomId,
          userId: bookingDetails.user.id,
        },
      };

      const userCountry = (bookingDetails.user.country || "").toLowerCase();
      const isUserInAfrica = isAfricanCountry(userCountry);

      if (paymentMethod === "paystack" && isUserInAfrica) {
        console.log("Processing Paystack payment for:", userCountry);
        const response = await createPaystackSession({
          bookingId: currentBookingId,
          body: {
            ...paymentData,
            callback_url: successUrl,
            metadata: paymentData.metadata,
          },
        }).unwrap();

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
        paymentData.currency = "USD";

        const result = await createStripeSession({
          bookingId: currentBookingId,
          body: {
            ...paymentData,
            line_items: [
              {
                price_data: {
                  currency: "usd",
                  product_data: {
                    name: `Hotel Booking - ${
                      bookingDetails.hotelName || "Hotel"
                    }`,
                    description: `Room Type: ${
                      bookingDetails.roomType || "Standard"
                    }`,
                  },
                  unit_amount: Math.round(total * 100),
                },
                quantity: 1,
              },
            ],
            mode: "payment",
            success_url: successUrl,
            cancel_url: cancelUrl,
            billing_address_collection: "required",
            submit_type: "pay",
            allow_promotion_codes: true,
            metadata: paymentData.metadata,
          },
        }).unwrap();

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
          className="flex items-center text-gray-700 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="text-lg font-semibold">Back to Booking</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-md">
          <h1 className="text-center text-2xl font-bold py-6 border-b">
            Booking Details
          </h1>

          <div className="p-6 md:flex gap-10">
            {/* LEFT COLUMN */}
            <div className="md:w-2/3 space-y-8">
              {/* Hotel Info */}
              <div className="bg-gray-50 p-5 rounded-lg ">
                <h3 className="text-xl font-semibold mb-2">
                  {bookingDetails?.hotelName || hotelData?.name}
                </h3>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{bookingDetails?.location}</span>
                </div>
              </div>

              {/* Booking Grid */}
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Date Card */}
                <div className="bg-white  rounded-lg p-4 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Check-in</p>
                      <p className="font-medium">
                        {formatDate(hotelData.bookedFromDate) ||
                          "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Check-out</p>
                      <p className="font-medium">
                        {formatDate(hotelData.bookedToDate) || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Nights</p>
                      <p className="font-medium">
                        {bookingDetails.nights} night
                      </p>
                    </div>
                  </div>
                </div>

                {/* Guest/Card */}
                <div className="bg-white  rounded-lg p-4 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Guests</p>
                      <p className="font-medium">
                        {hotelData.adults || 1} Adult
                        {hotelData.adults > 1 ? "s" : ""}
                        {hotelData.children
                          ? `, ${hotelData.children} ${
                              hotelData.children > 1 ? "Children" : "Child"
                            }`
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Booking Policy</p>
                      <p
                        className={`font-semibold ${
                          bookingDetails?.isRefundable ||
                          hotelData?.isRefundable
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {bookingDetails?.isRefundable || hotelData?.isRefundable
                          ? "Refundable"
                          : "Non-Refundable"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {bookingDetails?.cancelationPolicy ||
                          hotelData?.cancelationPolicy ||
                          "Non-refundable booking."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Country</p>
                      <p className="font-medium">
                        {bookingDetails?.user?.country || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - PRICE */}
            <div className="md:w-1/3 mt-10 md:mt-0">
              <div className="bg-white p-6  rounded-lg shadow-sm sticky top-6">
                <h2 className="text-xl font-semibold mb-5">Price Summary</h2>

                <div className="space-y-3 text-gray-700">
                  <div className="flex justify-between">
                    <span>Room Price (Incl. VAT)</span>
                    <span>
                      {hotelData.displayCurrency} {total.toFixed(2)}
                    </span>
                  </div>

                  {/* {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>
                        -{hotelData.displayCurrency} {discount.toFixed(2)}
                      </span>
                    </div>
                  )} */}

                  {serviceFee > 0 && (
                    <div className="flex justify-between">
                      <span>Service Fee</span>
                      <span>
                        {hotelData.displayCurrency} {serviceFee.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {/* Divider */}
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>
                        {hotelData.displayCurrency} {total.toFixed(2)}
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
