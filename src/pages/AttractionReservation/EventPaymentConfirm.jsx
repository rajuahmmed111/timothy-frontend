import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
// Import the payment mutations from your API slice
import {
  useCreatePaystackCheckoutSessionMutation,
  useCreateStripeCheckoutSessionWebsiteMutation,
} from "../../redux/api/attraction/attractionApi";

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

export default function EventPaymentConfirm() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const attractionDetails = location.state?.data;
  const attractionData = attractionDetails?.data || attractionDetails || {};
  console.log("attractionDetails", attractionDetails);
  const currencyLabel = attractionData?.displayCurrency || "";
  const from = attractionDetails.data.timeSlot.from;
  const to = attractionDetails.data.timeSlot.to;

  // Set payment method based on user country (Africa -> Paystack, else Stripe)
  useEffect(() => {
    const countrySource =
      attractionData?.user?.country ||
      attractionData?.address ||
      attractionData?.country ||
      "";

    if (!countrySource) return;

    const isUserInAfrica = isAfricanCountry(countrySource.toLowerCase());
    setPaymentMethod(isUserInAfrica ? "paystack" : "stripe");
  }, [
    attractionData?.user?.country,
    attractionData?.address,
    attractionData?.country,
  ]);

  // Payment mutations
  const [createPaystackSession] = useCreatePaystackCheckoutSessionMutation();
  const [createStripeSession] = useCreateStripeCheckoutSessionWebsiteMutation();

  const calculateTotal = () => {
    // Match bookingDetails-style total:
    // total = adults * convertedAdultPrice + children * convertedChildPrice
    const adultCountFallback = Number(attractionData?.adults ?? 0);
    const childCountFallback = Number(attractionData?.children ?? 0);
    const priceAdultFallback = Number(
      attractionData?.convertedAdultPrice ?? attractionData?.convertedPrice ?? 0
    );
    const priceChildFallback = Number(
      attractionData?.convertedChildPrice ?? priceAdultFallback
    );

    const subtotalAdults = adultCountFallback * priceAdultFallback;
    const subtotalChildren = childCountFallback * priceChildFallback;
    const total = subtotalAdults + subtotalChildren;

    // VAT is frontend-only informational percentage
    const vatPercent = Number(5);
    const vatAmount = Number(((total * vatPercent) / 100).toFixed(2));

    return {
      vatAmount,
      total,
      vatPercent,
    };
  };

  const { vatAmount, total, vatPercent } = calculateTotal();

  // Derive adult/child counts and prices for UI breakdown
  const adultCount = Number(attractionData?.adults ?? 0);
  const childCount = Number(attractionData?.children ?? 0);
  const convertedAdultPrice = Number(attractionData?.convertedAdultPrice ?? 0);
  const convertedChildPrice = Number(
    attractionData?.convertedChildPrice ?? convertedAdultPrice
  );

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
    fromBookingDetails: attractionDetails?.id,
    fullLocationState: location.state,
    fullBookingDetails: attractionDetails,
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
    if (attractionDetails?.id) {
      return attractionDetails.id.toString();
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
    if (!attractionDetails || !attractionDetails.data) {
      toast.error("Booking information is missing.");
      return;
    }
    // Prevent execution if total is not valid
    if (!total || total <= 0) {
      console.log("Payment not processed: Invalid total amount");
      return;
    }
    // Use the already retrieved bookingId
    const currentBookingId = bookingId;
    if (!currentBookingId) {
      toast.error("Booking reference not found.");
      return;
    }

    const bookingData = attractionDetails.data;

    // In this flow user country isn't stored on booking, so just proceed
    setIsLoading(true);
    try {
      const successUrl = `${window.location.origin}/booking-confirmation`;
      const cancelUrl = `${window.location.origin}/event/checkout`;

      const { total } = calculateTotal();

      const bookingConfirmationData = {
        bookingId: currentBookingId,
        attractionId: bookingData.attractionId,
        appealId: bookingData.appealId,
        category: bookingData.category,
        name: bookingData.name,
        date: bookingData.date,
        day: bookingData.day,
        timeSlot: bookingData.timeSlot,
        adults: bookingData.adults,
        children: bookingData.children,
        address: bookingData.address,
        bookingStatus: bookingData.bookingStatus,
        total,
      };

      // Store in session storage as fallback
      sessionStorage.setItem(
        "lastBooking",
        JSON.stringify(bookingConfirmationData)
      );

      const paymentData = {
        amount: Math.round(total * 100), // smallest currency unit
        email: bookingData.email || "",
        name: bookingData.name || "Customer",
        phone: bookingData.phone || "",
        currency: "NGN", // will be overridden for Stripe below
        attractionId: bookingData.attractionId,
        userId: bookingData.userId,
        successUrl,
        cancelUrl,
        metadata: {
          bookingId: currentBookingId,
          attractionId: bookingData.attractionId,
          appealId: bookingData.appealId,
          userId: bookingData.userId,
        },
      };

      // For now, choose provider by UI selection only
      if (paymentMethod === "paystack") {
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
      } else {
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
                    name: `Attraction Booking - ${
                      bookingData.category || "Attraction"
                    }`,
                    description: `${bookingData.date} ${bookingData.timeSlot?.from} - ${bookingData.timeSlot?.to}`,
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
    <div className="min-h-screen bg-gray-50  py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to previous page
        </button>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <h1 className="text-center text-2xl font-bold mt-4 mb-6">
            Attraction Booking Details
          </h1>
          <div className="p-6 md:flex gap-8">
            {/* Left Column - Booking Details */}
            <div className="md:w-2/3 space-y-6">
              <div className="pb-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">
                      Event: {attractionDetails?.data?.category}
                    </h3>
                    <div className="flex items-center text-gray-600 mt-1">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <p className="text-sm">
                        Location:{" "}
                        {attractionDetails?.data?.location ||
                          attractionDetails?.data?.address}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5 flex  gap-20">
                    <div className="shadow-sm p-4 border border-gray-200 h-[200px] w-[300px] rounded-lg">
                      <div className="flex gap-2 items-center">
                        <Calendar className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Check-in</p>
                          <p>{from}</p>
                        </div>
                      </div>
                      <div className="flex mt-2 gap-2 items-center">
                        <Calendar className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Check-out</p>
                          <p>{to}</p>
                        </div>
                      </div>
                      <div className="flex mt-2 gap-2 items-center">
                        <Calendar className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Date</p>
                          <p>
                            {formatDate(attractionDetails?.data?.date)}
                            {attractionDetails?.data?.day
                              ? ` (${attractionDetails.data.day})`
                              : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="shadow-sm p-4 border border-gray-200 h-[200px] w-[300px] rounded-lg">
                      <div className="flex gap-2 items-center">
                        <Users className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Guests</p>
                          <p>
                            {attractionDetails?.data?.adults || 1}{" "}
                            {attractionDetails?.data?.adults === 1
                              ? "Adult"
                              : "Adults"}
                            {attractionDetails?.data?.children
                              ? `, ${attractionDetails?.data?.children} ${
                                  attractionDetails?.data?.children === 1
                                    ? "Child"
                                    : "Children"
                                }`
                              : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex mt-2 gap-2 items-center">
                        <ShieldCheck className="w-5 h-5 text-gray-500 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">
                            Booking Condition
                          </p>
                          <p
                            className={
                              attractionDetails?.data?.bookingStatus
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {attractionDetails?.data?.bookingStatus
                              ? "Refundable"
                              : "Non Refundable "}
                          </p>
                          <span className="text-blue-600">Pay Online</span>
                        </div>
                      </div>
                      <div className="flex mt-2 gap-2 items-center">
                        <Phone className="w-5 h-5 text-gray-500 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Country: </p>
                          <p>
                            {attractionDetails?.data?.address || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Price Summary */}
            <div className="md:w-1/3 mt-10 md:mt-0">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 sticky top-6">
                <h2 className="text-lg font-semibold mb-8">Price Details</h2>
                <div className="space-y-3">
                  {/* Adults line */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Adult tickets</span>
                    <span>
                      {currencyLabel && `${currencyLabel} `}
                      {convertedAdultPrice.toFixed(2)} × {adultCount || 0}
                    </span>
                  </div>

                  {/* Children line */}
                  {childCount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Child tickets</span>
                      <span>
                        {currencyLabel && `${currencyLabel} `}
                        {convertedChildPrice.toFixed(2)} × {childCount}
                      </span>
                    </div>
                  )}

                  {attractionDetails?.data?.discountedPrice > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>
                        -{currencyLabel && `${currencyLabel} `}
                        {attractionDetails?.data?.discountedPrice?.toFixed
                          ? attractionDetails.data.discountedPrice.toFixed(2)
                          : attractionDetails?.data?.discountedPrice || 0}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>VAT ({vatPercent || 0}%)</span>
                    <span>
                      {currencyLabel && `${currencyLabel} `}
                      {vatAmount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <div className="border-t w-full border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>
                          {currencyLabel && `${currencyLabel} `}
                          {total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <button
                      onClick={handlePayment}
                      disabled={isLoading}
                      className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center disabled:opacity-70"
                    >
                      {isLoading ? "Processing..." : "Continue"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
