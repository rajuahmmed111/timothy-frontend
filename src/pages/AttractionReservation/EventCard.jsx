import { MapPin, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import img1 from "/burj.png";
import { currencyByCountry } from "../../components/curenci";

export default function EventCard({
  event,
  userCurrency: propUserCurrency,
  userCountry: propUserCountry,
  conversionRate: propConversionRate,
}) {
  // IP-based currency detection states
  const [detectedCurrency, setDetectedCurrency] = useState(null);
  const [detectedCountry, setDetectedCountry] = useState(null);
  const [detectedRate, setDetectedRate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use props if provided, otherwise use detected values
  const userCurrency = propUserCurrency || detectedCurrency || "USD";
  const userCountry = propUserCountry || detectedCountry || null;
  const conversionRate = propConversionRate || detectedRate || 1;

  // IP-based currency detection effect
  useEffect(() => {
    if (propUserCurrency && propConversionRate) {
      // Use props if already provided
      setIsLoading(false);
      return;
    }

    const detectCurrency = async () => {
      try {
        console.log("EventCard: Starting IP-based currency detection...");
        const res = await fetch("https://api.country.is/");
        const data = await res.json();
        const country = data.country;
        console.log("EventCard: Detected country:", country);

        if (country && currencyByCountry[country]) {
          const userCurr = currencyByCountry[country].code;
          console.log("EventCard: User currency code:", userCurr);
          setDetectedCountry(country);
          setDetectedCurrency(userCurr);

          // Fetch conversion: USD → user's currency
          let rate = 1;
          if ("USD" !== userCurr) {
            console.log("EventCard: Converting from USD to", userCurr);
            const rateRes = await fetch(
              "https://open.er-api.com/v6/latest/USD"
            );
            const rateData = await rateRes.json();
            if (rateData?.rates) {
              const usdToUser = rateData.rates[userCurr] || 1;
              rate = usdToUser;
              console.log("EventCard: Calculated conversion rate:", rate);
            }
          }
          setDetectedRate(rate);
        } else {
          console.log("EventCard: Country not found, using USD");
          setDetectedCurrency("USD");
          setDetectedRate(1);
        }
      } catch (e) {
        console.error("EventCard: Detection failed:", e);
        setDetectedCurrency("USD");
        setDetectedRate(1);
      } finally {
        setIsLoading(false);
      }
    };

    detectCurrency();
  }, [propUserCurrency, propConversionRate]);

  console.log("EventCard received data:", event);
  console.log("EventCard currency props:", {
    propUserCurrency,
    propUserCountry,
    propConversionRate,
    detectedCurrency,
    detectedCountry,
    detectedRate,
    finalUserCurrency: userCurrency,
    finalUserCountry: userCountry,
    finalConversionRate: conversionRate,
  });

  // Currency conversion logic (fallback if not provided)
  console.log("Full event object:", event);
  console.log("Event attractionAdultPrice:", event?.attractionAdultPrice);
  console.log("Event basePrice:", event?.basePrice);
  console.log("Event price:", event?.price);

  const displayCurrency = event?.currency || event?.displayCurrency;
  const baseAdultPrice = Number(event?.attractionAdultPrice) || 0;
  const baseChildPrice = Number(event?.attractionChildPrice) || 0;
  const baseCurrency = displayCurrency || "USD";

  console.log("bs", baseAdultPrice, "baseCurrency", baseCurrency);

  // Calculate converted prices
  let convertedAdultPrice = baseAdultPrice;
  console.log("dfdfadsfdasfadsfadsfasdfasdfds", convertedAdultPrice);
  let convertedChildPrice = baseChildPrice;
  let finalDisplayCurrency = userCurrency || baseCurrency;

  // Convert from base currency to user currency
  console.log("Conversion check:", {
    userCurrency,
    baseCurrency,
    conversionRate,
    isLoading,
    shouldConvert:
      userCurrency &&
      baseCurrency !== userCurrency &&
      conversionRate &&
      !isLoading,
  });

  if (
    userCurrency &&
    baseCurrency !== userCurrency &&
    conversionRate &&
    !isLoading
  ) {
    console.log("Converting from", baseCurrency, "to", userCurrency);

    // If base currency is NGN and user wants USD
    if (baseCurrency === "NGN" && userCurrency === "USD") {
      // Convert NGN to USD (assuming 1 USD = 1515 NGN)
      const ngnToUsdRate = 1 / 1515;
      convertedAdultPrice = Number(baseAdultPrice * ngnToUsdRate);
      convertedChildPrice = Number(baseChildPrice * ngnToUsdRate);
      console.log(
        "NGN to USD conversion:",
        baseAdultPrice,
        "x",
        ngnToUsdRate,
        "=",
        convertedAdultPrice
      );
    }
    // If base currency is USD and user has different currency
    else if (baseCurrency === "USD") {
      convertedAdultPrice = Number(baseAdultPrice * conversionRate);
      convertedChildPrice = Number(baseChildPrice * conversionRate);
      console.log(
        "USD to",
        userCurrency,
        "conversion:",
        baseAdultPrice,
        "x",
        conversionRate,
        "=",
        convertedAdultPrice
      );
    }
    // If base currency is not USD but user wants USD
    else if (userCurrency === "USD") {
      convertedAdultPrice = Number(baseAdultPrice / conversionRate);
      convertedChildPrice = Number(baseChildPrice / conversionRate);
      console.log(
        baseCurrency,
        "to USD conversion:",
        baseAdultPrice,
        "/",
        conversionRate,
        "=",
        convertedAdultPrice
      );
    }
    // For other conversions, use the provided conversion rate
    else {
      convertedAdultPrice = Number(baseAdultPrice * conversionRate);
      convertedChildPrice = Number(baseChildPrice * conversionRate);
      console.log(
        "Other conversion:",
        baseCurrency,
        "to",
        userCurrency,
        ":",
        baseAdultPrice,
        "x",
        conversionRate,
        "=",
        convertedAdultPrice
      );
    }
  } else {
    console.log("No conversion - using base prices");
  }

  console.log("EventCard: Price conversion:", {
    eventName: event?.attractionDestinationType || event?.name,
    baseAdultPrice,
    baseChildPrice,
    baseCurrency,
    userCurrency,
    conversionRate,
    convertedAdultPrice,
    convertedChildPrice,
    finalDisplayCurrency,
  });

  const adultPrice = Number(convertedAdultPrice);
  console.log("ddfddddddddddddddddddd", adultPrice);
  const childPrice = Number(convertedChildPrice);

  // Use adult price for display (EventCard shows single price)
  let convertedPrice = adultPrice;
  let displayCurrencyFinal = finalDisplayCurrency;

  // Handle zero-decimal currencies like JPY
  const isZeroDecimalCurrency = ["JPY", "KRW", "VND"].includes(
    displayCurrencyFinal
  );
  const formattedPrice = isZeroDecimalCurrency
    ? Math.round(convertedPrice).toLocaleString()
    : convertedPrice.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

  console.log("EventCard price conversion:", {
    eventName: event?.attractionDestinationType || event?.name,
    baseAdultPrice,
    baseChildPrice,
    baseCurrency,
    userCurrency,
    conversionRate,
    convertedAdultPrice,
    convertedChildPrice,
    finalDisplayCurrency,
    adultPrice,
    childPrice,
    convertedPrice,
    displayCurrencyFinal,
    isZeroDecimalCurrency,
    formattedPrice,
  });
  return (
    <Link
      to={`/event-reservation/${encodeURIComponent(event?.id || "")}`}
      className="w-full"
    >
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Hotel Image */}
        <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
          <img
            src={event?.image || "/placeholder.svg"}
            alt={event.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
              Popular
            </div>
          </div>
        </div>

        {/* Hotel Details */}
        <div className="p-5">
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
            {event.name}
          </h3>
          {/* Hotel Location */}
          <p className="text-sm text-gray-600 line-clamp-2 flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4" /> {event.location}
          </p>

          {/* Rating and Price */}
          <div className="flex items-center justify-between mb-3">
            <div className="text-2xl font-bold text-gray-900">
              {isLoading ? (
                "Loading..."
              ) : (
                <>
                  {displayCurrencyFinal} {event?.convertedPrice.toFixed(2)}
                </>
              )}
            </div>
            <div className="flex items-center gap-1">
              {[...Array(Math.floor(event.rating || 0))].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                />
              ))}
              <span className="text-sm text-gray-600 ml-1">
                ({event.rating || 0})
              </span>
            </div>
          </div>

          {/* Availability Badge */}
          {event?.isAvailable && (
            <div className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Available
            </div>
          )}

          {/* Price & Button */}
          {/* <div className="w-full">
                    <Link to="/event-reservation" className="w-full">
                        <button className="w-full bg-[#0064D2] text-white px-4 py-2 rounded-lg text-sm font-bold">
                            Get Ticket
                        </button>
                    </Link>
                </div> */}
        </div>
      </div>
    </Link>
  );
}
