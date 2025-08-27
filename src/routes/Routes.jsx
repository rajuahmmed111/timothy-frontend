import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../layout/Layout';
import Home from '../pages/Home/Home';


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