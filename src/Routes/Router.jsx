import React from 'react';
import { createBrowserRouter } from "react-router";
import HomeLayout from '../Layouts/HomeLayout';
import Home from '../Pages/Homepage/Home';
import AuthLayout from '../Layouts/AuthLayout';
import Login from '../Pages/Auth/Login/Login';
import Register from '../Pages/Auth/Register/Register';
import AboutUs from '../Pages/AboutUs/AboutUs';
import Contact from '../Pages/Contact/Contact';
import ProductsLayout from '../Layouts/ProductsLayout';
import AllProducts from '../Pages/Products/AllProducts';
import ProductDetails from '../Pages/Products/ProductsDetail/ProductDetails';
import Dashboard from '../Pages/Dashboard/Dashboard';
import Dashboardlayout from '../Layouts/Dashboardlayout';
import MyParcels from '../Pages/Dashboard/MyParcels/MyParcels';
import Myprofile from '../Pages/Dashboard/MyProfile/Myprofile';
import OrderTrackng from '../Pages/Dashboard/OrderTracking/OrderTrackng';

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
    },
    {
        path: "products",
        Component: ProductsLayout,
        children: [
            {
                path: "/products",
                Component: AllProducts,
            },
            {
                path: "/products/:id",
                Component: ProductDetails,
            }

        ]
    },
    {
        path: "dashboard",
        Component: Dashboardlayout,
        children: [
            {
                path: "/dashboard",
                Component: Dashboard,
            },
            {
                path: "/dashboard/my-orders/:email",
                Component: MyParcels,
            },
            {
                path: "/dashboard/my-profile",
                Component: Myprofile,
            },
            {
                path: "/dashboard/track-orders",
                Component: OrderTrackng,
            }
        ]
    }
]);