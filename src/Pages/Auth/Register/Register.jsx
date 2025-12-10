import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SocialLogin from '../SocialLogin/SocialLogin';
import useAuth from '../../../Hooks/useAuth';

const Register = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();

    const { registerUser, updateUserProfile } = useAuth();

    const location = useLocation();
    const navigate = useNavigate();

    const handleRegistration = (data) => {
        console.log(data);
        const profileImg = data.photo[0];

        registerUser(data.email, data.password)
            .then(result => {
                const user = result.user;
                console.log(user);
                const formData = new FormData();
                formData.append('image', profileImg);
                const url = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_hosting_key}`;
                axios.post(url, formData).then(res => {
                    console.log('imgbb response', res.data.data.url);
                    const userProfile ={
                        displayName: data.name,
                        photoURL: res.data.data.url
                    }
                    updateUserProfile(userProfile)
                        .then(() => {
                            console.log('User profile updated');
                            navigate(location?.state || '/');
                        })
                        .catch(error => {
                            console.log('Error updating user profile', error);
                        });
                }).catch(err => {
                    console.log('imgbb error', err);
                });
            })
            .catch(error => {
                console.log(error.message);
            });
    };


    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};:'",.<>/?\\|`~])[A-Za-z\d!@#$%^&*()_\-+=[\]{};:'",.<>/?\\|`~]{8,}$/;

    return (
        <div class="card bg-base-100 w-full p-10 mx-auto max-w-sm shrink-0 shadow-2xl">
            <h3 className="text-3xl font-bold text-center">Create an Account</h3>
            <p className="text-center">Please register to your account</p>
            <form onSubmit={handleSubmit(handleRegistration)}>
                <fieldset class="fieldset">
                    {/* name */}

                    <label class="label">Full Name</label>
                    <input type="text" {...register('name', { required: true, })} class="input" placeholder="Full Name" />

                    {errors.name?.type === 'required' && <span className="text-red-500">Full Name is required</span>}
                    {/* Photo */}

                    <label class="label">Photo</label>
                    {/* <input type="file" className="file-input file-input-ghost" /> */}
                    <input type="file" {...register('photo', { required: true, })} class="file-input file-input-ghost" placeholder="Photo" />

                    {errors.photo?.type === 'required' && <span className="text-red-500">Photo is required</span>}




                    {/* email */}
                    <label class="label">Email</label>
                    <input type="email" {...register('email', { required: true, })} class="input" placeholder="Email" />

                    {errors.email?.type === 'required' && <span className="text-red-500">Email is required</span>}

                    {/* password */}
                    <label class="label">Password</label>
                    <input type="password" {...register('password', { required: true, minLength: 6, pattern: regex })} class="input" placeholder="Password" />
                    {
                        errors.password?.type === 'required' && <span className="text-red-500">Password is required</span>
                    }
                    {
                        errors.password?.type === 'minLength' && <span className="text-red-500">Password must be 6 characters</span>
                    }
                    {
                        errors.password?.type === 'pattern' && <span className="text-red-500">Password must have one uppercase, one lowercase, one number and one special character</span>
                    }
                    <div><a class="link link-hover">Forgot password?</a></div>
                    <button class="btn btn-neutral bg-primary text-black mt-4">Register</button>
                </fieldset>
                <p>Already have an Account? <Link 
                state={location.state} className="text-primary" to="/login">Login</Link></p>

            </form>
            <SocialLogin />
        </div>
    );
};

export default Register;