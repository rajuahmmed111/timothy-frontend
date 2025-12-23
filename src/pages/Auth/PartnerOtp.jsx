import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useVerifyPartnerMutation } from "../../redux/services/authApi";

function VerificationPartnerOtp() {
  const [otp, setotp] = useState(new Array(4).fill(""));
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const [verifyPartner, { isLoading }] = useVerifyPartnerMutation();

  // =========================
  // Get email safely and store in localStorage
  // =========================
  const getEmail = () => {

    const stateEmail = location.state?.email;
    if (stateEmail) {
      localStorage.setItem("userEmail", stateEmail);
      return stateEmail;
    }

    try {
      const registrationData = localStorage.getItem("registrationData");
      if (registrationData) {
        const data = JSON.parse(registrationData);
        if (data.email) {
          localStorage.setItem("userEmail", data.email);
          return data.email;
        }
      }
    } catch (err) {
      console.error("LocalStorage registrationData error", err);
    }

    try {
      const rememberCredentials = localStorage.getItem("rememberCredentials");
  
      if (rememberCredentials) {
        const data = JSON.parse(rememberCredentials);
        if (data.email) {
          localStorage.setItem("userEmail", data.email);
          return data.email;
        }
      }
    } catch (err) {
      console.error("LocalStorage rememberCredentials error", err);
    }

    // Check if email is already stored in localStorage
    try {
      const storedEmail = localStorage.getItem("userEmail");
      if (storedEmail) return storedEmail;
    } catch (err) {
      console.error("LocalStorage userEmail error", err);
    }

    return null;
  };

  const email = getEmail();

  // =========================
  // Handle OTP input change
  // =========================
  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newotp = [...otp];
    newotp[index] = value;
    setotp(newotp);

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  // =========================
  // Handle backspace
  // =========================
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  // =========================
  // Verify OTP
  // =========================
  const handleVerifyotp = async () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 4) {
      setError("Please enter all 4 digits");
      return;
    }

    if (!email) {
      setError("Email not found. Please register again.");
      return;
    }

    try {
      // Use exact format from working example
      const requestBody = {
        email: email.trim(),
        otp: otpValue.trim(),
      };

      await verifyPartner(requestBody).unwrap();

      localStorage.removeItem("registrationData");
      navigate("/login");
    } catch (err) {
      console.error("OTP verification error:", err);
      setError(
        err?.data?.message || "Invalid verification OTP. Please try again."
      );
    }
  };

  // =========================
  // Auto verify when complete
  // =========================
  useEffect(() => {
    if (otp.join("").length === 4) {
      handleVerifyotp();
    }
    // eslint-disable-next-line
  }, [otp]);

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-5">
      <div className="container mx-auto">
        <div className="flex justify-center items-center">
          <div className="w-full lg:w-1/2 bg-white p-5 md:px-18 md:py-28 shadow-[0px_10px_20px_rgba(0,0,0,0.2)] rounded-2xl">
            <h2 className="text-[#0D0D0D] text-2xl font-bold text-center mb-5">
              Verification otp
            </h2>

            <div className="flex flex-col items-center text-center">
              <p className="text-[#6A6D76] mb-2">
                We sent a 4-digit OTP to your email.
              </p>

              {email && (
                <div className="mb-4">
                  <p className="text-[#6A6D76] text-sm mb-1">Email address:</p>
                  <p className="text-blue-600 font-medium text-lg">{email}</p>
                </div>
              )}
            </div>

            {/* OTP Inputs */}
            <div className="flex justify-center gap-3 mt-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 text-2xl text-center border border-gray-400 rounded-lg focus:outline-none focus:border-blue-600"
                />
              ))}
            </div>

            {/* Button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={handleVerifyotp}
                disabled={isLoading}
                className="w-1/3 bg-[#0064D2] text-white font-bold py-3 rounded-lg shadow-lg disabled:opacity-50"
              >
                {isLoading ? "Verifying..." : "Verify otp"}
              </button>
            </div>

            {/* Error */}
            {error && (
              <p className="text-center text-red-500 text-sm mt-3">{error}</p>
            )}

            {/* <p className="text-[#6A6D76] text-center mt-8">
              Didn’t receive the email?{" "}
              <span className="text-[#00B047] cursor-pointer">Resend</span>
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerificationPartnerOtp;
