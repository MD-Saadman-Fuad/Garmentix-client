import React from 'react';
import useAuth from '../Hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoutes = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();
    // console.log('Current location:', location);



    if (loading) {
        return <div className='w-1/2 mx-auto'>
            <span className="loading loading-infinity loading-xl"></span>
        </div>
    }
    if (!user) {
        return <Navigate state={location.pathname} to="/login" />
    }
    return children;
};

export default PrivateRoutes;