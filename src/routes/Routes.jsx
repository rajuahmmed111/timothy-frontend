import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import Home from "../pages/Home/Home";
import AboutFasify from "../pages/AboutFasify/AboutFasify";
import Offers from "../pages/Offers/Offers";
import PrivacyPolicy from "../pages/Legal/PrivacyPolicy";
import TermsAndConditions from "../pages/Legal/TermsAndConditions";
import CancelReservation from "../pages/Help/CancelReservation";
import RefundPolicies from "../pages/Help/RefundPolicies";
import DisputeResolution from "../pages/Help/DisputeResolution";
import ContactUs from "../pages/Contact/ContactUs";
import Newsroom from "../pages/Newsroom/Newsroom";
import FasifyCouponUsage from "../pages/Help/FasifyCouponUsage";
import FasifyRewards from "../pages/FasifyRewards/FasifyRewards";
import Advertising from "../pages/Advertising/Advertising";
import Sitemap from "../pages/Sitemap/Sitemap";
import InvestorRelations from "../pages/InvestorRelations/InvestorRelations";
import HotelReservation from "../pages/HotelReservation/HotelReservation";
import HotelDetails from "../pages/HotelReservation/HotelDetails";
import ReservationDetails from "../pages/HotelReservation/ReservationDetails";
import BookingConfirmation from "../pages/HotelReservation/BookingConfirmation";
import HotelPaymentPage from "../pages/HotelReservation/PaymentPage";
import Checkout from "../pages/HotelReservation/Checkout";
import SecurityReservation from "../pages/SecurityReservation/SecurityReservation";
import SecurityDetails from "../pages/SecurityReservation/SecurityDetails";
import SecurityServiceDetails from "../pages/SecurityReservation/SecurityServiceDetails";
import SecurityProtocolDetails from "../pages/SecurityReservation/SecurityProtocolDetails";
import SecurityServiceList from "../pages/SecurityReservation/SecurityServiceList";
import SecurityPaymentConfirm from "../pages/SecurityReservation/SecurityPaymentConfirm";
import SecurityCheckout from "../pages/SecurityReservation/SecurityCheckout";
import SecurityPaymentPage from "../pages/Payment/PaymentPage";
import SecurityBookingConfirmation from "../pages/SecurityReservation/SecurityBookingConfirmation";
import CarReservation from "../pages/CarReservation/CarReservation";
import CarDetails from "../pages/CarReservation/CarDetails";
import CarServiceDetails from "../pages/CarReservation/CarServiceDetails";
import CarCheckout from "../pages/CarReservation/CarCheckout";
import CarPaymentPage from "../pages/CarReservation/CarPaymentPage";
import CarBookingConfirmation from "../pages/CarReservation/CarBookingConfirmation";
import PopularCarPage from "../pages/CarReservation/PopularCarPage";
import AttractionReservation from "../pages/AttractionReservation/AttractionReservation";
import AttractionsDetailsPage from "../pages/AttractionReservation/AttractionsDetailsPage";
import EventReservationPage from "../pages/AttractionReservation/EventReservationPage";
import EventCheckout from "../pages/AttractionReservation/EventCheckout";
import EventPaymentPage from "../pages/AttractionReservation/EventPaymentPage";
import EventBookingConfirmation from "../pages/AttractionReservation/EventBookingConfirmation";
import DashboardLayout from "../layout/DashboardLayout";
import Profile from "../pages/Dashboard/Profile/Profile";

import HotelManagement from "../pages/Dashboard/HotelManagement/HotelManagement";
import CreateHotelRoom from "../components/Hotel/CreateHotelRoom";

import MyVouchers from "../pages/Dashboard/MyVouchers/MyVouchers";
import LogIn from "../pages/Auth/LogIn";
import ForgetPassword from "../pages/Auth/ForgetPassword";
import VerificationCode from "../pages/Auth/Otp";
import ResetPassword from "../pages/Auth/ResetPassword";
import SignUp from "../pages/Auth/SignUp";
import SecurityManagement from "../pages/Dashboard/SecurityManagement/SecurityManagement";
import CarManagement from "../pages/Dashboard/CarManagement/CarManagement";
import AttractionManagement from "../pages/Dashboard/AttractionManagement/AttractionManagement";
import ReviewBusiness from "../components/Hotel/ReviewBusiness";
import MyBookings from "../pages/Dashboard/Mybookings/MyBookings";
import HumanRightsStatement from "../pages/Legal/HumanRightsStatement";
import PrivateRoute from "./guards/PrivateRoute";
import RoleRoute from "./guards/RoleRoute";
import AddSecurityBusiness from "../components/Security/AddSecurityBusiness";
import HotelAllImage from "../pages/HotelReservation/HotelAllImage";
import GuastLogin from "../pages/HotelReservation/GuastLogin";
import SecurityGuestLogin from "../pages/SecurityReservation/SecurityGuestLogin";
import PaymentConfirm from "../pages/HotelReservation/PaymentConfirm";
import AddNewSecurity from "../components/Security/AddNewSecurity";
import EventGuastLogin from "../pages/AttractionReservation/EventGuastLogin";
import EventPaymentConfirm from "../pages/AttractionReservation/EventPaymentConfirm";
import CarGuestLogin from "../pages/CarReservation/CarGuestLogin";
import BookingCancellation from "./../pages/HotelReservation/BookingCancellation";
import ServiceProviderSignup from "../pages/Auth/ServiceProviderSignup";
import CreateCar from "../components/Car/AddNewCar";
import AddNewCar from "../components/Car/AddNewCar";
import AddAttraction from "../components/Attraction/AddAttraction";
import VerificationPartnerOtp from "../pages/Auth/PartnerOtp";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      // <PrivateRoute>
      <Layout />
      // </PrivateRoute>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <AboutFasify />,
      },
      {
        path: "/offers",
        element: <Offers />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/terms-and-conditions",
        element: <TermsAndConditions />,
      },
      {
        path: "/cancel-reservation",
        element: <CancelReservation />,
      },
      {
        path: "/refund-policies",
        element: <RefundPolicies />,
      },
      {
        path: "/dispute-resolution",
        element: <DisputeResolution />,
      },
      {
        path: "/contact-us",
        element: <ContactUs />,
      },
      {
        path: "/newsroom",
        element: <Newsroom />,
      },
      {
        path: "/advertising",
        element: <Advertising />,
      },
      {
        path: "/investor-relations",
        element: <InvestorRelations />,
      },
      {
        path: "/fasify-rewards",
        element: <FasifyRewards />,
      },
      {
        path: "/sitemap",
        element: <Sitemap />,
      },
      {
        path: "/fasify-coupon-usage",
        element: <FasifyCouponUsage />,
      },
      {
        path: "/human-rights-statement",
        element: <HumanRightsStatement />,
      },
      {
        path: "/hotel",
        element: <HotelReservation />,
      },
      {
        path: "/hotel-details/:id",
        element: <HotelDetails />,
      },
      {
        path: "/hotel-details/images",
        element: <HotelAllImage />,
      },
      {
        path: "/hotel-details/selectedhotel",
        element: <HotelDetails />,
      },
      {
        path: "/hotel/guest-login",
        element: <GuastLogin />,
      },
      {
        path: "/reserv-details",
        element: <ReservationDetails />,
      },
      {
        path: "/booking-confirmation", // this is for stays booking confirmation
        element: <BookingConfirmation />,
      },
      {
        path: "/booking-cancellation",
        element: <BookingCancellation />,
      },
      {
        path: "/hotel/checkout",
        element: <Checkout />,
      },
      {
        path: "/hotel/payment-confirm",
        element: <PaymentConfirm />,
      },
      {
        path: "/hotel/payment",
        element: <HotelPaymentPage />,
      },
      {
        path: "/security/checkout",
        element: <SecurityCheckout />,
      },

      {
        path: "/security/payment",
        element: <SecurityPaymentPage />,
      },
      {
        path: "/security/payment-confirm",
        element: <SecurityPaymentConfirm />,
      },
      {
        path: "/security-reservation",
        element: <SecurityReservation />,
      },
      {
        path: "/security-details",
        element: <SecurityDetails />,
      },
      {
        path: "/security/guest-login",
        element: <SecurityGuestLogin />,
      },
      {
        path: "/security-service-details/:id",
        element: <SecurityServiceDetails />,
      },
      {
        path: "/security-protocol-details/:id",
        element: <SecurityProtocolDetails />,
      },
      {
        path: "/security/services/:type",
        element: <SecurityServiceList />,
      },
      {
        path: "/security/booking-confirmation",
        element: <SecurityBookingConfirmation />,
      },
      {
        path: "/car-reservation",
        element: <CarReservation />,
      },
      {
        path: "/car-details",
        element: <CarDetails />,
      },
      {
        path: "/car-service-details/:id",
        element: <CarServiceDetails />,
      },
      {
        path: "/car-booking/:id",
        element: <CarServiceDetails />,
      },
      {
        path: "/car/checkout",
        element: <CarCheckout />,
      },
      {
        path: "/car/guest-login",
        element: <CarGuestLogin />,
      },
      {
        path: "/car/payment",
        element: <CarPaymentPage />,
      },
      {
        path: "/car/booking-confirmation",
        element: <CarBookingConfirmation />,
      },
      {
        path: "/popular-car",
        element: <PopularCarPage />,
      },

      {
        path: "/attraction-reservation",
        element: <AttractionReservation />,
      },
      {
        path: "/attraction-details",
        element: <AttractionsDetailsPage />,
      },
      {
        path: "/event-reservation/:id",
        element: <EventReservationPage />,
      },
      {
        path: "/event/checkout",
        element: <EventCheckout />,
      },
      {
        path: "/event/payment",
        element: <EventPaymentPage />,
      },
      {
        path: "/event/payment-confirm/:id",
        element: <EventPaymentConfirm />,
      },
      {
        path: "/event/guest-login",
        element: <EventGuastLogin />,
      },
      {
        path: "/event/booking-confirmation",
        element: <EventBookingConfirmation />,
      },
      {
        path: "/logIn",
        element: <LogIn />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        path: "/service-provider/sign-up",
        element: <ServiceProviderSignup />,
      },
      {
        path: "/forget-password",
        element: <ForgetPassword />,
      },
      {
        path: "/verification-code",
        element: <VerificationCode />,
      },
      {
        path: "/verification-part-otp",
        element: <VerificationPartnerOtp />,
      },
      {
        path: "/new-password",
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "profile",
        element: <Profile />,
      },

      //service provider routes (BUSINESS_PARTNER only)
      {
        path: "hotel-management",
        element: (
          <RoleRoute allowed={["BUSINESS_PARTNER"]}>
            <HotelManagement />
          </RoleRoute>
        ),
      },
      {
        path: "add-listing",
        element: (
          <RoleRoute allowed={["BUSINESS_PARTNER"]}>
            <CreateHotelRoom />
          </RoleRoute>
        ),
      },
      {
        path: "security-management",
        element: (
          <RoleRoute allowed={["BUSINESS_PARTNER"]}>
            <SecurityManagement />
          </RoleRoute>
        ),
      },
      {
        path: "add-car",
        element: (
          <RoleRoute allowed={["BUSINESS_PARTNER"]}>
            <AddNewCar />,
          </RoleRoute>
        ),
      },
      {
        path: "add-security-listing",
        element: (
          <RoleRoute allowed={["BUSINESS_PARTNER"]}>
            <AddNewSecurity />
          </RoleRoute>
        ),
      },
      {
        path: "car-management",
        element: (
          <RoleRoute allowed={["BUSINESS_PARTNER"]}>
            <CarManagement />
          </RoleRoute>
        ),
      },
      {
        path: "attraction-management",
        element: (
          <RoleRoute allowed={["BUSINESS_PARTNER"]}>
            <AttractionManagement />
          </RoleRoute>
        ),
      },
      {
        path: "add-attraction",
        element: (
          <RoleRoute allowed={["BUSINESS_PARTNER"]}>
            <AddAttraction />
          </RoleRoute>
        ),
      },

      {
        path: "my-vouchers",
        element: <MyVouchers />,
      },
      {
        path: "my-bookings",
        element: <MyBookings />,
      },
      {
        path: "review-business",
        element: <ReviewBusiness />,
      },
    ],
  },
]);
