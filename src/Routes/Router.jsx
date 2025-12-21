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
import ManageUsers from '../Pages/Dashboard/Admin/ManageUsers';
import AllProductsAdmin from '../Pages/Dashboard/Admin/AllProductsAdmin';
import AllOrders from '../Pages/Dashboard/Admin/AllOrders';
import AddProduct from '../Pages/Dashboard/Manger/AddProduct';
import ManageProducts from '../Pages/Dashboard/Manger/ManageProducts';
import ApprovedOrders from '../Pages/Dashboard/Manger/ApprovedOrders';
import PendingOrders from '../Pages/Dashboard/Manger/PendingOrders';
import Payment from '../Pages/Dashboard/Payment/Payment';
import PaymentSuccess from '../Pages/Dashboard/Payment/PaymentSuccess';
import PaymentCancelled from '../Pages/Dashboard/Payment/PaymentCancelled';

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
                path: "",
                Component: Myprofile,
            },
            {
                path: "my-orders/:email",
                Component: MyParcels,
            },
            {
                path: "my-profile",
                Component: Myprofile,
            },
            {
                path: "track-orders",
                Component: OrderTrackng,
            },
            {
                path: "manage-users",
                Component: ManageUsers
            },
            {
                path: "all-products",
                Component: AllProductsAdmin,
            },
            {
                path: "all-orders",
                Component: AllOrders,
            },
            {
                path: "add-products",
                Component: AddProduct
            },
            {
                path: "manage-products",
                Component: ManageProducts,
            },
            {
                path: "approved-orders",
                Component: ApprovedOrders,
            },
            {
                path: "pending-orders",
                Component: PendingOrders,
            },
            {
                path: 'payment/:parcelId',
                Component: Payment,
            },
            // {
            //     path: 'payment-history',
            //     Component: PaymentHistory,
            // },
            {
                path: 'payment-success',
                Component: PaymentSuccess,
            },
            {
                path: 'payment-cancelled',
                Component: PaymentCancelled,
            },

        ]
    }
]);