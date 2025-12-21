import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import useAuth from '../../../Hooks/useAuth';


const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const [paymentInfo, setPaymentInfo] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const sessionId = searchParams.get('session_id');
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (sessionId) {
            console.log('Processing payment success for session:', sessionId);
            axiosSecure.patch(`payment-success?session_id=${sessionId}`)
                .then(res => {
                    console.log('Payment success updated:', res.data);
                    setPaymentInfo({
                        transactionId: res.data.transactionId,
                        trackingId: res.data.trackingId,
                        success: true
                    })
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error('Error updating payment:', err);
                    console.error('Error details:', err.response?.data);
                    // Payment went through Stripe successfully, but backend update failed
                    // Still show success to user with session ID
                    setPaymentInfo({
                        sessionId: sessionId,
                        success: true,
                        partialSuccess: true
                    });
                    setError(`Payment processed successfully, but there was an issue updating the order status. Please contact support with your session ID: ${sessionId}`);
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
            setError('No session ID found. If you completed a payment, please contact support.');
        }
    }, [sessionId, axiosSecure]);

    if (isLoading) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <span className="loading loading-spinner loading-lg" style={{ color: '#5089e6' }}></span>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6'>
            <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center">
                {/* Success Icon */}
                <div className="mb-6">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12 text-green-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
                <p className="text-gray-600 text-lg mb-8">
                    Thank you for your purchase. Your order has been confirmed.
                </p>

                {/* Error Warning (if backend update failed) */}
                {error && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                        <p className="text-yellow-800 text-sm">{error}</p>
                    </div>
                )}

                {/* Payment Details */}
                <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                    <div className="space-y-4">
                        {paymentInfo?.transactionId && (
                            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                                <span className="text-gray-600 font-medium">Transaction ID:</span>
                                <span className="text-gray-900 font-semibold font-mono text-sm">
                                    {paymentInfo.transactionId}
                                </span>
                            </div>
                        )}
                        {paymentInfo?.trackingId && (
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">Tracking ID:</span>
                                <span className="font-semibold font-mono text-sm" style={{ color: '#5089e6' }}>
                                    {paymentInfo.trackingId}
                                </span>
                            </div>
                        )}
                        {paymentInfo?.sessionId && !paymentInfo?.transactionId && (
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">Session ID:</span>
                                <span className="text-gray-900 font-semibold font-mono text-xs break-all">
                                    {paymentInfo.sessionId}
                                </span>
                            </div>
                        )}
                    </div>
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
                        View My Orders
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="btn btn-outline"
                    >
                        Back to Home
                    </button>
                </div>

                {/* Info Note */}
                <p className="text-sm text-gray-500 mt-8">
                    {error ?
                        'Your payment was processed successfully. Please check your email for confirmation.' :
                        'A confirmation email has been sent to your registered email address.'
                    }
                </p>
            </div>
        </div>
    );
};

export default PaymentSuccess;