import React from 'react';
import logo from '../assets/logo.png';
import { Link } from 'react-router';
const Logo = () => {
    return (
        <Link to="/">
            <div className='flex items-end '>
                <img className="w-12 h-12" src={logo} alt="Logo" />
                <h3 className='text-2xl font-bold -ms-2 mb-1'>Garmentix</h3>
            </div>
        </Link>
    );
};

export default Logo;