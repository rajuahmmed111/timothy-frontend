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
  const bookingDetails = location.state?.bookingDetails;
  console.log("Booking Details:", bookingDetails);

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
    const price =
      Number(bookingDetails?.roomPrice) * Number(bookingDetails?.rooms) || 0;
    const vatAmount = Math.round((price * (bookingDetails?.vat || 0)) / 100);
    const total = price + vatAmount;

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
  const bookingId =
    searchParams.get("bookingId") || location.state?.createdBookingId;

  const handlePayment = async () => {
    // Re-fetch bookingId in case it was updated
    const currentBookingId =
      searchParams.get("bookingId") || location.state?.createdBookingId;
    if (!bookingDetails?.user?.country) {
      toast.error("Please select a country");
      return;
    }

    setIsLoading(true);
    try {
      if (!currentBookingId) {
        toast.error("Booking reference not found. Please try again.");
        return;
      }
      const successUrl = `${window.location.origin}/booking-confirmation`;
      const cancelUrl = `${window.location.origin}/hotel/checkout`;
      const bookingId = location.state?.createdBookingId;

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
          bookingId,
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
            bookingId,
            paymentMethod: "paystack",
            timestamp: new Date().toISOString(),
          })
        );
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

        // Redirect to payment gateway
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
            bookingId,
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

        // Redirect to payment gateway
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
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to previous page
        </button>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 md:flex gap-8">
            {/* Left Column - Booking Details */}
            <div className="md:w-2/3 space-y-6">
              <div className="pb-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">
                      {bookingDetails?.hotelName || "Hotel Name Not Available"}
                    </h3>
                    <div className="flex items-center text-gray-600 mt-1">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <p className="text-sm">
                        {bookingDetails?.location || "Location not specified"}
                      </p>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        {bookingDetails?.roomType &&
                          `Room Type: ${bookingDetails.roomType}`}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Check-in</p>
                        <p>
                          {formatDate(bookingDetails?.checkIn) ||
                            "Not specified"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Check-out</p>
                        <p>
                          {formatDate(bookingDetails?.checkOut) ||
                            "Not specified"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Nights</p>
                        <p>
                          {bookingDetails?.nights || "1"} night
                          {bookingDetails?.nights !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Guests</p>
                        <p>
                          {bookingDetails?.adults || 1}{" "}
                          {bookingDetails?.adults === 1 ? "Adult" : "Adults"}
                          {bookingDetails?.children
                            ? `, ${bookingDetails.children} ${
                                bookingDetails.children === 1
                                  ? "Child"
                                  : "Children"
                              }`
                            : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <ShieldCheck className="w-5 h-5 text-gray-500 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Condition</p>
                        <p
                          className={
                            bookingDetails?.isRefundable
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {bookingDetails?.isRefundable
                            ? "Refundable"
                            : "Non-Refundable"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-gray-500 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Country: </p>
                        <p>
                          {" "}
                          {bookingDetails?.user?.country || "Not provided"}
                        </p>
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
                    <span className="text-gray-600">Price per night</span>
                    <span>
                      ${(bookingDetails?.roomPrice || 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>VAT ({bookingDetails?.vat || 0}%)</span>
                    <span>${(vatAmount || 0).toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <div className="border-t w-full border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>${(total || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <button
                      onClick={handlePayment}
                      disabled={isLoading}
                      className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center disabled:opacity-70"
                    >
                      {isLoading ? "Processing..." : "Continue to Pay"}
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
