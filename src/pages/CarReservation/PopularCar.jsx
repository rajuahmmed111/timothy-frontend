import React, { useEffect, useState } from "react";
import CarCard from "./CarCard";
import { useNavigate } from "react-router-dom";
import { useGetAllCarsQuery } from "../../redux/api/car/getAllCarsApi";
import { Spin } from "antd";
import { currencyByCountry } from "../../components/curenci";

export default function PopularCar() {
  const navigate = useNavigate();
  const {
    data: carsData,
    isLoading,
    isError,
  } = useGetAllCarsQuery({ page: 1, limit: 4 });

  // Currency detection states
  const [userCurrency, setUserCurrency] = useState("USD");
  const [conversionRate, setConversionRate] = useState(1);
  const [currencyLoading, setCurrencyLoading] = useState(true);

  // Currency detection and conversion
  useEffect(() => {
    const detect = async () => {
      try {
        console.log("PopularCar: Starting currency detection...");
        const res = await fetch("https://api.country.is/");
        const data = await res.json();
        console.log("PopularCar: Location API response:", data);
        const country = data.country;
        console.log("PopularCar: Detected country:", country);

        if (country && currencyByCountry[country]) {
          console.log("PopularCar: Country found in mapping:", country);
          const userCurr = currencyByCountry[country].code;
          console.log("PopularCar: User currency code:", userCurr);
          setUserCurrency(userCurr);

          // Fetch conversion: USD → user's currency
          let rate = 1;

          if ("USD" !== userCurr) {
            console.log("PopularCar: Converting from USD to", userCurr);
            const rateRes = await fetch(
              "https://open.er-api.com/v6/latest/USD"
            );
            const rateData = await rateRes.json();
            console.log("PopularCar: Exchange rate data:", rateData);

            if (rateData?.rates) {
              const usdToUser = rateData.rates[userCurr] || 1;
              rate = usdToUser;
              console.log("PopularCar: Calculated conversion rate:", rate);
            }
          } else {
            console.log("PopularCar: No conversion needed - USD");
          }

          setConversionRate(rate);
        } else {
          console.log("PopularCar: Country not found in mapping, using USD");
          setUserCurrency("USD");
          setConversionRate(1);
        }
      } catch (e) {
        console.error("PopularCar: Detection or conversion failed:", e);
        setUserCurrency("USD");
        setConversionRate(1);
      } finally {
        setCurrencyLoading(false);
      }
    };

    detect();
  }, []);

  // Transform car data to match the expected car card props
  const transformCarData = (car) => {
    console.log("PopularCar: Raw car data:", car);
    console.log("PopularCar: carPriceDay:", car.carPriceDay);
    console.log("PopularCar: currency:", car.currency);

    // Try multiple possible price fields
    const priceFields = [
      car.carPriceDay,
      car.pricePerDay,
      car.dailyPrice,
      car.price,
      car.car_Rental?.pricePerDay,
      car.car_Rental?.carPriceDay,
    ];

    const basePrice = Number(priceFields.find((p) => p && p > 0) || 0);
    const baseCurrency = car.currency || car.car_Rental?.currency || "USD";

    console.log("PopularCar: priceFields:", priceFields);
    console.log(
      "PopularCar: basePrice:",
      basePrice,
      "baseCurrency:",
      baseCurrency
    );

    // Calculate converted price
    let convertedPrice = basePrice;
    let displayCurrency = userCurrency || baseCurrency;

    // Convert from base currency to user currency
    if (
      userCurrency &&
      baseCurrency !== userCurrency &&
      conversionRate &&
      !currencyLoading
    ) {
      // If base currency is NGN and user wants USD
      if (baseCurrency === "NGN" && userCurrency === "USD") {
        // Convert NGN to USD (assuming 1 USD = 1515 NGN)
        const ngnToUsdRate = 1 / 1515;
        convertedPrice = Number(basePrice * ngnToUsdRate);
      }
      // If base currency is USD and user has different currency
      else if (baseCurrency === "USD") {
        convertedPrice = Number(basePrice * conversionRate);
      }
      // If base currency is not USD but user wants USD
      else if (userCurrency === "USD") {
        convertedPrice = Number(basePrice / conversionRate);
      }
      // For other conversions, use the provided conversion rate
      else {
        convertedPrice = Number(basePrice * conversionRate);
      }
    }

    // Handle zero-decimal currencies like JPY
    const isZeroDecimalCurrency = ["JPY", "KRW", "VND"].includes(
      displayCurrency
    );
    const formattedPrice = isZeroDecimalCurrency
      ? Math.round(convertedPrice).toLocaleString()
      : convertedPrice.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

    console.log("PopularCar: Car price conversion:", {
      carName: car.car_Rental?.carName || car.carModel,
      basePrice,
      baseCurrency,
      userCurrency,
      conversionRate,
      convertedPrice,
      displayCurrency,
      formattedPrice,
    });

    return {
      id: car.id,
      name: car.car_Rental?.carName || car.carModel,
      location: `${car.carCity}, ${car.carCountry}`,
      image: car.carImages?.[0] || "/car/default-car.png",
      price: displayCurrency
        ? `${displayCurrency} ${formattedPrice}`
        : formattedPrice,
      rating: parseFloat(car.carRating) || 4.5,
      type: car.carType,
      seats: car.carSeats,
      transmission: car.carTransmission,
      fuelType: car.fuelType,
      discount: car.discount,
      isAvailable: car.isBooked === "AVAILABLE",
      // Add conversion props for CarCard
      userCurrency,
      conversionRate,
      basePrice,
      convertedPrice: Number(convertedPrice),
      displayCurrency,
    };
  };

  if (isLoading)
    return (
      <div className="text-center py-10">
        <Spin size="large" />
      </div>
    );
  if (isError) return <div>Error loading cars</div>;

  const cars = carsData?.data?.data?.map(transformCarData) || [];

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-5 md:px-0">
        <div className="mb-12 text-center lg:text-left">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Cars
            </h2>
            <button
              onClick={() => navigate("/car-details")}
              className="bg-[#0064D2] text-white px-4 py-2 rounded-lg text-sm font-bold"
            >
              View All
            </button>
          </div>
          <p className="text-gray-600 mx-auto lg:mx-0">
            Discover our most rented and trusted cars, carefully chosen for
            comfort, safety, and style. Whether you need a compact city car, a
            family SUV, or a luxury ride, we have the perfect option waiting for
            you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>

        {cars.length === 0 && !isLoading && (
          <div className="text-center py-10">
            <p className="text-gray-500">No cars found.</p>
          </div>
        )}
      </div>
    </section>
  );
}
