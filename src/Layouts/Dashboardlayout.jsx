import React, { useEffect } from 'react';
import { NavLink, Outlet } from 'react-router';
import { CgProfile } from "react-icons/cg";
import { FaBoxOpen, FaShuffle } from "react-icons/fa6";
import { FaTruckRampBox } from "react-icons/fa6";
import { IoHomeSharp } from "react-icons/io5";
import useAuth from '../Hooks/useAuth';
import { FaShoppingCart, FaTruck, FaUsers } from 'react-icons/fa';
import { MdAddToPhotos, MdLibraryAddCheck, MdOutlinePendingActions } from "react-icons/md";

const Dashboardlayout = () => {
    const [userData, setUserData] = React.useState({});
    const { user } = useAuth();
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
                <nav className="navbar w-full bg-base-300">
                    <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost">
                        {/* Sidebar toggle icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path><path d="M9 4v16"></path><path d="M14 10l2 2l-2 2"></path></svg>
                    </label>
                    <div className="px-4">Welcome to Your Dashboard</div>
                </nav>
                {/* Page content here */}
                <div className="p-4"><Outlet /></div>
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