import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../layout/Layout';
import Home from '../pages/Home/Home';
import HotelReservation from '../pages/HotelReservation/HotelReservation';
import HotelDetails from '../pages/HotelReservation/HotelDetails';
import ReservationDetails from '../pages/HotelReservation/ReservationDetails';


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