import axios from 'axios';
import React from 'react';

const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_backend_url
})

const useAxiosSecure = () => {
    return axiosSecure;
};

export default useAxiosSecure;