import React from 'react';
import { useParams, useNavigate } from 'react-router';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import useAuth from '../../../Hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';

const Payment = () => {
    const { parcelId } = useParams();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const { isLoading, data: orders, error } = useQuery({
        queryKey: ['orders', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/orders?email=${user?.email}`);
            return res.data;
        },
        enabled: !!user?.email
    })

    // Find the specific order from the list
    const parcel = orders?.find(order => order._id === parcelId);

    // Check if order supports only Cash on Delivery
    const isCashOnDeliveryOnly = parcel?.paymentOptions?.length === 1 &&
        parcel?.paymentOptions[0]?.toLowerCase() === 'cash on delivery';

    // Check if payment is already done
    const isPaymentDone = parcel?.paymentStatus?.toLowerCase() === 'paid';

    const handlePayment = async () => {
        if (!parcel) return;

        // Validate required fields
        if (!parcel.productName || !parcel.totalPrice || !parcel._id || !parcel.email) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Order Data',
                text: 'Some order information is missing. Please try again.',
                confirmButtonColor: '#5089e6'
            });
            return;
        }

        const paymentInfo = {
            parcelName: parcel.productName,
            cost: parcel.totalPrice,
            parcelId: parcel._id,
            senderEmail: parcel.email,
            senderName: `${parcel.firstName || ''} ${parcel.lastName || ''}`.trim() || parcel.email,
        }

        try {
            console.log('Sending payment info:', paymentInfo);
            const res = await axiosSecure.post('/create-checkout-session', paymentInfo);
            console.log('Payment response:', res.data)
            window.location.href = res.data.url;
        } catch (error) {
            console.error('Payment error:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);

            Swal.fire({
                icon: 'error',
                title: 'Payment Failed',
                text: error.response?.data?.message || 'There was an error processing your payment. Please try again.',
                confirmButtonColor: '#5089e6'
            });
        }
    }

    if (isLoading) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <span className="loading loading-spinner loading-lg" style={{ color: '#5089e6' }}></span>
            </div>
        );
    }

    if (error || !parcel) {
        return (
            <div className='min-h-screen flex flex-col items-center justify-center p-6'>
                <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 mx-auto text-red-500 mb-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
                    <p className="text-gray-600 mb-6">
                        The order you're looking for doesn't exist or has been removed.
                    </p>
                    <button
                        onClick={() => navigate('/dashboard/my-orders')}
                        className="btn text-white"
                        style={{ backgroundColor: '#5089e6' }}
                    >
                        Back to My Orders
                    </button>
                </div>
            </div>
        );
    }

    // Show message if payment is already done
    if (isPaymentDone) {
        return (
            <div className='min-h-screen flex flex-col items-center justify-center p-6'>
                <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 mx-auto text-green-500 mb-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Already Completed</h2>
                    <p className="text-gray-600 mb-6">
                        This order has already been paid for. No further payment is required.
                    </p>
                    {parcel.trackingId && (
                        <div className="bg-blue-50 rounded-xl p-4 mb-6">
                            <p className="text-sm text-gray-600">Tracking ID:</p>
                            <p className="font-mono font-bold text-lg" style={{ color: '#5089e6' }}>
                                {parcel.trackingId}
                            </p>
                        </div>
                    )}
                    <button
                        onClick={() => navigate(`/dashboard/my-orders/${user?.email}`)}
                        className="btn text-white"
                        style={{ backgroundColor: '#5089e6' }}
                    >
                        Back to My Orders
                    </button>
                </div>
            </div>
        );
    }

    // Show message if Cash on Delivery only
    if (isCashOnDeliveryOnly) {
        return (
            <div className='min-h-screen flex flex-col items-center justify-center p-6'>
                <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 mx-auto text-blue-500 mb-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Cash on Delivery Order</h2>
                    <p className="text-gray-600 mb-6">
                        This order is set for Cash on Delivery payment. You will pay when you receive your order.
                    </p>
                    <div className="bg-blue-50 rounded-xl p-4 mb-6">
                        <p className="text-sm text-gray-600 mb-2">Order Total:</p>
                        <p className="text-3xl font-bold" style={{ color: '#5089e6' }}>
                            ${parcel.totalPrice?.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">Pay this amount upon delivery</p>
                    </div>
                    <button
                        onClick={() => navigate(`/dashboard/my-orders/${user?.email}`)}
                        className="btn text-white"
                        style={{ backgroundColor: '#5089e6' }}
                    >
                        Back to My Orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6'>
            <div className="container mx-auto max-w-2xl">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Payment</h1>
                        <p className="text-gray-600">Review your order and proceed to checkout</p>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-blue-50 rounded-xl p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Product:</span>
                                <span className="font-semibold text-gray-900">{parcel.productName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Quantity:</span>
                                <span className="font-semibold text-gray-900">{parcel.orderQuantity}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Price Per Unit:</span>
                                <span className="font-semibold text-gray-900">${parcel.pricePerUnit?.toFixed(2)}</span>
                            </div>
                            <div className="divider my-2"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-900">Total Amount:</span>
                                <span className="text-2xl font-bold" style={{ color: '#5089e6' }}>
                                    ${parcel.totalPrice?.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div className="bg-gray-50 rounded-xl p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Information</h2>

                        <div className="space-y-2">
                            <div>
                                <span className="text-gray-600 text-sm">Customer Name:</span>
                                <p className="font-semibold text-gray-900">{parcel.firstName} {parcel.lastName}</p>
                            </div>
                            <div>
                                <span className="text-gray-600 text-sm">Email:</span>
                                <p className="font-semibold text-gray-900">{parcel.email}</p>
                            </div>
                            <div>
                                <span className="text-gray-600 text-sm">Contact:</span>
                                <p className="font-semibold text-gray-900">{parcel.contactNumber}</p>
                            </div>
                            <div>
                                <span className="text-gray-600 text-sm">Delivery Address:</span>
                                <p className="font-semibold text-gray-900">{parcel.deliveryAddress}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Button */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="btn btn-outline flex-1"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handlePayment}
                            className="btn text-white flex-1"
                            style={{ backgroundColor: '#5089e6' }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                            </svg>
                            Proceed to Pay ${parcel.totalPrice?.toFixed(2)}
                        </button>
                    </div>

                    {/* Security Note */}
                    <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                        <span>Secure payment powered by Stripe</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;