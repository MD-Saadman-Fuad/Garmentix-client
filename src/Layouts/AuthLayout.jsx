import React from 'react';
import Logo from '../shared/Logo';
import { Outlet } from 'react-router';
import AuthPageImage from '../Components/AuthPageImage';
import { Link } from 'react-router-dom';
const AuthLayout = () => {
    return (
        <div className='max-w-7xl h-screen mx-auto p-10'>
            
            {/* <Logo /> */}
            <div className='flex justify-between items-center h-[90vh]'>
                
                <div className='flex-1'>
                    
                    <Outlet />
                </div>
                <div className='flex-1 hidden lg:block'>
                    <AuthPageImage></AuthPageImage>
                </div>
            </div>
            <div className='flex items-center justify-center'>
                <Link className='btn btn-primary' to="/">Go Home</Link>
            </div>
        </div>
    );
};

export default AuthLayout;