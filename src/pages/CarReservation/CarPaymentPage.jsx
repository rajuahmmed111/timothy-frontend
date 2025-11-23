import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  useCreateCarPaystackSessionMutation,
  useCreateCarStripeSessionMutation,
} from "../../redux/api/car/carApi";

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
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const bookingDetails =
    location.state?.bookingDetails ||
    location.state?.bookingData ||
    location.state?.data ||
    null;
  console.log("Booking details of aman", bookingDetails);
  console.log("Booking details of aman2", bookingDetails?.user?.country);

  useEffect(() => {
    if (bookingDetails?.user?.country) {
      const country = bookingDetails.user.country.toLowerCase();
      const isUserInAfrica = isAfricanCountry(country);
      setPaymentMethod(isUserInAfrica ? "paystack" : "stripe");
    }
  }, [bookingDetails?.user?.country]);

  // Payment
  const [createPaystackSession] = useCreateCarPaystackSessionMutation();
  const [createStripeSession] = useCreateCarStripeSessionMutation();

  const calculateTotal = () => {
    const total = Number(bookingDetails?.total || 0);
    return {
      total,
    };
  };

  const { total } = calculateTotal();

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };
  // Get booking ID
  const searchParams = new URLSearchParams(location.search);

  // Get booking ID
  const bookingId = (() => {
    const fromUrl = searchParams.get("bookingId");
    if (fromUrl) return fromUrl;
    if (location.state?.createdBookingId) {
      return location.state.createdBookingId;
    }
    if (bookingDetails?.id) {
      return bookingDetails.id.toString();
    }
    const pathParts = window.location.pathname.split("/");
    const possibleId = pathParts[pathParts.length - 1];
    if (possibleId && possibleId.length > 10) {
      return possibleId;
    }
    return null;
  })();

  const handlePayment = async () => {
    if (!total || total <= 0) {
      console.log("Payment not processed: Invalid total amount");
      return;
    }
    const currentBookingId =
      bookingId ||
      bookingDetails?.bookingId ||
      location.state?.createdBookingId ||
      bookingDetails?.carId ||
      null;
    
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
      const cancelUrl = `${window.location.origin}/car/checkout`;

      // Prepare user information
      const userInfo = bookingDetails.user;
      const { total } = calculateTotal();

      const bookingConfirmationData = {
        bookingId: currentBookingId,
        carName: bookingDetails.carName,
        pickupDate: bookingDetails.pickupDate,
        returnDate: bookingDetails.returnDate,
        guests: bookingDetails.guests || 1,
        total,
        roomType: bookingDetails.roomType,
        location: bookingDetails.location,
        adults: bookingDetails.adults,
        children: bookingDetails.children,
        isRefundable: bookingDetails.isRefundable,
        cancelationPolicy: bookingDetails.cancelationPolicy,
        vat: bookingDetails.vat,
        days: bookingDetails.days,
        user: userInfo,
        carCancelationPolicy: bookingDetails.carCancelationPolicy,
        carSeats: bookingDetails.carSeats,
        carCountry: userInfo?.country,
      };
      sessionStorage.setItem(
        "lastBooking",
        JSON.stringify(bookingConfirmationData)
      );

      const paymentData = {
        email: bookingDetails.user.email || "",
        name:
          bookingDetails.user.fullName ||
          bookingDetails.user.name ||
          "Customer",
        phone:
          bookingDetails.user.contactNumber || bookingDetails.user.phone || "",
        currency: bookingDetails.currency, // default Paystack
        userId: bookingDetails.user.id,
        carId: bookingDetails.carId,
        carName: bookingDetails.carName,
        successUrl,
        cancelUrl,
        metadata: {
          bookingId: currentBookingId,
          carId: bookingDetails.carId,
          userId: bookingDetails.user.id,
        },
      };

      const userCountry = (bookingDetails.user.country || "").toLowerCase();
      const isUserInAfrica = isAfricanCountry(userCountry);
      const selectedMethod = isUserInAfrica ? "paystack" : "stripe";
      setPaymentMethod(selectedMethod);

      if (selectedMethod === "paystack") {
        const response = await createPaystackSession(currentBookingId).unwrap();

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
        const result = await createStripeSession(currentBookingId).unwrap();

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
          className="flex items-center text-xl text-[#000] font-bold my-5"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Booking Details
        </button>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 md:flex gap-8">
            {/* Left Column - Booking Details */}
            <div className="md:w-2/3 space-y-6">
              <div className="pb-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">
                      Car Model: {bookingDetails?.carName || "N/A"}
                    </h3>
                    <div className="flex items-center text-gray-600 mt-1">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <p className="text-sm">
                        Location: {bookingDetails?.location || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5 flex  gap-20">
                    <div className="shadow-sm p-4 border border-gray-200 h-[240px] w-[300px] rounded-lg">
                      <div className="flex gap-2 items-center">
                        <Calendar className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Pickup Date</p>
                          <p>
                            {formatDate(bookingDetails.pickupDate) ||
                              "Not specified"}
                          </p>
                        </div>
                      </div>
                      <div className="flex mt-2 gap-2 items-center">
                        <Calendar className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Return Date</p>
                          <p>
                            {formatDate(bookingDetails.returnDate) ||
                              "Not specified"}
                          </p>
                        </div>
                      </div>
                      <div className="flex mt-2 gap-2 items-center">
                        <Calendar className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Days</p>
                          <p>
                            {bookingDetails.days || "1"} day
                            {bookingDetails.days !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="shadow-sm p-4 border border-gray-200 h-[240px] w-[300px] rounded-lg">
                      <div className="flex gap-2 items-center">
                        <Users className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Seats</p>
                          <p>{bookingDetails?.carSeats || "N/A"}</p>
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
                              bookingDetails?.carCancelationPolicy
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {bookingDetails?.carCancelationPolicy
                              ? "Refundable"
                              : "Non Refundable "}
                          </p>
                          <span className="text-md">
                            {bookingDetails?.carCancelationPolicy || ""}
                          </span>
                        </div>
                      </div>
                      <div className="flex mt-2 gap-2 items-center">
                        <Phone className="w-5 h-5 text-gray-500 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Country: </p>
                          <p>{bookingDetails?.user?.country}</p>
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
                    <span className="text-gray-600">
                      Rental Price (Incl VAT)
                    </span>
                    <span>
                      {bookingDetails?.currency}{" "}
                      {Number(bookingDetails?.total || 0).toFixed(2)}
                    </span>
                  </div>

                  {Number(bookingDetails?.discountedPrice || 0) > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>
                        -{bookingDetails?.currency}{" "}
                        {Number(bookingDetails?.discountedPrice || 0).toFixed(
                          2
                        )}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <div className="border-t w-full border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total Price</span>
                        <span>
                          {bookingDetails?.currency} {total.toFixed(2)}
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
