import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../layout/Layout';
import Home from '../pages/Home/Home';
import AboutFasify from '../pages/AboutFasify/AboutFasify';
import Offers from '../pages/Offers/Offers';
import PrivacyPolicy from '../pages/Legal/PrivacyPolicy';
import TermsAndConditions from '../pages/Legal/TermsAndConditions';
import CancelReservation from '../pages/Help/CancelReservation';
import RefundPolicies from '../pages/Help/RefundPolicies';
import DisputeResolution from '../pages/Help/DisputeResolution';
import HotelReservation from '../pages/HotelReservation/HotelReservation';
import HotelDetails from '../pages/HotelReservation/HotelDetails';
import ReservationDetails from '../pages/HotelReservation/ReservationDetails';
import BookingConfirmation from '../pages/HotelReservation/BookingConfirmation';
import HotelPaymentPage from '../pages/HotelReservation/PaymentPage';
import SecurityReservation from '../pages/SecurityReservation/SecurityReservation';
import SecurityDetails from '../pages/SecurityReservation/SecurityDetails';
import SecurityServiceDetails from '../pages/SecurityReservation/SecurityServiceDetails';
import SecurityPaymentPage from '../pages/Payment/PaymentPage';
import SecurityBookingConfirmation from '../pages/SecurityReservation/SecurityBookingConfirmation';
import CarReservation from '../pages/CarReservation/CarReservation';
import CarDetails from '../pages/CarReservation/CarDetails';
import CarServiceDetails from '../pages/CarReservation/CarServiceDetails';
import CarPaymentPage from '../pages/CarReservation/CarPaymentPage';
import CarBookingConfirmation from '../pages/CarReservation/CarBookingConfirmation';
import PopularCarPage from '../pages/CarReservation/PopularCarPage';
import AttractionReservation from '../pages/AttractionReservation/AttractionReservation';
import AttractionsDetailsPage from '../pages/AttractionReservation/AttractionsDetailsPage';
import EventReservationPage from '../pages/AttractionReservation/EventReservationPage';
import EventPaymentPage from '../pages/AttractionReservation/EventPaymentPage';
import EventBookingConfirmation from '../pages/AttractionReservation/EventBookingConfirmation';
import DashboardLayout from '../layout/DashboardLayout';
import Profile from '../pages/Dashboard/Profile/Profile';

import HotelManagement from '../pages/Dashboard/Profile/HotelManagement/HotelManagement';

import MyVouchers from '../pages/Dashboard/MyVouchers/MyVouchers';
import PaymentMethods from '../pages/Dashboard/PaymentMethods/PaymentMethods';
import MyBookings from '../pages/Dashboard/MyBookings/MyBookings';
import LogIn from '../pages/Auth/LogIn';
import ForgetPassword from '../pages/Auth/ForgetPassword';
import VerificationCode from '../pages/Auth/Otp';
import ResetPassword from '../pages/Auth/ResetPassword';


export const routes = createBrowserRouter([
    {
        path: '/',
        element: (
            // <PrivateRoute>
            <Layout />
            // </PrivateRoute>
        ),
        children: [
            {
                path: '/',
                element: <Home />,
            },
            {
                path: '/about',
                element: <AboutFasify />,
            },
            {
                path: '/offers',
                element: <Offers />,
            },
            {
                path: '/privacy-policy',
                element: <PrivacyPolicy />,
            },
            {
                path: '/terms-and-conditions',
                element: <TermsAndConditions />,
            },
            {
                path: '/cancel-reservation',
                element: <CancelReservation />,
            },
            {
                path: '/refund-policies',
                element: <RefundPolicies />,
            },
            {
                path: '/dispute-resolution',
                element: <DisputeResolution />,
            },
            {
                path: '/hotel',
                element: <HotelReservation />,
            },
            {
                path: '/hotel-details',
                element: <HotelDetails />,
            },
            {
                path: '/reserv-details',
                element: <ReservationDetails />,
            },
            {
                path: '/booking-confirmation',
                element: <BookingConfirmation />,
            },
            {
                path: '/hotel/payment',
                element: <HotelPaymentPage />,
            },
            {
                path: '/security/payment',
                element: <SecurityPaymentPage />,
            },
            {
                path: '/security-reservation',
                element: <SecurityReservation />,
            },
            {
                path: '/security-details',
                element: <SecurityDetails />,
            },
            {
                path: '/security-service-details',
                element: <SecurityServiceDetails />,
            },
            {
                path: '/security/booking-confirmation',
                element: <SecurityBookingConfirmation />,
            },
            {
                path: '/car-reservation',
                element: <CarReservation />,
            },
            {
                path: '/car-details',
                element: <CarDetails />,
            },
            {
                path: '/car-service-details',
                element: <CarServiceDetails />,
            },
            {
                path: '/car/payment',
                element: <CarPaymentPage />,
            },
            {
                path: '/car/booking-confirmation',
                element: <CarBookingConfirmation />,
            },
            {
                path: '/popular-car',
                element: <PopularCarPage />,
            },
            {
                path: '/attraction-reservation',
                element: <AttractionReservation />,
            },
            {
                path: '/attraction-details',
                element: <AttractionsDetailsPage />,
            },
            {
                path: '/event-reservation',
                element: <EventReservationPage />,
            },
            {
                path: '/event/payment',
                element: <EventPaymentPage />,
            },
            {
                path: '/event/booking-confirmation',
                element: <EventBookingConfirmation />,
            },
            {
                path: "/logIn",
                element: <LogIn />
            },
            {
                path: "/forget-password",
                element: <ForgetPassword />
            },
            {
                path: "/verification-code",
                element: <VerificationCode />
            },
            {
                path: "/new-password",
                element: <ResetPassword />
            },
        ],
    },
    {
        path: "/dashboard",
        element: (
            <DashboardLayout />
        ),
        children: [
            {
                path: "profile",
                element: <Profile />,
            },


            //service provider routes
            {
                path: "hotel-management",
                element: <HotelManagement />,
            },

            {
                path: "my-vouchers",
                element: <MyVouchers />,
            },
            {
                path: "payment-methods",
                element: <PaymentMethods />,
            },
            {
                path: "my-bookings",
                element: <MyBookings />,
            },

        ],
    },
]);


