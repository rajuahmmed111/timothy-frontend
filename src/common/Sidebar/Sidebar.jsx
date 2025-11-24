import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetMyProfileQuery } from "../../redux/services/authApi";

import {
  MessageSquare,
  List,
  Pin,
  Mail,
  User,
  X,
  ChevronLeft,
  ChevronRight,
  Package,
  ReceiptText,
} from "lucide-react";

// Stripe + Paystack Hooks
import { useStripeAccountOnboardingMutation } from "../../redux/api/onbording/stripe.js";
import { usePaystackAccountSubAccountMutation } from "../../redux/api/onbording/paystack.js";

export default function Sidebar() {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = useSelector((s) => s?.auth?.user);
console.log( "user from sidebar", user)
  // Payment dropdown
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);
  const [stripeStatus, setStripeStatus] = useState(null);
  const [paystackStatus, setPaystackStatus] = useState(null);
  const [showPaystackModal, setShowPaystackModal] = useState(false);
  const [paystackFormData, setPaystackFormData] = useState({
    business_name: "",
    settlement_bank: "",
    account_number: "",
    percentage_charge: 15,
  });

  const accessToken = useSelector((s) => s?.auth?.accessToken);

  const { data: profileRes } = useGetMyProfileQuery(undefined, {
    skip: !accessToken,
  });

  const role = profileRes?.data?.role;

  // Hooks for API Mutations
  const [stripeAccountOnboarding] = useStripeAccountOnboardingMutation();
  const [paystackAccountSubAccount] = usePaystackAccountSubAccountMutation();

  // Check Stripe status on component mount
  useEffect(() => {
    const checkStripeStatus = async () => {
      console.log("Checking Stripe status...");
      try {
        const res = await stripeAccountOnboarding({});
        if (res?.data?.data?.status === "verified") {
          setStripeStatus("verified");
        } else if (res?.data?.data?.status === "requirements_due") {
          setStripeStatus("needs_onboarding");
        } else if (res?.data?.data?.onboardingLink) {
          setStripeStatus("needs_onboarding");
        }
      } catch (err) {
        // If error, assume needs onboarding
        setStripeStatus("needs_onboarding");
      }
    };

    const checkPaystackStatus = async () => {
      console.log("Checking Paystack status...");
      try {
        // First try to check status without business data
        // If this fails, we'll know the user needs onboarding
        const res = await paystackAccountSubAccount({});
        console.log("Paystack API response:", res);
        if (
          res?.data?.data?.status === "active" ||
          res?.data?.data?.data?.is_verified
        ) {
          setPaystackStatus(res.data); // Store full response data
        } else {
          setPaystackStatus("needs_onboarding");
        }
      } catch (err) {
        console.log("Paystack API error:", err);
        // If error, assume needs onboarding
        setPaystackStatus("needs_onboarding");
      }
    };

    if (role === "BUSINESS_PARTNER" && accessToken) {
      console.log("User is BUSINESS_PARTNER, checking status...");
      checkStripeStatus();
      checkPaystackStatus();
    } else {
      console.log("User is not BUSINESS_PARTNER or no token", {
        role,
        hasToken: !!accessToken,
      });
    }
  }, [
    role,
    accessToken,
    stripeAccountOnboarding,
    paystackAccountSubAccount,
    paystackFormData,
  ]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <>
      {/* Mobile toggle button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-[84px] left-0 z-50 p-2 rounded-md bg-[#3c3d37] text-white cursor-pointer"
        >
          {sidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`w-70 bg-gray-50 p-4 mt-[150px] ${
          isMobile
            ? `fixed top-0 w-80 pl-10 left-0 h-full z-40 transform ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              } transition-transform duration-300 ease-in-out`
            : ""
        }`}
      >
        {/* Close button for mobile */}
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200"
          >
            <X size={20} />
          </button>
        )}

        {/* Profile */}
        <Section
          isActive={isSectionActive(location.pathname, ["/dashboard/profile"])}
        >
          <SidebarButton
            to="/dashboard/profile"
            icon={<User size={18} />}
            text="My Profile"
            onClick={isMobile ? toggleSidebar : undefined}
          />
        </Section>

        {/* USER Dashboard */}
        {role === "USER" && (
          <Section
            isActive={isSectionActive(location.pathname, [
              "/dashboard/my-bookings",
              "/dashboard/my-vouchers",
            ])}
          >
            <SidebarButton
              to="/dashboard/my-bookings"
              icon={<ReceiptText size={18} />}
              text="My Bookings"
              onClick={isMobile ? toggleSidebar : undefined}
            />
            <SidebarButton
              to="/dashboard/my-vouchers"
              icon={<MessageSquare size={18} />}
              text="My Vouchers"
              onClick={isMobile ? toggleSidebar : undefined}
            />
          </Section>
        )}

        

        

        {/* BUSINESS PARTNER Dashboard */}
        {role === "BUSINESS_PARTNER" && (
          <Section
            isActive={isSectionActive(
              location.pathname,
              [
                user?.isHotel && "/dashboard/hotel-management",
                user?.isSecurity && "/dashboard/security-management",
                user?.isCar && "/dashboard/car-management",
                user?.isAttraction && "/dashboard/attraction-management",
              ].filter(Boolean)
            )}
          >
            {user?.isHotel && (
              <SidebarButton
                to="/dashboard/hotel-management"
                icon={<List size={18} />}
                text="Hotel Management"
                onClick={isMobile ? toggleSidebar : undefined}
              />
            )}

            {user?.isSecurity && (
              <SidebarButton
                to="/dashboard/security-management"
                icon={<Package size={18} />}
                text="Security Management"
                onClick={isMobile ? toggleSidebar : undefined}
              />
            )}

            {user?.isCar && (
              <SidebarButton
                to="/dashboard/car-management"
                icon={<Pin size={18} />}
                text="Car Management"
                onClick={isMobile ? toggleSidebar : undefined}
              />
            )}

            {/* Attraction + Payment Dropdown */}
            {user?.isAttraction && (
              <div className="relative">
                <SidebarButton
                  to="/dashboard/attraction-management"
                  icon={<Mail size={18} />}
                  text="Attraction Management"
                  onClick={isMobile ? toggleSidebar : undefined}
                />
              </div>
            )}

            <div>
              {/* Dropdown toggle */}
              <button
                onClick={() => setShowPaymentDropdown((prev) => !prev)}
                className="ml-6 mt-1 text-sm text-blue-600 hover:underline"
              >
                Payment Options ▼
              </button>

              {/* Dropdown menu */}
              {showPaymentDropdown && (
                <div className="ml-6 mt-2 bg-white border rounded shadow p-2 w-52 absolute z-50">
                  {/* Stripe */}
                  <button
                    onClick={async () => {
                      try {
                        const res = await stripeAccountOnboarding({});
                        if (res?.data?.data?.onboardingLink) {
                          window.location.href = res.data.data.onboardingLink;
                        } else if (res?.data?.data?.status === "verified") {
                          alert("Your Stripe account is already verified!");
                        } else {
                          alert("Stripe onboarding failed");
                        }
                      } catch (err) {
                        console.log(err);
                        alert("Stripe error");
                      }
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center gap-2"
                  >
                    <span>
                      {stripeStatus === "verified"
                        ? "Stripe (Verified)"
                        : "Stripe (Onboard)"}
                    </span>
                  </button>

                  {/* Paystack */}
                  <button
                    onClick={() => {
                      if (
                        paystackStatus?.data?.status === "active" ||
                        paystackStatus?.data?.data?.data?.is_verified
                      ) {
                        alert("Your Paystack account is already verified!");
                      } else {
                        setShowPaystackModal(true);
                      }
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center gap-2"
                  >
                    <span>
                      {paystackStatus?.data?.status === "active" ||
                      paystackStatus?.data?.data?.data?.is_verified
                        ? "PayStack (Verified)"
                        : "PayStack (Onboard)"}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </Section>
        )}
      </div>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Paystack Modal */}
      {showPaystackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Paystack Business Information
              </h3>
              <button
                onClick={() => setShowPaystackModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();

                try {
                  const res = await paystackAccountSubAccount(paystackFormData);
                  if (res?.data?.data?.integration_url) {
                    window.location.href = res.data.data.integration_url;
                  } else {
                    alert("Paystack onboarding failed");
                  }
                } catch (err) {
                  console.log(err);
                  alert("Paystack error");
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={paystackFormData.business_name}
                  onChange={(e) =>
                    setPaystackFormData((prev) => ({
                      ...prev,
                      business_name: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Oasis Dev Test"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Settlement Bank Code *
                </label>
                <input
                  type="text"
                  required
                  value={paystackFormData.settlement_bank}
                  onChange={(e) =>
                    setPaystackFormData((prev) => ({
                      ...prev,
                      settlement_bank: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 057"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number *
                </label>
                <input
                  type="text"
                  required
                  value={paystackFormData.account_number}
                  onChange={(e) =>
                    setPaystackFormData((prev) => ({
                      ...prev,
                      account_number: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 0000000000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Percentage Charge
                </label>
                <input
                  type="number"
                  value={paystackFormData.percentage_charge}
                  onChange={(e) =>
                    setPaystackFormData((prev) => ({
                      ...prev,
                      percentage_charge: parseInt(e.target.value) || 15,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  max="100"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPaystackModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function Section({ title, children, isActive }) {
  return (
    <div className="mb-6">
      <h3
        className={`font-semibold mb-2 ${
          isActive ? "text-blue-600" : "text-black"
        }`}
      >
        {title}
      </h3>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function SidebarButton({ to, icon, text, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded-md bg-white transition ${
          isActive
            ? "!bg-[#3b82f6] text-white shadow-[inset_0_4px_6px_rgba(0,0,0,0.3)]"
            : "shadow-[inset_0_-4px_6px_rgba(0,0,0,0.05)] hover:bg-blue-100"
        }`
      }
    >
      {icon}
      <span>{text}</span>
    </NavLink>
  );
}

function isSectionActive(pathname, routes) {
  return routes.some((route) => pathname.startsWith(route));
}
