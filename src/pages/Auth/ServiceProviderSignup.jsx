import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usePartnerMutation } from "../../redux/services/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Eye, EyeOff } from "lucide-react";
import { countries } from "../../components/country";

export default function ServiceProviderSignup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState("");

  const [registerUser, { isLoading }] = usePartnerMutation();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    country: "",
    serviceType: "",
  });

  /* =====================
     Country auto-detect
  ===================== */
  const providers = [
    { url: "https://ipapi.co/json/", parse: (d) => d.country },
    { url: "https://extreme-ip-lookup.com/json/", parse: (d) => d.countryCode },
    { url: "https://ipinfo.io/json", parse: (d) => d.country },
  ];

  useEffect(() => {
    const detectCountry = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      for (const p of providers) {
        try {
          const res = await fetch(p.url, {
            signal: controller.signal,
            mode: "cors",
          });
          if (!res.ok) continue;

          const data = await res.json();
          const iso = p.parse(data);

          if (iso) {
            const found = countries.find((c) => c.code === iso);
            setForm((prev) => ({
              ...prev,
              country: found ? found.name : "",
            }));
            break;
          }
        } catch (error) {
          // Silent fail - don't show network errors to user
          console.log("Country detection failed:", error.message);
        }
      }

      clearTimeout(timeoutId);
    };

    detectCountry();
  }, []);

  /* =====================
     Handle input
  ===================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* =====================
     Submit form
  ===================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.fullName) {
      setFormError("Please enter your full name");
      return;
    }

    if (!form.email) {
      setFormError("Please enter your email");
      return;
    }

    if (!form.serviceType) {
      setFormError("Please select service type");
      return;
    }

    if (!form.country) {
      setFormError("Please select your country");
      return;
    }

    if (form.password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return;
    }

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
      role: "BUSINESS_PARTNER", // ✅ frontend default role
      status: "INACTIVE",
      country: form.country, // ISO code
      ...serviceFlags,
    };

    try {
      const res = await registerUser(body).unwrap();
      const { accessToken, refreshToken, user } = res?.data || {};

      dispatch(setCredentials({ accessToken, refreshToken, user }));

      // Store registration data for OTP page
      localStorage.setItem(
        "registrationData",
        JSON.stringify({
          email: form.email,
          fullName: form.fullName,
        })
      );

      // remember only email (secure)
      if (rememberMe) {
        localStorage.setItem(
          "rememberCredentials",
          JSON.stringify({ email: form.email })
        );
      } else {
        localStorage.removeItem("rememberCredentials");
      }

      // Navigate with email in state
      navigate("/verification-part-otp", { state: { email: form.email } });
    } catch (err) {
      setFormError(
        err?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-5 my-10">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full lg:w-1/2 bg-white p-6 md:px-18 md:py-28 shadow-[0px_10px_30px_rgba(0,0,0,0.1)] rounded-2xl">
            <h2 className="text-2xl font-bold text-center mb-2">
              Create your business account
            </h2>
            <p className="text-gray-500 text-center mb-8">
              Fill in the details to sign up
            </p>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div>
                <label className="font-semibold">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-md mt-2"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="font-semibold">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-md mt-2"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="font-semibold">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-md mt-2 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {/* Service Type */}
              <div>
                <label className="font-semibold">Service Type</label>
                <select
                  name="serviceType"
                  value={form.serviceType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-md mt-2"
                  required
                >
                  <option value="">Select service type</option>
                  <option value="hotel">Hotel</option>
                  <option value="security">Security</option>
                  <option value="car">Car Rental</option>
                  <option value="attraction">Attraction</option>
                </select>
              </div>

              {/* Country */}
              <div>
                <label className="font-semibold">Country</label>
                <select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-md mt-2"
                  required
                >
                  <option value="">Select country</option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Remember */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="text-gray-600">Remember email</span>
              </div>

              {formError && (
                <p className="text-red-500 text-center">{formError}</p>
              )}

              {/* Buttons */}
              <div className="flex gap-4 justify-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-1/3 bg-blue-600 text-white font-bold py-3 rounded-lg disabled:opacity-60"
                >
                  {isLoading ? "Creating..." : "Create account"}
                </button>

                <Link
                  to="/login"
                  className="w-1/3 text-center border border-blue-600 text-blue-600 font-bold py-3 rounded-lg"
                >
                  Log in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
