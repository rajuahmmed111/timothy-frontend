import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../layout/Layout';
import Home from '../pages/Home/Home';
import HotelReservation from '../pages/HotelReservation/HotelReservation';
import HotelDetails from '../pages/HotelReservation/HotelDetails';
import ReservationDetails from '../pages/HotelReservation/ReservationDetails';
import BookingConfirmation from '../pages/HotelReservation/BookingConfirmation';
import PaymentPage from '../pages/HotelReservation/PaymentPage';
import SecurityReservation from '../pages/SecurityReservation/SecurityReservation';
import SecurityDetails from '../pages/SecurityReservation/SecurityDetails';


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
                path: '/payment',
                element: <PaymentPage />,
            },
            {
                path: '/security-reservation',
                element: <SecurityReservation />,
            },
            {
                path: '/security-details',
                element: <SecurityDetails />,
            }
        ],
    },
    //   {
    //     path: '/login',
    //     element: <Login />,
    //   },
    //   {
    //     path: '/otp',
    //     element: <VerificationCode />,
    //   },
    //   {
    //     path: '/reset-password',
    //     element: <ResetPassword />,
    //   },
    //   {
    //     path: '/forgot-password',
    //     element: <ForgetPassword />,
    //   },
]);