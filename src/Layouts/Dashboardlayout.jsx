import React from 'react';
import { NavLink, Outlet } from 'react-router';
import { CgProfile } from "react-icons/cg";
import { FaBoxOpen } from "react-icons/fa6";
import { FaTruckRampBox } from "react-icons/fa6";
import { IoHomeSharp } from "react-icons/io5";
import useAuth from '../Hooks/useAuth';

const Dashboardlayout = () => {
    const {user} = useAuth();
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