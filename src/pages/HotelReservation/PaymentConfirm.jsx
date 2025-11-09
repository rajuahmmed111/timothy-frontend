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
  console.log("Hotel data:", hotelData);
  console.log("Payment method:", paymentMethod);
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
    const price = Number(hotelData?.convertedPrice || 0);
    const discount = Number(hotelData?.discountedPrice || 0);
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

      const { vatAmount, total } = calculateTotal();

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

        // Open Paystack in a popup window
        const width = 600;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        const paymentWindow = window.open(
          checkoutUrl,
          "PaystackPayment",
          `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
        );

        // Check for popup blocker
        if (
          !paymentWindow ||
          paymentWindow.closed ||
          typeof paymentWindow.closed === "undefined"
        ) {
          // If popup is blocked, redirect in the same window
          window.location.href = checkoutUrl;
        }
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
          })
        );
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

        // Open Stripe in a popup window
        const width = 600;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        const paymentWindow = window.open(
          checkoutUrl,
          "StripePayment",
          `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
        );

        // Check for popup blocker
        if (
          !paymentWindow ||
          paymentWindow.closed ||
          typeof paymentWindow.closed === "undefined"
        ) {
          // If popup is blocked, redirect in the same window
          window.location.href = checkoutUrl;
        }
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
            Booking Details
          </h1>
          <div className="p-6 md:flex gap-8">
            {/* Left Column - Booking Details */}
            <div className="md:w-2/3 space-y-6">
              <div className="pb-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">
                      Hotel Name: {hotelData?.hotelName || hotelData?.name}
                    </h3>
                    <div className="flex items-center text-gray-600 mt-1">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <p className="text-sm">
                        Location: {hotelData?.location || hotelData?.address}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5 flex  gap-20">
                    <div className="shadow-sm p-4 border border-gray-200 h-[200px] w-[300px] rounded-lg">
                      <div className="flex gap-2 items-center">
                        <Calendar className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Check-in</p>
                          <p>
                            {formatDate(hotelData.bookedFromDate) ||
                              "Not specified"}
                          </p>
                        </div>
                      </div>
                      <div className="flex mt-2 gap-2 items-center">
                        <Calendar className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Check-out</p>
                          <p>
                            {formatDate(hotelData.bookedToDate) ||
                              "Not specified"}
                          </p>
                        </div>
                      </div>
                      <div className="flex mt-2 gap-2 items-center">
                        <Calendar className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Nights</p>
                          <p>
                            {hotelData.nights || "1"} night
                            {hotelData.nights !== 1 ? "s" : ""}
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
                            {hotelData.adults || 1}{" "}
                            {hotelData.adults === 1 ? "Adult" : "Adults"}
                            {hotelData.children
                              ? `, ${hotelData.children} ${
                                  hotelData.children === 1
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
                              bookingDetails?.isRefundable
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {hotelData.isRefundable
                              ? "Refundable , Pay Online"
                              : "Non Refundable"}
                          </p>
                        </div>
                      </div>
                      <div className="flex mt-2 gap-2 items-center">
                        <Phone className="w-5 h-5 text-gray-500 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Country: </p>
                          <p>{hotelData.address || "Not provided"}</p>
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
                  <div className="flex justify-between">
                    <span className="text-gray-600">Room Price</span>
                    <span>{hotelData.convertedPrice || 0}</span>
                  </div>

                  {hotelData.discountedPrice > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{hotelData.discountedPrice || 0}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>VAT (5%)</span>
                    <span>{vatAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <div className="border-t w-full border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>{total.toFixed(2)}</span>
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
