import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
// Import the payment mutations from your API slice
import {
  useCreatePaystackCheckoutSessionMutation,
  useCreateStripeCheckoutSessionWebsiteMutation,
  useCreateAttractionBookingMutation,
} from "../../redux/api/attraction/attractionApi";
import { currencyByCountry } from "../../components/curenci";

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
  const user = useSelector((state) => state?.auth?.user);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [createAttractionBooking] = useCreateAttractionBookingMutation();
  const attractionDetails = location.state?.data;
  const attractionData = attractionDetails?.data || attractionDetails || {};
  const bookingDetails = location.state?.bookingDetails;
  const cancelationPolicy = bookingDetails?.cancelationPolicy;

  // Currency detection states
  const [userCurrency, setUserCurrency] = useState(
    attractionData?.userCurrency || bookingDetails?.userCurrency || "USD"
  );
  const [userCountry, setUserCountry] = useState(
    attractionData?.userCountry || bookingDetails?.userCountry || null
  );
  const [conversionRate, setConversionRate] = useState(
    attractionData?.conversionRate || bookingDetails?.conversionRate || 1
  );

  // Currency detection effect (only if not provided from booking data)
  useEffect(() => {
    if (attractionData?.userCurrency && attractionData?.conversionRate) {
      return;
    }

    if (bookingDetails?.userCurrency && bookingDetails?.conversionRate) {
      setUserCurrency(bookingDetails.userCurrency);
      setUserCountry(bookingDetails.userCountry);
      setConversionRate(bookingDetails.conversionRate);
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
          } else {
          }

          setConversionRate(rate);
        } else {
          setUserCurrency("USD");
          setConversionRate(1);
        }
      } catch (e) {
        console.error(
          "EventPaymentConfirm: Detection or conversion failed:",
          e
        );
        setUserCurrency("USD");
        setConversionRate(1);
      }
    };

    detect();
  }, [attractionData, bookingDetails]);

  const currencyLabel = userCurrency || attractionData?.displayCurrency;
  const from = attractionData?.selectedFrom || attractionData?.from;
  const to = attractionData?.selectedTo || attractionData?.to;

  // Set payment method based on user country (Africa -> Paystack, else Stripe)
  useEffect(() => {
    // Prioritize logged-in user's country
    const countrySource =
      user?.country ||
      user?.address?.country ||
      attractionData?.user?.country ||
      attractionData?.address ||
      attractionData?.country ||
      "";

    if (!countrySource) return;

    const isUserInAfrica = isAfricanCountry(countrySource.toLowerCase());
    setPaymentMethod(isUserInAfrica ? "paystack" : "stripe");
  }, [
    user?.country,
    user?.address?.country,
    attractionData?.user?.country,
    attractionData?.address,
    attractionData?.country,
  ]);

  // Payment mutations
  const [createPaystackSession] = useCreatePaystackCheckoutSessionMutation();
  const [createStripeSession] = useCreateStripeCheckoutSessionWebsiteMutation();

  const calculateTotal = () => {
    // Use the same calculation as EventCheckout for consistency
    const adultCountFallback = Number(attractionData?.adults ?? 1);
    const childCountFallback = Number(attractionData?.children ?? 0);

    // Use converted prices if available, otherwise convert base prices
    let priceAdultFallback = Number(
      attractionData?.convertedAdultPrice ?? attractionData?.convertedPrice ?? 0
    );
    let priceChildFallback = Number(
      attractionData?.convertedChildPrice ?? priceAdultFallback
    );

    // If we have base prices and conversion rate, convert them (same logic as EventCheckout)
    if (attractionData?.baseAdultPrice && conversionRate && userCurrency) {
      const baseCurrency = attractionData?.baseCurrency || "NGN";

      if (baseCurrency === "NGN" && userCurrency === "USD") {
        const ngnToUsdRate = 1 / 1515;
        priceAdultFallback = Number(
          attractionData.baseAdultPrice * ngnToUsdRate
        );
        priceChildFallback = Number(
          attractionData.baseChildPrice * ngnToUsdRate
        );
      } else if (baseCurrency === "USD") {
        priceAdultFallback = Number(
          attractionData.baseAdultPrice * conversionRate
        );
        priceChildFallback = Number(
          attractionData.baseChildPrice * conversionRate
        );
      } else if (userCurrency === "USD") {
        priceAdultFallback = Number(
          attractionData.baseAdultPrice / conversionRate
        );
        priceChildFallback = Number(
          attractionData.baseChildPrice / conversionRate
        );
      } else {
        priceAdultFallback = Number(
          attractionData.baseAdultPrice * conversionRate
        );
        priceChildFallback = Number(
          attractionData.baseChildPrice * conversionRate
        );
      }
    }

    // Calculate subtotal
    let finalTotal =
      priceAdultFallback * adultCountFallback +
      priceChildFallback * childCountFallback;

    // Calculate VAT (5%) - same as EventCheckout
    const vatRate = 0.05;
    const subtotal = finalTotal;
    const vatAmount = subtotal * vatRate;
    finalTotal = subtotal + vatAmount;

    return {
      total: finalTotal,
      subtotal,
      vatAmount,
    };
  };

  const { total, subtotal, vatAmount } = calculateTotal();

  // Derive adult/child counts and prices for UI breakdown
  const adultCount = Number(attractionData?.adults ?? 0);
  const childCount = Number(attractionData?.children ?? 0);

  // Calculate final prices for display (with VAT included)
  let finalAdultPrice = Number(attractionData?.convertedAdultPrice ?? 0);
  let finalChildPrice = Number(
    attractionData?.convertedChildPrice ?? finalAdultPrice
  );

  // If we have base prices and conversion rate, calculate converted prices
  if (attractionData?.baseAdultPrice && conversionRate && userCurrency) {
    const baseCurrency = attractionData?.baseCurrency || "NGN";

    if (baseCurrency === "NGN" && userCurrency === "USD") {
      const ngnToUsdRate = 1 / 1515;
      finalAdultPrice = Number(attractionData.baseAdultPrice * ngnToUsdRate);
      finalChildPrice = Number(attractionData.baseChildPrice * ngnToUsdRate);
    } else if (baseCurrency === "USD") {
      finalAdultPrice = Number(attractionData.baseAdultPrice * conversionRate);
      finalChildPrice = Number(attractionData.baseChildPrice * conversionRate);
    } else if (userCurrency === "USD") {
      finalAdultPrice = Number(attractionData.baseAdultPrice / conversionRate);
      finalChildPrice = Number(attractionData.baseChildPrice / conversionRate);
    } else {
      finalAdultPrice = Number(attractionData.baseAdultPrice * conversionRate);
      finalChildPrice = Number(attractionData.baseChildPrice * conversionRate);
    }
  }

  // Add 5% VAT to individual ticket prices
  const vatRate = 0.05;
  const adultPriceWithVat = finalAdultPrice * (1 + vatRate);
  const childPriceWithVat = finalChildPrice * (1 + vatRate);

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };
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
    if (!attractionData) {
      toast.error("Booking information is missing.");
      return;
    }
    // Prevent execution if total is not valid
    if (!total || total <= 0) {
      return;
    }

    setIsLoading(true);

    try {
      // First create the booking
      const attractionId =
        attractionData?.appealId ||
        attractionData?.bookingId ||
        attractionData?.id;
      if (!attractionId) {
        toast.error("Event identifier is missing.");
        return;
      }

      const bookingBody = {
        name: attractionData?.user?.name || attractionData?.name,
        email: attractionData?.user?.email || attractionData?.email,
        phone: attractionData?.user?.contactNo || attractionData?.contactNo,
        address: attractionData?.user?.address || attractionData?.address,
        convertedAdultPrice: finalAdultPrice,
        convertedChildPrice: finalChildPrice,
        displayCurrency: userCurrency || attractionData?.displayCurrency,
        discountedPrice: attractionData?.discountedPrice || 0,
        adults: attractionData?.adults || 1,
        children: attractionData?.children || 0,
        cancelationPolicy,
        date: attractionData?.selectedDate,
        day: attractionData?.day,
        from: attractionData?.selectedFrom || from,
        to: attractionData?.selectedTo || to,
        userCurrency,
        userCountry,
        conversionRate,
        baseCurrency:
          attractionData?.baseCurrency || attractionData?.currency || "USD",
        baseAdultPrice:
          attractionData?.baseAdultPrice || attractionData?.unitPrice || 0,
        baseChildPrice: attractionData?.baseChildPrice || 0,
      };

      const bookingResponse = await createAttractionBooking({
        id: attractionId,
        body: bookingBody,
        bookingDetails: attractionData,
      }).unwrap();

      const createdBookingId =
        bookingResponse?.data?.id ||
        bookingResponse?.id ||
        bookingResponse?.bookingId;

      // Show success modal
      setShowSuccessModal(true);

      setShowSuccessModal(false);
      proceedViewPayment(createdBookingId);
    } catch (error) {
      console.error("Booking creation failed:", error);
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Booking creation failed. Please try again.";
      toast.error(`Booking Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const proceedViewPayment = async (bookingId) => {
    try {
      const successUrl = `${window.location.origin}/booking-confirmation`;
      const cancelUrl = `${window.location.origin}/booking-cancellation`;

      // Prepare payment data
      const paymentData = {
        bookingId: bookingId,
        attractionId: attractionData?.appealId || attractionData?.attractionId,
        appealId: attractionData?.appealId,
        userId: attractionData?.userId,
        userCurrency,
        userCountry,
        conversionRate,
        baseCurrency:
          attractionData?.baseCurrency || bookingDetails?.baseCurrency || "USD",
        baseAdultPrice:
          attractionData?.baseAdultPrice || bookingDetails?.baseAdultPrice || 0,
        baseChildPrice:
          attractionData?.baseChildPrice || bookingDetails?.baseChildPrice || 0,
        adults: attractionData?.adults || 1,
        children: attractionData?.children || 0,
        date: attractionData?.selectedDate,
        day: attractionData?.day,
        from: attractionData?.selectedFrom || from,
        to: attractionData?.selectedTo || to,
        cancelationPolicy,
        total,
        metadata: {
          bookingId: bookingId,
          attractionId: attractionData?.appealId,
          category: attractionData?.category,
          name: attractionData?.name,
          date: attractionData?.date,
          day: attractionData?.day,
          timeSlot: { from, to },
          adults: attractionData?.adults,
          children: attractionData?.children,
          address: attractionData?.address,
          bookingStatus: attractionData?.bookingStatus,
          total,
        },
      };

      if (paymentMethod === "paystack") {
        const response = await createPaystackSession({
          bookingId: bookingId,
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
            bookingId: bookingId,
            paymentMethod: "paystack",
            timestamp: new Date().toISOString(),
            successUrl,
            cancelUrl,
          })
        );

        window.location.href = checkoutUrl;
      } else {
        // Stripe payment logic
        let stripeAmount = total * 100;
        let stripeCurrency = userCurrency?.toLowerCase() || "usd";

        if (userCurrency && userCurrency !== "USD" && conversionRate) {
          const usdAmount = total / conversionRate;
          stripeAmount = Math.round(usdAmount * 100);
          stripeCurrency = "usd";
        }

        const result = await createStripeSession({
          bookingId: bookingId,
          body: {
            ...paymentData,
            line_items: [
              {
                price_data: {
                  currency: stripeCurrency,
                  product_data: {
                    name: `Attraction Booking - ${
                      attractionData?.category || "Attraction"
                    }`,
                    description: `${attractionData?.date} ${from} - ${to}`,
                  },
                  unit_amount: stripeAmount,
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
            bookingId: bookingId,
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
                      Event:{" "}
                      {attractionData?.category || attractionData?.eventName}
                    </h3>
                    <div className="flex items-center text-gray-600 mt-1">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <p className="text-sm">
                        Location:{" "}
                        {attractionData?.location || attractionData?.address}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5 flex  gap-20">
                    <div className="shadow-sm p-4 border border-gray-200 h-[250px] w-[300px] rounded-lg">
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
                            {formatDate(attractionData?.selectedDate)}
                            {attractionData?.day
                              ? ` (${attractionData.day})`
                              : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="shadow-sm p-4 border border-gray-200 h-[250px] w-[300px] rounded-lg">
                      <div className="flex gap-2 items-center">
                        <Users className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Guests</p>
                          <p>
                            {attractionData?.adults || 1}{" "}
                            {attractionData?.adults === 1 ? "Adult" : "Adults"}
                            {attractionData?.children
                              ? `, ${attractionData?.children} ${
                                  attractionData?.children === 1
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
                              attractionData?.bookingStatus
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {attractionData?.bookingStatus
                              ? "Refundable"
                              : "Non Refundable "}
                          </p>
                          <span className="text-black text-lg">
                            {cancelationPolicy}
                          </span>
                        </div>
                      </div>
                      <div className="flex mt-2 gap-2 items-center">
                        <Phone className="w-5 h-5 text-gray-500 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Country: </p>
                          <p>
                            {user?.country ||
                              user?.address?.country ||
                              userCountry ||
                              attractionData?.user?.country ||
                              attractionData?.country ||
                              attractionData?.userCountry ||
                              bookingDetails?.userCountry ||
                              "Not provided"}
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
                      {Number(adultPriceWithVat).toLocaleString()} ×{" "}
                      {adultCount || 0}
                    </span>
                  </div>

                  {/* Children line */}
                  {childCount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Child tickets</span>
                      <span>
                        {currencyLabel && `${currencyLabel} `}
                        {Number(childPriceWithVat).toLocaleString()} ×{" "}
                        {childCount}
                      </span>
                    </div>
                  )}

                  {/* {attractionData?.discountedPrice > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>
                        -{currencyLabel && `${currencyLabel} `}
                        {attractionData?.discountedPrice?.toFixed
                          ? attractionData.discountedPrice.toFixed(2)
                          : attractionData?.discountedPrice || 0}
                      </span>
                    </div>
                  )} */}

                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>
                        {currencyLabel && `${currencyLabel} `}
                        {Number(total).toLocaleString()}
                      </span>
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
