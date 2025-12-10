import React from 'react';
import { Link, NavLink } from 'react-router';
import Logo from './Logo';
import useAuth from '../Hooks/useAuth';

const Navbar = () => {
    const { user, logOut } = useAuth();
    const handleLogOut = () => {
        logOut()
            .then(() => { })
            .catch(error => console.log(error));
    };
    // const links = <>
    // <li><NavLink to="">Services</NavLink></li>
    // <li><NavLink to="/">About Us</NavLink></li>
    // <li><NavLink to="/">Send Parcel</NavLink></li>
    // <li><NavLink to="/">Coverage</NavLink></li>

    //     {/*  */}

    //     {
    //         user && <><li><NavLink to="/dashboard/my-parcels">My Parcels</NavLink></li></>
    //     }
    // </>
    const links = <>
        <li><NavLink to="">Home</NavLink></li>
        <li><NavLink to="">All Products</NavLink></li>
        {user ? <>
            <li><NavLink to="/">DashBoard</NavLink></li>
            <li><NavLink to="/">Avatar</NavLink></li>
            <button onClick={handleLogOut}><NavLink to="/login">Logout</NavLink></button>
        </>
            :
            <>
                <li><NavLink to="/">About Us</NavLink></li>
                <li><NavLink to="/">Contact</NavLink></li>
                <li><NavLink to="/login">Login</NavLink></li>
                <li><NavLink to="/register">Register</NavLink></li>
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
            <div className="navbar-end hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {links}

                </ul>
            </div>
            
        </div>
    );
};

export default Navbar;