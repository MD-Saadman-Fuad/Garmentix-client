import React from 'react';
import { Link, NavLink } from 'react-router';
import Logo from './Logo';
import useAuth from '../Hooks/useAuth';
import userPNG from '../assets/user.png'

const Navbar = () => {
    const { user, logOut } = useAuth();
    const handleLogOut = () => {
        logOut()
            .then(() => { })
            .catch(error => console.log(error));
    };

    const links = <>
        <li><NavLink className='btn btn-ghost btn-sm hover:bg-primary hover:text-white transition-all duration-200' to="/">Home</NavLink></li>
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
    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        {links}
                    </ul>
                </div>
                <Logo />
            </div>
            <div className="navbar-end hidden lg:flex items-center  justify-end">
                <ul className="menu menu-horizontal px-1 flex items-center gap-4">
                    {links}

                </ul>
            </div>

        </div>
    );
};

export default Navbar;