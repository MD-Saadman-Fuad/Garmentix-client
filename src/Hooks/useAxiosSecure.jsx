import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_backend_url,
    withCredentials: true, // Send cookies with requests
})

const useAxiosSecure = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Response interceptor for 401 errors
        const interceptor = axiosSecure.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    // Redirect to login on unauthorized
                    navigate('/login');
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosSecure.interceptors.response.eject(interceptor);
        };
    }, [navigate]);

    return axiosSecure;
};

export default useAxiosSecure;