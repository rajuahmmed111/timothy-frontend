import React, { useState } from "react";
import {
  ShoppingCart,
  ChevronDown,
  Menu,
  X,
  Home,
  Shield,
  Car,
  MapPin,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useGetMyProfileQuery, authApi } from "../../redux/services/authApi";
import { logout } from "../../redux/features/auth/authSlice";
import { Skeleton, Popconfirm } from "antd";

export default function Navbar() {
  const location = useLocation();
  const navItems = [
    {
      name: "Stays",
      url: "/hotel",
      icon: "/navbar/stays.svg",
      routes: [
        "/hotel",
        "/hotel-details",
        "/reserv-details",
        "/booking-confirmation",
        "/hotel/checkout",
        "/hotel/payment",
      ],
    },
    {
      name: "Security",
      url: "/security-reservation",
      icon: "/navbar/security.svg",
      routes: [
        "/security-reservation",
        "/security-details",
        "/security-service-details",
        "/security/checkout",
        "/security/payment",
        "/security/booking-confirmation",
      ],
    },
    {
      name: "Car Rental",
      url: "/car-reservation",
      icon: "/navbar/car.svg",
      routes: [
        "/car-reservation",
        "/car-service-details",
        "/car/checkout",
        "/car/payment",
        "/car/booking-confirmation",
      ],
    },
    {
      name: "Attractions",
      url: "/attraction-reservation",
      icon: "/navbar/attractions.svg",
      routes: [
        "/attraction-reservation",
        "/attraction-details",
        "/event-reservation",
        "/event/checkout",
        "/event/payment",
      ],
    },
  ];

  const isActiveRoute = (item) => {
    return item.routes.some(
      (route) =>
        location.pathname === route || location.pathname.startsWith(route)
    );
  };

  const navigate = useNavigate();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("EN");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const accessToken = useSelector((s) => s?.auth?.accessToken);
  // Use accessToken as an argument to change the cache key when switching users
  const { data: profileRes, isFetching: profileLoading } = useGetMyProfileQuery(accessToken, {
    skip: !accessToken,
    refetchOnMountOrArgChange: true,
  });
  const user = profileRes?.data || null;

  const languages = [
    { code: "EN", name: "English", flag: "/flags/us.svg" },
    { code: "ES", name: "Español", flag: "/flags/es.svg" },
    { code: "FR", name: "Français", flag: "/flags/fr.svg" },
    { code: "DE", name: "Deutsch", flag: "/flags/de.svg" },
    { code: "IT", name: "Italiano", flag: "/flags/it.svg" },
  ];

  const getCurrentFlag = () => {
    return (
      languages.find((lang) => lang.code === selectedLanguage)?.flag ||
      "/flags/us.svg"
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[9999] bg-white border-b border-gray-200">
      <div className="container mx-auto px-5 md:px-0 py-2 lg:py-3">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8  rounded flex items-center justify-center">
                <img src="/logo.svg" alt="logo" />
              </div>
              <span className="text-4xl font-bold text-[#0064D2]">FASIFY</span>
            </div>
          </Link>

          {/* Navigation Pills */}
          <nav className="hidden md:flex">
            <div className="flex items-center bg-[#0064D2] rounded-full p-2">
              {navItems.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.url}
                  id={`nav-item-${index}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActiveRoute(item)
                      ? "bg-white text-[#0064D2] shadow-sm"
                      : "text-white"
                  }`}
                >
                  <img
                    src={item.icon}
                    alt={item.name}
                    className={`${
                      item.icon.includes("car") ? "size-8" : "size-5"
                    } object-contain`}
                    style={{
                      filter: isActiveRoute(item)
                        ? "brightness(0) saturate(100%) invert(25%) sepia(99%) saturate(2613%) hue-rotate(208deg) brightness(98%) contrast(101%)"
                        : "brightness(0) saturate(100%) invert(100%)",
                    }}
                  />
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Language Dropdown - Hidden on mobile */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-1 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <img
                  src={getCurrentFlag()}
                  alt="flag"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-xl font-medium text-gray-700">
                  {selectedLanguage}
                </span>
                <ChevronDown className="w-6 h-6 text-gray-600" />
              </button>

              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => {
                        setSelectedLanguage(language.code);
                        setIsLanguageOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center space-x-2 ${
                        selectedLanguage === language.code
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700"
                      }`}
                    >
                      <img
                        src={language.flag}
                        alt={`${language.name} flag`}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {language.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart - Hidden on mobile */}
            <button className="hidden sm:block p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ShoppingCart className="w-8 h-8 text-gray-600" />
            </button>

            {/* Auth/Profile Area */}
            {accessToken ? (
              // Profile Section with Loading State
              profileLoading ? (
                <div className="hidden sm:flex gap-4 items-center">
                  <Skeleton.Avatar active size="large" />
                  <div className="hidden md:block">
                    <Skeleton.Input active size="small" />
                  </div>
                </div>
              ) : (
                <div className="relative hidden sm:flex items-center">
                  <div className="flex gap-2 items-center">
                    <div
                      onClick={() => setIsProfileMenuOpen((p) => !p)}
                      className="md:w-[50px] md:h-[50px] w-[40px] h-[40px] rounded-full overflow-hidden border border-gray-200 shadow-sm cursor-pointer"
                    >
                      <img
                        src={user?.profileImage || "/default-avatar.png"}
                        alt={user?.fullName || "User"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/default-avatar.png";
                        }}
                      />
                    </div>
                    <div className="text-brandGray font-semibold hidden md:block">
                      <p>{user?.fullName || "User"}</p>
                      <p>{user?.role || "USER"}</p>
                    </div>
                  </div>
                  {/* Dropdown */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          navigate("/dashboard/profile");
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Dashboard
                      </button>
                      <Popconfirm
                        title="Sign out?"
                        description="Are you sure you want to logout?"
                        okText="Yes"
                        cancelText="No"
                        zIndex={10050}
                        getPopupContainer={() => document.body}
                        onConfirm={() => {
                          setIsProfileMenuOpen(false);
                          // Clear RTK Query cache so next user doesn't see stale data
                          dispatch(authApi.util.resetApiState());
                          dispatch(logout());
                          navigate("/");
                        }}
                      >
                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                        >
                          Logout
                        </button>
                      </Popconfirm>
                    </div>
                  )}
                </div>
              )
            ) : (
              <>
                <button
                  onClick={() => navigate("/logIn")}
                  className="hidden sm:block text-gray-700 hover:text-gray-900 font-medium cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/sign-up")}
                  className="hidden sm:block bg-[#0064D2] text-white px-6 py-2 rounded-full cursor-pointer"
                >
                  Sign Up
                </button>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-3">
              {/* Mobile Navigation */}
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.url}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center space-x-3 ${
                      isActiveRoute(item)
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <img
                      src={item.icon}
                      alt={item.name}
                      className={`${
                        item.icon.includes("car") ? "size-6" : "size-5"
                      } object-contain`}
                      style={{
                        filter: isActiveRoute(item)
                          ? "brightness(0) saturate(100%) invert(100%)"
                          : "brightness(0) saturate(100%) invert(25%) sepia(99%) saturate(2613%) hue-rotate(208deg) brightness(98%) contrast(101%)",
                      }}
                    />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>

              {/* Mobile Language Selector */}
              <div className="border-t border-gray-200 pt-3">
                <div className="relative">
                  <button
                    onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <img
                        src={getCurrentFlag()}
                        alt="flag"
                        className="w-5 h-4 rounded-full"
                      />
                      <span>Language ({selectedLanguage})</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </button>

                  {isLanguageOpen && (
                    <div className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      {languages.map((language) => (
                        <button
                          key={language.code}
                          onClick={() => {
                            setSelectedLanguage(language.code);
                            setIsLanguageOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center space-x-2 ${
                            selectedLanguage === language.code
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-700"
                          }`}
                        >
                          <img
                            src={language.flag}
                            alt={`${language.name} flag`}
                            className="w-5 h-4 rounded-full"
                          />
                          <span>{language.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="border-t border-gray-200 pt-3 space-y-2">
                <button className="w-full flex items-center space-x-2 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <ShoppingCart className="w-5 h-5 text-gray-600" />
                  <span>Cart</span>
                </button>
                {accessToken ? (
                  <>
                    <button onClick={() => navigate("/dashboard/profile")} className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      Dashboard
                    </button>
                    <Popconfirm
                      title="Sign out?"
                      description="Are you sure you want to logout?"
                      okText="Yes"
                      cancelText="No"
                      zIndex={10050}
                      getPopupContainer={() => document.body}
                      onConfirm={() => { dispatch(authApi.util.resetApiState()); dispatch(logout()); navigate("/"); }}
                    >
                      <button className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-gray-100 rounded-lg transition-colors">
                        Logout
                      </button>
                    </Popconfirm>
                  </>
                ) : (
                  <>
                    <Link to="/logIn">
                      <button className="cursor-pointer w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        Sign In
                      </button>
                    </Link>
                    <button onClick={() => navigate("/sign-up")} className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors">
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
