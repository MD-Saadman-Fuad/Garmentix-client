import React from 'react';
import Logo from '../shared/Logo';
import { Outlet } from 'react-router';
import AuthPageImage from '../Components/AuthPageImage';
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
        </div>
    );
};

export default AuthLayout;