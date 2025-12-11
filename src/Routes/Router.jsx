import React from 'react';
import { createBrowserRouter } from "react-router";
import HomeLayout from '../Layouts/HomeLayout';
import Home from '../Pages/Homepage/Home';
import AuthLayout from '../Layouts/AuthLayout';
import Login from '../Pages/Auth/Login/Login';
import Register from '../Pages/Auth/Register/Register';
import AboutUs from '../Pages/AboutUs/AboutUs';
import Contact from '../Pages/Contact/Contact';

export const router = createBrowserRouter([
    {
        path: "/",
        Component: HomeLayout,
        children: [
            {
                path: "/",
                Component: Home,
            },
            {
                path: "/aboutus",
                Component: AboutUs,
            },
            {
                path: "/contact",
                Component: Contact,
            }
        ]
    },
    {
        path: "/", 
        Component: AuthLayout,
        children: [
            {
               path: 'login', 
               Component: Login,
            },
            {
                path: 'register',
                Component: Register,
            }
        ]
    }
]);