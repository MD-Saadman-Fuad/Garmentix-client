import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const BuyerRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_backend_url}/auth/verify`,
                    { withCredentials: true }
                );

                if (response.data.authenticated) {
                    setIsAuthenticated(true);

                    // Fetch user role
                    const userResponse = await axios.get(
                        `${import.meta.env.VITE_backend_url}/users/${response.data.user.email}`,
                        { withCredentials: true }
                    );

                    setUserRole(userResponse.data.role);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        verifyAuth();
    }, [location.pathname]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg" style={{ color: '#5089e6' }}></span>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (userRole !== 'buyer') {
        Swal.fire({
            icon: 'error',
            title: 'Access Denied',
            text: 'This page is only accessible to buyers.',
            confirmButtonColor: '#5089e6'
        });
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default BuyerRoute;
