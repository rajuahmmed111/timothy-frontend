import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRegisterUserMutation } from "../../redux/services/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/features/auth/authSlice";

import { countries } from "../../components/country";

export default function ServiceProviderSignup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [registerUser, { isLoading, error }] = useRegisterUserMutation();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    country: "",
    serviceType: "",
  });

  const [rememberMe, setRememberMe] = useState(false);

  // Auto-detect providers
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
      name: "ipinfo.io",
      url: "https://ipinfo.io/json",
      parse: (data) => ({ iso: data.country, raw: data }),
    },
  ];

  // Auto detect country
  useEffect(() => {
    const detectCountry = async () => {
      for (const provider of providers) {
        try {
          const res = await fetch(provider.url);
          if (!res.ok) continue;

          const json = await res.json();
          const { iso } = provider.parse(json);

          if (iso) {
            setForm((prev) => ({ ...prev, country: iso }));
            break;
          }
        } catch {}
      }
    };

    detectCountry();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const serviceFlags = {
        isHotel: form.serviceType === "hotel",
        isSecurity: form.serviceType === "security",
        isCar: form.serviceType === "car",
        isAttraction: form.serviceType === "attraction",
      };

      const body = {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        role: "BUSINESS_PARTNER",
        country: form.country,
        ...serviceFlags,
      };

      const res = await registerUser(body).unwrap();
      const { accessToken, refreshToken, user } = res?.data || {};

      dispatch(setCredentials({ accessToken, refreshToken, user }));

      if (rememberMe) {
        localStorage.setItem(
          "rememberCredentials",
          JSON.stringify({ email: form.email, password: form.password })
        );
      } else {
        localStorage.removeItem("rememberCredentials");
      }

      navigate("/");
    } catch (err) {
      console.error("Registration failed", err);
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-5 my-10">
      <div className="container mx-auto">
        <div className="flex justify-center items-center">
          <div className="w-full lg:w-1/2 bg-white p-5 md:px-18 md:py-28 shadow-[0px_10px_30px_rgba(0,0,0,0.1)] rounded-2xl">
            <h2 className="text-[#0D0D0D] text-2xl font-bold text-center mb-5">
              Create your business account
            </h2>
            <p className="text-[#6A6D76] text-center mb-10">
              Fill in the details to sign up.
            </p>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="w-full">
                <label className="text-xl font-bold">Full name</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border-2 border-gray-400 rounded-md mt-2"
                  required
                />
              </div>

              {/* Email */}
              <div className="w-full">
                <label className="text-xl font-bold">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border-2 border-gray-400 rounded-md mt-2"
                  required
                />
              </div>

              {/* Service Type */}
              <div className="w-full">
                <label className="text-xl font-bold">Service Type</label>
                <select
                  name="serviceType"
                  value={form.serviceType}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border-2 border-gray-400 rounded-md mt-2"
                  required
                >
                  <option value="">Select service type</option>
                  <option value="hotel">Hotel</option>
                  <option value="security">Security</option>
                  <option value="car">Car Rental</option>
                  <option value="attraction">Attraction</option>
                </select>
              </div>

              {/* Country Dropdown - FULL LIST */}
              <div className="w-full">
                <label className="text-xl font-bold">Country</label>
                <select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border-2 border-gray-400 rounded-md mt-2"
                  required
                >
                  <option value="">Select your country</option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="text-gray-600">Remember credentials</span>
              </div>

              {/* Buttons */}
              <div className="flex justify-center gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-1/3 bg-blue-600 text-white font-bold py-3 rounded-lg disabled:opacity-60"
                >
                  {isLoading ? "Creating..." : "Create account"}
                </button>

                <Link
                  to="/logIn"
                  className="w-1/3 text-center border border-blue-600 text-blue-600 font-bold py-3 rounded-lg"
                >
                  Log in
                </Link>
              </div>

              {error && (
                <p className="text-red-500 text-center mt-4">
                  {error?.data?.message || "Registration failed"}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
