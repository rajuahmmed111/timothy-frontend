import React, { useEffect, useState } from "react";
import { User, CheckCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { DatePicker, Select, Button, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import { useBooking } from "../../context/BookingContext";
import { currencyByCountry } from "../../components/curenci";

export default function SecurityBookingForm({
  data,
  policy,
  business,
  guard,
  userCurrency,
  userCountry,
  conversionRate,
  convertedPrice,
}) {
  console.log("SecurityBookingForm received props:", {
    userCurrency,
    userCountry,
    conversionRate,
    convertedPrice,
    business,
    guard,
  });

  const [localUserCurrency, setLocalUserCurrency] = useState(
    userCurrency || "USD"
  );
  const [localUserCountry, setLocalUserCountry] = useState(userCountry || null);
  const [localConversionRate, setLocalConversionRate] = useState(
    conversionRate || 1
  );

  // Fallback currency detection if props are not set properly
  useEffect(() => {
    if (
      !userCurrency ||
      userCurrency === "USD" ||
      !conversionRate ||
      conversionRate === 1
    ) {
      const detectCurrency = async () => {
        try {
          console.log(
            "Running fallback currency detection in SecurityBookingForm..."
          );
          const res = await fetch("https://api.country.is/");
          const data = await res.json();
          console.log("Fallback location API response:", data);
          const country = data.country;
          console.log("Fallback detected country:", country);

          if (country && currencyByCountry[country]) {
            console.log("Fallback country found in mapping:", country);
            const userCurr = currencyByCountry[country].code;
            console.log("Fallback user currency code:", userCurr);
            setLocalUserCurrency(userCurr);
            setLocalUserCountry(country);

            // Fetch conversion: baseCurrency → user's currency
            const baseCurrency = business?.displayCurrency || "USD";
            let rate = 1;

            if (baseCurrency !== userCurr) {
              console.log(
                "Fallback converting from",
                baseCurrency,
                "to",
                userCurr
              );
              const rateRes = await fetch(
                "https://open.er-api.com/v6/latest/USD"
              );
              const rateData = await rateRes.json();
              console.log("Fallback exchange rate data:", rateData);

              if (rateData?.rates) {
                const baseToUSD =
                  baseCurrency === "USD" ? 1 : 1 / rateData.rates[baseCurrency];
                const usdToUser = rateData.rates[userCurr] || 1;
                rate = baseToUSD * usdToUser;
                console.log("Fallback calculated conversion rate:", rate);
              }
            }

            setLocalConversionRate(rate);
          } else {
            console.log("Fallback country not found in mapping, using USD");
          }
        } catch (e) {
          console.error("Fallback currency detection failed:", e);
        }
      };

      detectCurrency();
    }
  }, [userCurrency, conversionRate, business?.displayCurrency]);

  console.log("Updated local state:", {
    localUserCurrency,
    localUserCountry,
    localConversionRate,
  });

  const navigate = useNavigate();
  const { search } = useLocation();
  const { bookingData, updateBookingData, updateGuests } = useBooking();
  const [serviceType, setServiceType] = useState("personal");
  const [dateRange, setDateRange] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [personnelCount, setPersonnelCount] = useState(1);
  const cancellationPolicy = policy?.[0]?.securityCancelationPolicy;
  const { RangePicker } = DatePicker;
  const params = new URLSearchParams(search || "");
  const fromDateParam = params.get("fromDate");
  const toDateParam = params.get("toDate");
  const fromDate = fromDateParam ? dayjs(fromDateParam) : null;
  const toDate = toDateParam ? dayjs(toDateParam) : null;
  const user = useSelector((state) => state?.auth?.user);
  const accessToken = useSelector((state) => state?.auth?.accessToken);

  const userInfo = useMemo(() => {
    if (!accessToken) return null;
    try {
      const decoded = jwtDecode(accessToken);
      return {
        ...user,
        ...decoded,
        token: accessToken,
      };
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }, [accessToken, user]);

  // Derive guards list from available guards
  console.log("Available props for guard extraction:", {
    business,
    guard,
    data,
    businessType: typeof business,
    guardType: typeof guard,
    dataType: typeof data,
    businessIsArray: Array.isArray(business),
    guardIsArray: Array.isArray(guard),
    dataIsArray: Array.isArray(data),
  });

  const guards = Array.isArray(guard)
    ? guard.filter((g) => String(g?.isBooked).toUpperCase() === "AVAILABLE")
    : Array.isArray(business?.security_Guard)
    ? business.security_Guard.filter(
        (g) => String(g?.isBooked).toUpperCase() === "AVAILABLE"
      )
    : [];

  console.log("Derived guards list (AVAILABLE only):", guards);
  console.log("Guards list length:", guards.length);

  const [selectedGuardIndex, setSelectedGuardIndex] = useState(0);
  useEffect(() => {
    if (guards.length === 0) return;
    setSelectedGuardIndex(0); // Always select first available guard
  }, [JSON.stringify(guards)]);

  const selectedGuard = guards[selectedGuardIndex] || null;
  console.log("Selected guard:", selectedGuard);

  // Enhanced guard info extraction with more fallbacks
  const guardId =
    selectedGuard?.id ??
    selectedGuard?._id ??
    business?.id ??
    business?._id ??
    null;
  const guardName =
    selectedGuard?.securityGuardName ||
    selectedGuard?.securityName ||
    selectedGuard?.name ||
    business?.securityBusinessName ||
    business?.securityName ||
    "Security Guard";
  const photo =
    selectedGuard?.securityImages?.[0] ||
    selectedGuard?.photo ||
    business?.businessLogo ||
    business?.user?.profileImage ||
    "/placeholder.svg";

  const derivedPrice =
    selectedGuard?.securityPriceDay ||
    selectedGuard?.pricePerDay ||
    business?.averagePrice ||
    500;
  const unitPrice = Number(derivedPrice) || 500;
  const currencyCode =
    selectedGuard?.currency || business?.securityurrency || "USD";

  console.log("Enhanced guard info extraction:", {
    guardId,
    guardName,
    photo,
    hasPhoto: !!photo,
    selectedGuardExists: !!selectedGuard,
    businessExists: !!business,
    derivedPrice,
    unitPrice,
    currencyCode,
  });

  const serviceTypes = [
    {
      id: "personal",
      name: "Security",
      description: "Dedicated protection for individuals",
      icon: <User className="w-5 h-5 text-blue-600" />,
      price: unitPrice,
      convertedPrice: Number(unitPrice * localConversionRate),
    },
  ];

  const selectedService =
    serviceTypes.find((s) => s.id === serviceType) || serviceTypes[0];

  const calculateTotal = () => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) return 0;
    const days =
      Math.ceil(
        (dateRange[1].toDate().getTime() - dateRange[0].toDate().getTime()) /
          (1000 * 60 * 60 * 24)
      ) || 1;
    return selectedService.convertedPrice * days * personnelCount;
  };

  // Calculate converted price for display
  const displayPrice = Number(unitPrice * localConversionRate).toFixed(2);
  const totalAmount = Number(calculateTotal()).toFixed(2);

  console.log("Security booking conversion:", {
    unitPrice,
    currencyCode,
    localUserCurrency,
    localConversionRate,
    displayPrice,
    totalAmount,
  });

  const handlePersonnelChange = (value) => {
    setPersonnelCount(value);
  };

  const getDays = () => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) return 0;
    return (
      Math.ceil(
        (dateRange[1].toDate().getTime() - dateRange[0].toDate().getTime()) /
          (1000 * 60 * 60 * 24)
      ) || 1
    );
  };

  useEffect(() => {
    if (!dateRange && fromDate && toDate) {
      setDateRange([fromDate, toDate]);
    }
  }, [fromDate, toDate, dateRange]);

  const handleBooking = (e) => {
    e.preventDefault();
    if (!dateRange || !dateRange[0] || !dateRange[1]) return;

    const startDate = dateRange[0].format("YYYY-MM-DD");
    const endDate = dateRange[1].format("YYYY-MM-DD");
    const people = Number(personnelCount || 1);
    const perDay = Number(unitPrice || 0);
    const computedTotal = Number(calculateTotal());

    const payload = {
      // Dates
      startDate,
      endDate,

      // Service meta
      serviceType: selectedService?.name,
      serviceDescription: selectedService?.description,

      // Quantities and pricing
      personnelCount: people,
      number_of_security: people, // alias used by downstream
      pricePerDay: Number(displayPrice),
      total: Number(totalAmount),
      convertedPrice: Number(displayPrice), // alias used by PaymentConfirm

      // Display currency aliases
      currency: localUserCurrency,
      displayCurrency: localUserCurrency,
      cancellationPolicy,
      // Guard info
      guardId,
      guardName,
      photo,
    };

    if (accessToken) {
      // If user is logged in, navigate to checkout
      navigate("/security/checkout", { state: { payload } });
    } else {
      // If user is not logged in, navigate to guest login with booking data
      navigate("/security/guest-login", {
        state: {
          bookingData: payload,
          returnUrl: "/security/checkout",
        },
      });
    }
    setIsBooking(false);
  };

  // Prefill date range (optional): Could parse from query params if needed

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Book Security Service
      </h2>

      {/* Guard Summary */}
      {(guardName || photo) && (
        <div className="flex items-center gap-3 mb-4">
          {photo && (
            <img
              src={photo}
              alt={guardName || "Guard"}
              className="w-12 h-12 rounded-lg object-cover"
            />
          )}
          <div>
            {guardName && (
              <div className="font-medium text-gray-900">{guardName}</div>
            )}
            <div className="text-sm text-gray-600">
              {localUserCurrency} {Number(displayPrice).toLocaleString()} / day
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleBooking} className="space-y-5">
        {/* Available Guards */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Guards
          </label>
         
        </div> */}

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date and End Date
          </label>

          {/* Date Range */}
          <RangePicker
            placeholder={["Start Date", "End Date"]}
            value={dateRange}
            onChange={setDateRange}
            style={{ width: "100%", height: "48px" }}
            className="border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            disabledDate={(current) =>
              current && current < new Date().setHours(0, 0, 0, 0)
            }
          />
        </div>

        {/* Security Personnel */}
        <div className="space-y-2 h-full flex flex-col">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Security
          </label>
          <Select
            value={personnelCount === 0 ? null : `${personnelCount}`}
            placeholder="0 personnel"
            className="w-full h-full [&>div]:h-full [&>div]:py-2.5 [&>div]:px-3"
            style={{ height: "48px" }}
            dropdownMatchSelectWidth={false}
            dropdownRender={() => (
              <div className="p-4 space-y-4 min-w-[300px]">
                {/* Personnel Counter */}
                <div className="flex justify-between items-center">
                  <Space>
                    <UserOutlined className="text-gray-600" />
                    <span>Security Personnel</span>
                  </Space>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() =>
                        handlePersonnelChange(Math.max(1, personnelCount - 1))
                      }
                      disabled={personnelCount <= 1}
                      className="flex items-center justify-center w-8 h-8"
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{personnelCount}</span>
                    <Button
                      onClick={() => handlePersonnelChange(personnelCount + 1)}
                      disabled={personnelCount >= 10}
                      className="flex items-center justify-center w-8 h-8"
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div className="mt-1 text-sm font-medium">
                  {localUserCurrency} {Number(displayPrice).toLocaleString()}{" "}
                  <span className="text-gray-500 font-normal">/ day</span>
                </div>
              </div>
            )}
          />
        </div>

        {/* Price Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-3">Price Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">
                {localUserCurrency} {Number(displayPrice).toLocaleString()} per
                day per person
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">
                {personnelCount} {personnelCount === 1 ? "person" : "people"}
              </span>
              <span>
                {localUserCurrency}{" "}
                {Number(displayPrice * personnelCount).toLocaleString()} per day
              </span>
            </div>
            {dateRange && dateRange[0] && dateRange[1] && (
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {getDays()} {getDays() === 1 ? "day" : "days"}
                </span>
                <span>
                  {localUserCurrency} {Number(totalAmount).toLocaleString()}
                </span>
              </div>
            )}
            <div className="border-t border-gray-200 my-2"></div>
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>
                {localUserCurrency} {Number(totalAmount).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Book Now Button */}
        <button
          type="submit"
          disabled={isBooking || !dateRange || !dateRange[0] || !dateRange[1]}
          className={`w-full bg-[#0064D2] text-white py-3 px-6 rounded-lg font-medium transition-colors ${
            isBooking || !dateRange || !dateRange[0] || !dateRange[1]
              ? "opacity-70 cursor-not-allowed"
              : "hover:bg-blue-700"
          }`}
        >
          {isBooking ? "Processing..." : "Reserve"}
        </button>
      </form>
    </div>
  );
}
