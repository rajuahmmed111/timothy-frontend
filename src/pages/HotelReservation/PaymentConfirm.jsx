import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
// Import the payment mutations from your API slice
import {
  useCreateHotelPaystackCheckoutSessionMutation,
  useCreateHotelStripeCheckoutSessionWebsiteMutation,
  useCreateHotelBookingMutation,
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
  MapPin,
  Users,
  ShieldCheck,
  ArrowLeft,
  Phone,
} from "lucide-react";

export default function PaymentConfirm() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [createdBookingId, setCreatedBookingId] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [modalTimer, setModalTimer] = useState(null);
  const [countdown, setCountdown] = useState(3);

  const bookingDetails = location.state?.data;
  const bookingPayload = location.state?.bookingData;
  const hotelData = bookingDetails?.data || bookingDetails || {};

  // Get currency with proper fallbacks
  const displayCurrency =
    hotelData.displayCurrency ||
    bookingDetails?.displayCurrency ||
    bookingPayload?.displayCurrency ||
    bookingDetails?.currency ||
    hotelData.currency ||
    "USD";

  // Payment mutations
  const [createPaystackSession] =
    useCreateHotelPaystackCheckoutSessionMutation();
  const [createStripeSession] =
    useCreateHotelStripeCheckoutSessionWebsiteMutation();
  const [createHotelBooking] = useCreateHotelBookingMutation();

  // Set payment method based on country
  useEffect(() => {
    if (bookingDetails?.user?.country) {
      const country = bookingDetails.user.country.toLowerCase();
      const isUserInAfrica = isAfricanCountry(country);
      setPaymentMethod(isUserInAfrica ? "paystack" : "stripe");
    }
  }, [bookingDetails?.user?.country]);

  // Create booking function
  const createBooking = async () => {
    if (!bookingPayload) {
      toast.error("Booking data not found");
      return null;
    }

   

    // Validate that roomId exists and is not null
    if (
      !bookingPayload.roomId ||
      bookingPayload.roomId === "null" ||
      bookingPayload.roomId === "undefined"
    ) {
      toast.error("Room ID is missing or invalid. Please try again.");
      return null;
    }

    setIsCreatingBooking(true);
    try {
      const res = await createHotelBooking({
        bookingId: bookingPayload.roomId,
        data: bookingPayload,
      }).unwrap();

      const bookingId = res.data?._id || res.data?.id || res._id || res.id;
      setCreatedBookingId(bookingId);

      toast.success("Booking created successfully!");
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
        msg.toLowerCase().includes("hotel") ||
        msg.toLowerCase().includes("room") ||
        msg.toLowerCase().includes("taken") ||
        msg.toLowerCase().includes("conflict") ||
        err?.data?.code === "P2002" ||
        err?.data?.error === "Unique constraint" ||
        err?.name === "PrismaClientKnownRequestError" ||
        (err?.data?.meta?.modelName === "Hotel_Booking" &&
          err?.data?.meta?.message?.includes("Unique constraint"));

      if (isDuplicateBooking) {
        const duplicateMessage =
          "You already have a booking for this hotel room in the selected dates";
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

  const calculateTotal = () => {
    const parsedSubtotal = Number(
      bookingDetails?.subtotal ?? hotelData?.subtotal ?? 0
    );
    const vatRate = Number(bookingDetails?.vat ?? hotelData?.vat ?? 12) || 12;
    const vatAmount = parsedSubtotal * (vatRate / 100);
    const total = parsedSubtotal + vatAmount;

    return { subtotal: parsedSubtotal, vatRate, vatAmount, total };
  };

  const { subtotal, vatRate, vatAmount, total } = calculateTotal();

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const searchParams = new URLSearchParams(location.search);

  const bookingId = (() => {
    const fromUrl = searchParams.get("bookingId");
    if (fromUrl) return fromUrl;

    if (location.state?.createdBookingId)
      return location.state.createdBookingId;

    if (bookingDetails?.id) return bookingDetails.id.toString();

    const pathParts = window.location.pathname.split("/");
    const possibleId = pathParts[pathParts.length - 1];
    if (possibleId && possibleId.length > 10) return possibleId;

    return null;
  })();

  const handlePayment = async () => {
    if (!total || total <= 0) return;

    // First create the booking
    const currentBookingId = createdBookingId || (await createBooking());
    if (!currentBookingId) {
      toast.error("Failed to create booking");
      return;
    }

    // Proceed directly to payment without modal
    proceedToPayment(currentBookingId);
  };

  const proceedToPayment = async (currentBookingId) => {
    if (!bookingDetails?.user?.country) {
      toast.error("Please select a country");
      return;
    }

    setIsLoading(true);

    try {
      const successUrl = `${window.location.origin}/booking-confirmation`;
      const cancelUrl = `${window.location.origin}/hotel/checkout`;

      const userInfo = bookingDetails.user;

      // Save booking info
      sessionStorage.setItem(
        "lastBooking",
        JSON.stringify({
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
        })
      );

      const paymentData = {
        amount: Math.round(total * 100),
        email: bookingDetails.user.email || "",
        name:
          bookingDetails.user.fullName ||
          bookingDetails.user.name ||
          "Customer",
        phone:
          bookingDetails.user.contactNumber || bookingDetails.user.phone || "",
        currency: "NGN",
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

      // PAYSTACK
      if (paymentMethod === "paystack" && isUserInAfrica) {
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

        if (!checkoutUrl) throw new Error("No valid checkout URL found");

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

        window.location.href = checkoutUrl;
      }

      // STRIPE (fixed)
      else {
        paymentData.currency = "USD";

        const result = await createStripeSession({
          bookingId: currentBookingId,
          body: {
            ...paymentData,

            // ❗ FIX ADDED BELOW — remove transfer_data
            payment_intent_data: {},

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

        if (!checkoutUrl) throw new Error("Stripe checkout URL missing");

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

        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error?.data?.message || error?.message || "Payment failed");
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
            {/* LEFT */}
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

              {/* Grid */}
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Dates */}
                <div className="bg-white  rounded-lg p-4 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Check-in</p>
                      <p className="font-medium">
                        {formatDate(
                          bookingDetails?.checkIn || hotelData?.bookedFromDate
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Check-out</p>
                      <p className="font-medium">
                        {formatDate(
                          bookingDetails?.checkOut || hotelData?.bookedToDate
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Nights</p>
                      <p className="font-medium">{bookingDetails.nights}</p>
                    </div>
                  </div>
                </div>

                {/* Guests */}
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
                          hotelData?.cancelationPolicy}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Country</p>
                      <p className="font-medium">
                        {bookingDetails?.user?.country || ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT - Countdown Timer and Price */}
            <div className="md:w-1/3 mt-10 md:mt-0">
              <div className="bg-white p-6  rounded-lg shadow-sm sticky top-6">
                <h2 className="text-xl font-semibold mb-5">Price Summary</h2>

                <div className="space-y-3 text-gray-700">
                  <div className="flex justify-between">
                    <span>Room Price (Incl. VAT)</span>
                    <span>
                      {displayCurrency} {total.toFixed(2)}
                    </span>
                  </div>

                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>
                        {displayCurrency} {total.toFixed(2)}
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

      {/* Booking Confirmation Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
                Booking Confirmed!
              </h3>
              <p className="text-gray-600 mb-2">
                Your hotel booking has been successfully created. Booking ID:{" "}
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
