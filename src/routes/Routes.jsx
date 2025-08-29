import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../layout/Layout';
import Home from '../pages/Home/Home';
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
                path: '/event-reservation',
                element: <EventReservationPage />,
            },
        ],
    },
]);