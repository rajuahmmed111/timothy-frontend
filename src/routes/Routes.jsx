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
        ],
    },
]);