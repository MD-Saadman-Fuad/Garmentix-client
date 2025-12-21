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
import TrackOrder from '../Pages/Dashboard/TrackOrder/TrackOrder';
import Error from '../Pages/Error/Error';
import PrivateRoute from '../Components/PrivateRoute';
import BuyerRoute from '../Components/BuyerRoute';
import ManagerRoute from '../Components/ManagerRoute';
import AdminRoute from '../Components/AdminRoute';

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
        element: <PrivateRoute><Dashboardlayout /></PrivateRoute>,
        children: [
            {
                path: "",
                Component: Myprofile,
            },
            {
                path: "my-profile",
                Component: Myprofile,
            },
            // Buyer Routes
            {
                path: "my-orders/:email",
                element: <BuyerRoute><MyParcels /></BuyerRoute>,
            },
            {
                path: "track-orders",
                element: <BuyerRoute><OrderTrackng /></BuyerRoute>,
            },
            {
                path: 'track-order/:orderId',
                element: <BuyerRoute><TrackOrder /></BuyerRoute>,
            },
            {
                path: 'payment/:parcelId',
                element: <BuyerRoute><Payment /></BuyerRoute>,
            },
            {
                path: 'payment-success',
                element: <BuyerRoute><PaymentSuccess /></BuyerRoute>,
            },
            {
                path: 'payment-cancelled',
                element: <BuyerRoute><PaymentCancelled /></BuyerRoute>,
            },
            // Manager Routes
            {
                path: "add-products",
                element: <ManagerRoute><AddProduct /></ManagerRoute>
            },
            {
                path: "manage-products",
                element: <ManagerRoute><ManageProducts /></ManagerRoute>,
            },
            {
                path: "pending-orders",
                element: <ManagerRoute><PendingOrders /></ManagerRoute>,
            },
            {
                path: "approved-orders",
                element: <ManagerRoute><ApprovedOrders /></ManagerRoute>,
            },
            // Admin Routes
            {
                path: "manage-users",
                element: <AdminRoute><ManageUsers /></AdminRoute>
            },
            {
                path: "all-products",
                element: <AdminRoute><AllProductsAdmin /></AdminRoute>,
            },
            {
                path: "all-orders",
                element: <AdminRoute><AllOrders /></AdminRoute>,
            },
        ]
    },
    {
        path: "*",
        Component: Error,
    }
]);