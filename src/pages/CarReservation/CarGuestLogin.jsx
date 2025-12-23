import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Country } from "country-state-city";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { useGuestLoginMutation } from "../../redux/api/security/securityApi";

/**
 * Robust GuestLogin with geo-IP auto-detect fallback and debugging helpers.
 */

export default function GuestLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state?.bookingData;
  const returnUrl = location.state?.returnUrl || "/hotel/checkout";
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      navigate(returnUrl, {
        state: {
          bookingData,
          userType: "registered",
        },
      });
    }
  }, [token, navigate, returnUrl, bookingData]);

  const [guestInfo, setGuestInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
  });

  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoNote, setInfoNote] = useState(""); // small user-visible note (e.g. "Auto-detect failed")
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  const countries = Country.getAllCountries();
  const [selectedCountry, setSelectedCountry] = useState(null);

  const countriesReady = useRef(false);
  useEffect(() => {
    if (countries && countries.length > 0) {
      countriesReady.current = true;
      // set default only if not already chosen
      setSelectedCountry((prev) => prev || countries[0]);
    }
  }, [countries]);

  const dispatch = useDispatch();
  const [loginWebsite] = useGuestLoginMutation();

  const handleGuestInfoChange = (field, value) => {
    setGuestInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isoToFlag = (isoCode) => {
    if (!isoCode) return "";
    try {
      const codePoints = isoCode
        .toUpperCase()
        .split("")
        .map((char) => 127397 + char.charCodeAt(0));
      return String.fromCodePoint(...codePoints);
    } catch {
      return "";
    }
  };

  const handleCountrySelect = (isoCode) => {
    const country = countries.find((c) => c.isoCode === isoCode);
    if (country) {
      setSelectedCountry(country);
      setGuestInfo((prev) => ({ ...prev, country: country.name }));
      setInfoNote(""); // clear note if user picks manually
    }
    setIsCountryDropdownOpen(false);
  };

  // small helper: fetch with timeout
  const fetchWithTimeout = async (url, opts = {}, timeout = 5000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(url, { ...opts, signal: controller.signal });
      clearTimeout(id);
      return res;
    } catch (err) {
      clearTimeout(id);
      throw err;
    }
  };

  // Try multiple geo IP providers (fallback chain)
  const detectCountryByIP = async () => {
    // Only try once countries are ready
    if (!countriesReady.current) {
      return;
    }

    const providers = [
      {
        name: "ipapi.co",
        url: "https://ipapi.co/json/",
        parse: (data) => ({ iso: data.country, raw: data }),
      },
      {
        name: "extreme-ip-lookup",
        url: "https://extreme-ip-lookup.com/json/",
        parse: (data) => ({ iso: data.countryCode, raw: data }),
      },
      {
        // No token ipinfo may still work for some requests; keep as fallback
        name: "ipinfo.io",
        url: "https://ipinfo.io/json",
        parse: (data) => ({ iso: data.country, raw: data }),
      },
    ];

    let lastError = null;

    for (const p of providers) {
      try {
        const res = await fetchWithTimeout(p.url, {}, 5000);
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`HTTP ${res.status} - ${txt}`);
        }
        const data = await res.json();
        const parsed = p.parse(data);
        if (parsed && parsed.iso) {
          const iso = parsed.iso.toUpperCase();
          const country = countries.find((c) => c.isoCode === iso);
          if (country) {
            setSelectedCountry(country);
            setGuestInfo((prev) => ({ ...prev, country: country.name }));
            setInfoNote(""); // success, clear note
            return { provider: p.name, country };
          } else {
            // provider returned iso that we don't have in countries list
            lastError = new Error(
              `Provider ${p.name} returned ISO ${parsed.iso} not found in package list`
            );
            console.warn(lastError.message);
          }
        } else {
          lastError = new Error(`Provider ${p.name} returned no iso`);
          console.warn(lastError.message, data);
        }
      } catch (err) {
        lastError = err;
        console.warn(`Geo provider ${p.name} failed:`, err);
      }
    }

    // all providers failed
    setInfoNote(
      "Auto-detect country failed — please select your country manually."
    );
    console.error("Geo-detect all providers failed:", lastError);
    return null;
  };

  // Run detect once when countries are ready. Also allow retry on fullscreen manual action.
  useEffect(() => {
    let mounted = true;
    const tryDetect = async () => {
      try {
        await detectCountryByIP();
      } catch (err) {
        console.warn("detectCountryByIP threw:", err);
      }
    };

    // if countries already loaded, detect immediately, otherwise wait until they load
    if (countriesReady.current) {
      tryDetect();
    } else {
      // wait briefly and then try (in case countries arrive soon)
      const id = setTimeout(() => {
        if (mounted && countries && countries.length > 0) {
          tryDetect();
        }
      }, 300);
      return () => {
        mounted = false;
        clearTimeout(id);
      };
    }
  }, [countries]);

  // Expose a manual retry (useful in UI or console)
  const manualRetryDetect = async () => {
    setInfoNote("Retrying auto-detect...");
    await detectCountryByIP();
  };

  const handleGuestLoginThenProceed = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoginLoading(true);

    if (!guestInfo.fullName || !guestInfo.email || !guestInfo.phone) {
      alert("Please fill in all required fields");
      setIsLoginLoading(false);
      return;
    }

    try {
      const contactNumber = `${
        selectedCountry?.phonecode ? `+${selectedCountry.phonecode}` : ""
      }${guestInfo.phone}`;

      const payload = {
        fullName: guestInfo.fullName,
        email: guestInfo.email,
        contactNumber,
        country: guestInfo.country,
        role: "USER",
      };

      const res = await loginWebsite(payload).unwrap();
      const accessToken = res?.data?.accessToken || res?.accessToken;
      const authUser = res?.data?.user || res?.user;

      if (accessToken) {
        try {
          localStorage.setItem("accessToken", accessToken);
        } catch {}
        dispatch(setCredentials({ accessToken, user: authUser }));
      }

      const updatedBookingData = {
        ...bookingData,
        user: {
          _id: authUser?._id || "guest",
          id: authUser?._id || "guest",
          name: guestInfo.fullName,
          fullName: guestInfo.fullName,
          email: guestInfo.email,
          phone: contactNumber,
          contactNo: contactNumber,
          address: guestInfo.country, // Using country as address since that's what CarCheckout expects
          country: guestInfo.country,
        },
        userInfo: {
          id: authUser?._id || "guest",
          name: guestInfo.fullName,
          email: guestInfo.email,
          phone: contactNumber,
          contactNo: contactNumber,
          address: guestInfo.country,
          country: guestInfo.country,
        },
      };

      localStorage.setItem(
        "guestInfo",
        JSON.stringify({
          ...guestInfo,
          countryCode: selectedCountry?.phonecode
            ? `+${selectedCountry.phonecode}`
            : "",
        })
      );

      navigate(returnUrl, {
        state: {
          bookingData: updatedBookingData,
          guestInfo: {
            ...guestInfo,
            countryCode: selectedCountry?.phonecode
              ? `+${selectedCountry.phonecode}`
              : "",
          },
          userType: authUser?._id ? "registered" : "guest",
        },
      });
    } catch (error) {
      console.error("Error during guest login:", error);
      setError(
        error?.data?.message ||
          error?.message ||
          "An error occurred during login"
      );
    } finally {
      setIsLoginLoading(false);
    }
  };

  return (
    <div>
      <div className="min-h-screen items-center flex justify-between bg-gray-50 py-8">
        <div className="container mx-auto px-4 lg:max-w-[800px]">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Personal Information
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {infoNote && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded">
                {infoNote}{" "}
                <button
                  onClick={manualRetryDetect}
                  className="underline text-sm ml-2"
                  type="button"
                >
                  Retry
                </button>
              </div>
            )}

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={guestInfo.fullName}
                  onChange={(e) =>
                    handleGuestInfoChange("fullName", e.target.value)
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Enter your first name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={guestInfo.email}
                  onChange={(e) =>
                    handleGuestInfoChange("email", e.target.value)
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>

                <div className="flex">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setIsCountryDropdownOpen(!isCountryDropdownOpen)
                      }
                      className="flex items-center justify-between px-4 py-3 border border-gray-300 rounded-l-lg bg-white"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">
                          {isoToFlag(selectedCountry?.isoCode)}
                        </span>
                        <span className="text-sm font-medium">
                          {selectedCountry?.phonecode
                            ? `+${selectedCountry.phonecode}`
                            : ""}
                        </span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>

                    {isCountryDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                        {countries.map((country) => (
                          <button
                            key={country.isoCode}
                            type="button"
                            onClick={() => handleCountrySelect(country.isoCode)}
                            className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 text-left"
                          >
                            <span className="text-lg">
                              {isoToFlag(country.isoCode)}
                            </span>
                            <span className="text-sm font-medium">
                              {country.phonecode ? `+${country.phonecode}` : ""}
                            </span>
                            <span className="text-sm text-gray-500">
                              {country.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <input
                    type="tel"
                    value={guestInfo.phone}
                    onChange={(e) =>
                      handleGuestInfoChange("phone", e.target.value)
                    }
                    required
                    className="flex-1 px-4 py-3 border border-l-0 border-gray-300 rounded-r-lg focus:ring-2 focus:ring-sky-500"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <select
                  value={selectedCountry?.isoCode || ""}
                  onChange={(e) => handleCountrySelect(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white"
                >
                  {countries.map((c) => (
                    <option key={c.isoCode} value={c.isoCode}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGuestLoginThenProceed}
                  disabled={isLoginLoading}
                  className={`w-full bg-gray-800 text-white py-3 px-6 rounded-lg font-medium ${
                    isLoginLoading
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-gray-900"
                  }`}
                >
                  {isLoginLoading ? "Logging in..." : "Continue"}
                </button>
              </div>
            </form>

            <div className="mt-4 text-xs text-gray-500">
              <p>
                Debug: If auto-detect fails, check browser console & network
                tab.
              </p>
              <p>
                Common issues: blocked by CORS, running on http://localhost
                without HTTPS, or provider rate-limit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
