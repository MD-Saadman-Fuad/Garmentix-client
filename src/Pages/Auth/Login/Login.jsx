import React from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../Hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SocialLogin from '../SocialLogin/SocialLogin';
import Logo from '../../../Shared/Logo';
import Swal from 'sweetalert2';
const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signInUser } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogin = (data) => {
        console.log('FormData', data);
        signInUser(data.email, data.password)
            .then(result => {
                const loggedUser = result.user;
                console.log(loggedUser);
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Successfully Logged In",
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate(location?.state || '/')
            })
            .catch(error => {
                console.log(error.message);
            });
    }

    return (
        <div class="card bg-base-100 w-full  p-10 mx-auto max-w-sm shrink-0 shadow-2xl">
            <div className="flex justify-center -ml-10" >
                <Logo className="mb-8  max-w-32 mx-auto"></Logo>
            </div>
            <h3 className="text-3xl font-bold text-center">Welcome Back</h3>
            <p className="text-center">Please login to your account</p>
            <form class="card-body" onSubmit={handleSubmit(handleLogin)}>
                <fieldset class="fieldset">
                    {/* email */}
                    <label class="label">Email</label>
                    <input type="email" {...register('email', { required: true })} class="input" placeholder="Email" />
                    {
                        errors.email && <span class="text-red-500">This field is required</span>
                    }
                    {/* password */}
                    <label class="label">Password</label>
                    <input type="password" {...register('password', { required: true })} class="input" placeholder="Password" />
                    {
                        errors.password && <span class="text-red-500">This field is required</span>
                    }
                    {/* extra */}
                    <div><a class="link link-hover">Forgot password?</a></div>
                    <button class="btn btn-info  text-white mt-4">Login</button>
                </fieldset>
                <p>New to Garmentix? <Link state={location.state}
                    className="text-primary" to="/register">Register</Link></p>
            </form>
            <SocialLogin />
        </div>
    );
};

export default Login;