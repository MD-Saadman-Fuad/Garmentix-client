import React, { useEffect } from 'react';
import { NavLink, Outlet } from 'react-router';
import { CgProfile } from "react-icons/cg";
import { FaBoxOpen, FaShuffle } from "react-icons/fa6";
import { FaTruckRampBox } from "react-icons/fa6";
import { IoHomeSharp } from "react-icons/io5";
import useAuth from '../Hooks/useAuth';
import { FaShoppingCart, FaTruck, FaUsers } from 'react-icons/fa';
import { MdAddToPhotos, MdLibraryAddCheck, MdOutlinePendingActions } from "react-icons/md";
import userPNG from '../assets/user.png';
import Footer from '../Shared/Footer';
const Dashboardlayout = () => {
    const [userData, setUserData] = React.useState({});
    const { user, logOut } = useAuth();
    const handleLogOut = () => {
        logOut()
            .then(() => { })
            .catch(error => console.log(error));
    };
    const links = <>
        <li><NavLink className='btn btn-primary btn-sm hover:btn-primary-focus hover:scale-105 transition-all duration-200' to="/">Home</NavLink></li>
        <li><NavLink className='btn btn-ghost btn-sm hover:bg-primary hover:text-white transition-all duration-200' to="/products">All Products</NavLink></li>
        {user ? <>
            <li><NavLink className='btn btn-ghost btn-sm hover:bg-primary hover:text-white transition-all duration-200' to="/dashboard">Dashboard</NavLink></li>

            <li onClick={handleLogOut}><NavLink className='btn btn-ghost btn-sm hover:bg-error hover:text-white transition-all duration-200' to="/login">Logout</NavLink></li>
            <img
                className='w-12 h-12 rounded-full border-2 border-primary hover:border-primary-focus hover:scale-110 hover:shadow-lg transition-all duration-200 cursor-pointer'
                src={user.photoURL || userPNG}
                alt={user.displayName || "User"}
                onError={(e) => {
                    console.log("Image failed to load:", user.photoURL);
                    e.target.src = userPNG;
                }}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
            />
        </>
            :
            <>
                <li><NavLink className='btn btn-ghost btn-sm hover:bg-primary hover:text-white transition-all duration-200' to="/aboutus">About Us</NavLink></li>
                <li><NavLink className='btn btn-ghost btn-sm hover:bg-primary hover:text-white transition-all duration-200' to="/contact">Contact</NavLink></li>
                <li><NavLink className='btn btn-ghost btn-sm hover:bg-primary hover:text-white transition-all duration-200' to="/login">Login</NavLink></li>
                <li><NavLink className='btn btn-primary btn-sm hover:btn-primary-focus hover:scale-105 transition-all duration-200' to="/register">Register</NavLink></li>
            </>}
    </>
    useEffect(() => {
        fetch(`${import.meta.env.VITE_backend_url}/users/${user?.email}`)
            .then(res => res.json())
            .then(data => {
                // console.log('User data:', data);
                setUserData(data);
            })
            .catch(err => {
                console.error('Error fetching user data:', err);
            });
    }, [user]);
    // console.log('ROLE', userData.role);
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                {/* Navbar */}
                <nav className="navbar w-full bg-base-300 gap-2 px-2">
                    <div className="flex-none">
                        <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost btn-sm">
                            {/* Sidebar toggle icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path><path d="M9 4v16"></path><path d="M14 10l2 2l-2 2"></path></svg>
                        </label>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h1 className="text-xs sm:text-sm md:text-lg lg:text-xl font-semibold text-gray-800 truncate">
                            Welcome to Dashboard
                        </h1>
                    </div>

                    <div className="flex-none">
                        {/* Dropdown for mobile/tablet */}
                        <div className="dropdown dropdown-end xl:hidden">
                            <label tabIndex={0} className="btn btn-ghost btn-sm btn-circle">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </label>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 gap-2">
                                {links}
                            </ul>
                        </div>

                        {/* Horizontal menu for extra large screens only */}
                        <ul className="menu menu-horizontal px-1 gap-1 items-center hidden xl:flex">
                            {links}
                        </ul>
                    </div>
                </nav>
                {/* Page content here */}
                <div className="p-4"><Outlet /></div>
                <Footer></Footer>
            </div>

            <div className="drawer-side is-drawer-close:overflow-visible">
                <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
                    {/* Sidebar content here */}
                    <ul className="menu w-full grow">
                        {/* List item */}
                        <li>

                            <NavLink to="/" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Homepage">

                                <IoHomeSharp /> <span className="is-drawer-close:hidden">Home</span>

                            </NavLink>
                        </li>

                        {/* List item */}
                        {
                            userData.role === 'buyer' ?
                                (<div>
                                    <li>

                                        <NavLink to={`/dashboard/my-orders/${user?.email}`} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="My Orders">

                                            <FaBoxOpen /> <span className="is-drawer-close:hidden">My Order</span>

                                        </NavLink>
                                    </li>
                                    <li>

                                        <NavLink to="/dashboard/track-orders" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Track Orders">

                                            <FaTruckRampBox /> <span className="is-drawer-close:hidden">Track Orders</span>

                                        </NavLink>
                                    </li>
                                </div>) : <></>
                        }
                        {
                            userData.role === 'manager' ?
                                <div>
                                    <li>

                                        <NavLink to={`/dashboard/add-products`} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Add Products">

                                            <MdAddToPhotos /> <span className="is-drawer-close:hidden">Add Products</span>

                                        </NavLink>
                                    </li><li>

                                        <NavLink to={`/dashboard/manage-products`} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Manage Products">

                                            <FaShuffle /> <span className="is-drawer-close:hidden">Manage Products</span>

                                        </NavLink>
                                    </li><li>

                                        <NavLink to={`/dashboard/pending-orders`} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Pending Orders">

                                            <MdOutlinePendingActions /> <span className="is-drawer-close:hidden">Pending Orders</span>

                                        </NavLink>
                                    </li><li>

                                        <NavLink to={`/dashboard/approved-orders`} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Approved Orders">

                                            <MdLibraryAddCheck /> <span className="is-drawer-close:hidden">Approved Orders</span>

                                        </NavLink>
                                    </li>
                                </div> : <></>
                        }
                        {
                            userData.role === 'admin' ?
                                <div>
                                    <li>

                                        <NavLink to={`/dashboard/manage-users`} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Manage Users">

                                            <FaUsers /> <span className="is-drawer-close:hidden">Manage Users</span>

                                        </NavLink>
                                    </li>
                                    <li>

                                        <NavLink to={`/dashboard/all-products`} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="All Products">

                                            <FaShoppingCart /> <span className="is-drawer-close:hidden">All Products</span>

                                        </NavLink>
                                    </li>
                                    <li>

                                        <NavLink to={`/dashboard/all-orders`} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="All Orders">

                                            <FaTruck /> <span className="is-drawer-close:hidden">All Order</span>

                                        </NavLink>
                                    </li>
                                </div>
                                :
                                <></>
                        }
                        <li>

                            <NavLink to="/dashboard/my-profile" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="My Profile">

                                <CgProfile /> <span className="is-drawer-close:hidden">My Profile</span>

                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboardlayout;