import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import useAuth from '../../../Hooks/useAuth';
import Swal from 'sweetalert2';
import userPNG from '../../../assets/user.png';

const Myprofile = () => {
    const { user, logOut } = useAuth();
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.email) {
            fetch(`http://localhost:5000/users/${user.email}`)
                .then(res => res.json())
                .then(data => {
                    setUserRole(data.role);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg" style={{ color: '#5089e6' }}></span>
            </div>
        );
    }

    // Format date
    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = new Date(parseInt(timestamp));
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-gray-100 py-8 px-4">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-gray-600 mt-2">Manage your personal information</p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Profile Content */}
                    <div className="relative px-8 py-10">
                        {/* Profile Picture */}
                        <div className="flex flex-col md:flex-row items-center md:items-center gap-8">
                            <div className="avatar">
                                <div className="w-48 h-48 rounded-full ring-4 ring-offset-4 shadow-2xl" style={{ '--tw-ring-color': '#5089e6' }}>
                                    <img
                                        src={user?.photoURL || userPNG}
                                        alt={user?.displayName || 'User'}
                                        className="object-cover w-full h-full rounded-full"
                                        onError={(e) => {
                                            console.log("Image failed to load:", user?.photoURL);
                                            e.target.src = userPNG;
                                        }}
                                        crossOrigin="anonymous"
                                        referrerPolicy="no-referrer"
                                    />
                                </div>
                            </div>
                            <div className="text-center md:text-left flex-1">
                                <h2 className="text-4xl font-bold text-gray-900">
                                    {user?.displayName || 'User Name'}
                                </h2>
                                <p className="text-gray-600 text-xl mt-2">{user?.email}</p>
                                <div className="flex gap-3 mt-4 justify-center md:justify-start">
                                    {userRole && (
                                        <span
                                            style={{ backgroundColor: '#5089e6' }}
                                            className="badge badge-lg text-white font-semibold px-6 py-4 capitalize text-base"
                                        >
                                            {userRole}
                                        </span>
                                    )}
                                    {user?.emailVerified && (
                                        <span className="badge badge-lg bg-green-500 text-white font-semibold px-6 py-4 text-base">
                                            ✓ Verified
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Information Grid */}
                        <div className="mt-16 grid md:grid-cols-2 gap-8">
                            {/* Account Information */}
                            <div className="bg-linear-to-br from-blue-50 to-white p-6 rounded-2xl border-2" style={{ borderColor: '#e0ecff' }}>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6" style={{ color: '#5089e6' }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                    Account Information
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-500 font-medium">Full Name</label>
                                        <p className="text-gray-900 font-semibold text-lg">
                                            {user?.displayName || 'Not provided'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500 font-medium">Email Address</label>
                                        <p className="text-gray-900 font-semibold">
                                            {user?.email || 'Not provided'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500 font-medium">Phone Number</label>
                                        <p className="text-gray-900 font-semibold">
                                            {user?.phoneNumber || 'Not provided'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500 font-medium">User ID</label>
                                        <p className="text-gray-900 font-mono text-sm break-all">
                                            {user?.uid || 'Not provided'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Account Status */}
                            <div className="bg-linear-to-br from-purple-50 to-white p-6 rounded-2xl border-2" style={{ borderColor: '#f3e8ff' }}>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6" style={{ color: '#5089e6' }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                    </svg>
                                    Account Status
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm text-gray-500 font-medium">Email Verification</label>
                                        <span className={`badge ${user?.emailVerified ? 'bg-green-500' : 'bg-orange-500'} text-white font-semibold`}>
                                            {user?.emailVerified ? 'Verified' : 'Not Verified'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm text-gray-500 font-medium">Account Type</label>
                                        <span className={`badge ${user?.isAnonymous ? 'bg-gray-500' : 'bg-blue-500'} text-white font-semibold`}>
                                            {user?.isAnonymous ? 'Anonymous' : 'Registered'}
                                        </span>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500 font-medium">Member Since</label>
                                        <p className="text-gray-900 font-semibold">
                                            {formatDate(user?.metadata?.createdAt)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500 font-medium">Last Login</label>
                                        <p className="text-gray-900 font-semibold">
                                            {formatDate(user?.metadata?.lastLoginAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Provider Information */}
                            <div className="bg-linear-to-br from-green-50 to-white p-6 rounded-2xl border-2" style={{ borderColor: '#dcfce7' }}>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6" style={{ color: '#5089e6' }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                                    </svg>
                                    Login Providers
                                </h3>
                                <div className="space-y-3">
                                    {user?.providerData?.map((provider, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border">
                                            <div className="flex items-center gap-3">
                                                {provider.providerId.includes('google') && (
                                                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                                    </svg>
                                                )}
                                                {provider.providerId.includes('password') && (
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6" style={{ color: '#5089e6' }}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                                    </svg>
                                                )}
                                                <div>
                                                    <p className="font-semibold text-gray-900 capitalize">
                                                        {provider.providerId.replace('.com', '')}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{provider.email}</p>
                                                </div>
                                            </div>
                                            <span className="badge badge-sm bg-green-100 text-green-700 font-semibold">
                                                Active
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Security & Settings */}
                            <div className="bg-linear-to-br from-orange-50 to-white p-6 rounded-2xl border-2" style={{ borderColor: '#ffedd5' }}>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6" style={{ color: '#5089e6' }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Quick Actions
                                </h3>
                                <div className="space-y-3">
                                    <button
                                        style={{ borderColor: '#5089e6', color: '#5089e6' }}
                                        className="btn btn-outline w-full justify-start"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                        </svg>
                                        Edit Profile
                                    </button>
                                    <button
                                        style={{ borderColor: '#5089e6', color: '#5089e6' }}
                                        className="btn btn-outline w-full justify-start"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                                        </svg>
                                        Change Password
                                    </button>
                                    <button
                                        style={{ borderColor: '#5089e6', color: '#5089e6' }}
                                        className="btn btn-outline w-full justify-start"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                        </svg>
                                        Notification Settings
                                    </button>
                                    <button
                                        onClick={() => {
                                            Swal.fire({
                                                title: 'Are you sure?',
                                                text: "You will be logged out!",
                                                icon: 'warning',
                                                showCancelButton: true,
                                                confirmButtonColor: '#5089e6',
                                                cancelButtonColor: '#d33',
                                                confirmButtonText: 'Yes, logout!'
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    logOut()
                                                        .then(() => {
                                                            Swal.fire({
                                                                title: 'Logged Out!',
                                                                text: 'You have been logged out successfully.',
                                                                icon: 'success',
                                                                confirmButtonColor: '#5089e6'
                                                            });
                                                            navigate('/');
                                                        })
                                                        .catch(error => {
                                                            console.error(error);
                                                            Swal.fire({
                                                                title: 'Error!',
                                                                text: 'Failed to logout. Please try again.',
                                                                icon: 'error',
                                                                confirmButtonColor: '#5089e6'
                                                            });
                                                        });
                                                }
                                            });
                                        }}
                                        className="btn btn-error w-full justify-start text-white"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                        </svg>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Myprofile;