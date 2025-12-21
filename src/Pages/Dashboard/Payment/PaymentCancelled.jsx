import React from 'react';
import { useNavigate } from 'react-router';
import useAuth from '../../../Hooks/useAuth';

const PaymentCancelled = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div className='min-h-screen bg-gradient-to-br from-red-50 to-gray-100 flex items-center justify-center p-6'>
            <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center">
                {/* Cancelled Icon */}
                <div className="mb-6">
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12 text-red-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Cancelled</h1>
                <p className="text-gray-600 text-lg mb-8">
                    Your payment was cancelled. No charges have been made to your account.
                </p>

                {/* Info Box */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
                    <p className="text-gray-700">
                        If you experienced any issues during checkout, please try again or contact our support team for assistance.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => navigate(`/dashboard/my-orders/${user?.email}`)}
                        className="btn text-white"
                        style={{ backgroundColor: '#5089e6' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        Back to My Orders
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="btn btn-outline"
                    >
                        Back to Home
                    </button>
                </div>

                {/* Support Info */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                        Need help? Contact our support team
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentCancelled;