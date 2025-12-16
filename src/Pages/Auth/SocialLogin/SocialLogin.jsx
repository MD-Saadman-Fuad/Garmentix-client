import React from 'react';
import useAuth from '../../../Hooks/useAuth';
import { useLocation, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import axios from 'axios';

const SocialLogin = () => {
    const { signInWithGoogle } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const handleStoreUserData = async (user) => {
        const userData = {
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            role: 'buyer',
            status: 'active',
            loginMethod: 'google',
            password: '',
        }
        try {
            // Try to POST new user, backend should handle duplicate emails with upsert or return existing
            const response = await axios.post(`${import.meta.env.VITE_backend_url}/users`, userData);
            console.log('User data stored/updated successfully:', response.data);
        }
        catch (error) {
            // If user already exists, that's okay - they can still log in
            if (error.response?.status === 409 || error.response?.data?.message?.includes('duplicate')) {
                console.log('User already exists, continuing with login');
            } else {
                console.error('Error storing user data:', error);
            }
        }
    };
    const handleGoogleSignIn = () => {
        signInWithGoogle()
            .then(result => {
                const user = result.user;
                console.log('social', user);
                handleStoreUserData(user);
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Successfully Logged In",
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate(location?.state || '/');
            })
            .catch(error => {
                console.log(error.message);
            });
    };

    return (
        <div className='text-center pb-5 '>
            <p className='m-5'>OR</p>
            <button onClick={handleGoogleSignIn} class="btn bg-white w-full text-black border-[#e5e5e5]">
                <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                Login with Google
            </button>
        </div>
    );
};

export default SocialLogin;