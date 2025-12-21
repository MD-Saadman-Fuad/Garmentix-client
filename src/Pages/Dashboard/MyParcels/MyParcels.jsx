import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../Hooks/useAuth';
import Swal from 'sweetalert2';
import axios from 'axios';

const MyParcels = () => {
    const { user } = useAuth();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [paymentMethodSelectors, setPaymentMethodSelectors] = useState({});

    const { data: orders = [], refetch, isLoading } = useQuery({
        queryKey: ['myParcels', user?.email],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_backend_url}/orders?email=${user?.email}`);
            return res.data;
        },
        enabled: !!user?.email
    })

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setShowDetailsModal(true);
    };

    const handlePayment = (orderId) => {
        window.location.href = `/dashboard/payment/${orderId}`;
    };

    const handlePaymentMethodChange = (orderId, method) => {
        setPaymentMethodSelectors(prev => ({
            ...prev,
            [orderId]: method
        }));
    };

    const handlePaymentAction = (order) => {
        const selectedMethod = paymentMethodSelectors[order._id];

        // If Cash on Delivery is selected, update order status
        if (selectedMethod === 'cash_on_delivery') {
            axios.patch(`${import.meta.env.VITE_backend_url}/orders/${order._id}`, {
                paymentMethod: 'Cash on Delivery',
                paymentStatus: 'Pending',
                status: order.status || 'pending'
            })
                .then(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Payment Method Selected',
                        text: 'You will pay cash when you receive your order.',
                        confirmButtonColor: '#5089e6'
                    });
                    // Clear the selector
                    setPaymentMethodSelectors(prev => {
                        const newState = { ...prev };
                        delete newState[order._id];
                        return newState;
                    });
                    refetch();
                })
                .catch(err => {
                    console.error('Error updating payment method:', err);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to update payment method. Please try again.',
                        confirmButtonColor: '#5089e6'
                    });
                });
        } else {
            // Redirect to payment page for online payment
            handlePayment(order._id);
        }
    };

    const handleCancelOrder = (orderId) => {
        Swal.fire({
            title: 'Cancel Order?',
            text: 'Are you sure you want to cancel this order?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#5089e6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, cancel it!'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`${import.meta.env.VITE_backend_url}/orders/${orderId}`, {
                    method: 'DELETE'
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.deletedCount > 0) {
                            refetch();
                            Swal.fire({
                                title: 'Cancelled!',
                                text: 'Your order has been cancelled.',
                                icon: 'success',
                                confirmButtonColor: '#5089e6'
                            });
                        }
                    });
            }
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        if (!status) return 'badge-neutral';

        const statusColors = {
            pending: 'badge-warning',
            processing: 'badge-info',
            shipped: 'badge-primary',
            delivered: 'badge-success',
            cancelled: 'badge-error',
            approved: 'badge-success'
        };
        return statusColors[status.toLowerCase()] || 'badge-neutral';
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg" style={{ color: '#5089e6' }}></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-gray-100 py-8 px-4">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
                    <p className="text-gray-600 mt-2">View and manage your orders</p>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {orders.length === 0 ? (
                        <div className="text-center py-16">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24 mx-auto text-gray-400 mb-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                            </svg>
                            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Orders Yet</h3>
                            <p className="text-gray-500">You haven't placed any orders yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table table-zebra w-full">
                                <thead style={{ backgroundColor: '#5089e6' }} className="text-white">
                                    <tr>
                                        <th className="text-white">Order ID</th>
                                        <th className="text-white">Product</th>
                                        <th className="text-white">Quantity</th>
                                        <th className="text-white">Status</th>
                                        <th className="text-white">Payment</th>
                                        <th className="text-white">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id} className="hover">
                                            <td>
                                                <span className="font-mono text-sm">
                                                    {order._id.slice(-8).toUpperCase()}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar">
                                                        <div className="mask mask-squircle w-12 h-12">
                                                            <img src={order.productImage} alt={order.productName} />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold">{order.productName}</div>
                                                        <div className="text-sm text-gray-500">{order.category}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="font-semibold">{order.orderQuantity}</span> pcs
                                            </td>
                                            <td>
                                                <span className={`badge ${getStatusBadge(order.status)} badge-lg font-semibold capitalize`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div>
                                                    <div className="font-bold text-lg" style={{ color: '#5089e6' }}>
                                                        ৳{order.totalPrice.toLocaleString()}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {order.paymentOptions?.join(', ')}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleViewDetails(order)}
                                                        className="btn btn-sm btn-outline"
                                                        style={{ borderColor: '#5089e6', color: '#5089e6' }}
                                                    >
                                                        View
                                                    </button>
                                                    {/* Show Cancel button only if order is pending and payment is not done */}
                                                    {order.status?.toLowerCase() === 'pending' &&
                                                        order.paymentStatus?.toLowerCase() !== 'paid' && (
                                                            <button
                                                                onClick={() => handleCancelOrder(order._id)}
                                                                className="btn btn-sm btn-outline btn-error"
                                                            >
                                                                Cancel
                                                            </button>
                                                        )}
                                                    {/* Payment options for unpaid orders (not cancelled) */}
                                                    {order.paymentStatus?.toLowerCase() !== 'paid' &&
                                                        order.status?.toLowerCase() !== 'cancelled' && (
                                                            <>
                                                                {/* If order has Cash on Delivery option, show dropdown selector */}
                                                                {order.paymentOptions?.some(opt => opt.toLowerCase() === 'cash on delivery') ? (
                                                                    <div className="flex gap-2 items-center">
                                                                        <select
                                                                            className="select select-bordered select-sm"
                                                                            value={paymentMethodSelectors[order._id] || ''}
                                                                            onChange={(e) => handlePaymentMethodChange(order._id, e.target.value)}
                                                                            style={{ borderColor: '#5089e6' }}
                                                                        >
                                                                            <option value="" disabled>Select Payment</option>
                                                                            <option value="pay_now">Pay Now (Online)</option>
                                                                            <option value="cash_on_delivery">Cash on Delivery</option>
                                                                        </select>
                                                                        <button
                                                                            onClick={() => handlePaymentAction(order)}
                                                                            disabled={!paymentMethodSelectors[order._id]}
                                                                            className="btn btn-sm text-white"
                                                                            style={{ backgroundColor: '#5089e6' }}
                                                                        >
                                                                            Proceed
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    /* If NO Cash on Delivery, show only Pay Now button */
                                                                    <button
                                                                        onClick={() => handlePayment(order._id)}
                                                                        className="btn btn-sm text-white"
                                                                        style={{ backgroundColor: '#5089e6' }}
                                                                    >
                                                                        Pay Now
                                                                    </button>
                                                                )}
                                                            </>
                                                        )}
                                                    {/* Show Paid badge if payment is done */}
                                                    {order.paymentStatus?.toLowerCase() === 'paid' && (
                                                        <span className="badge badge-success badge-lg font-semibold">
                                                            ✓ Paid
                                                        </span>
                                                    )}
                                                    {/* Show Cash on Delivery badge if selected */}
                                                    {order.paymentMethod?.toLowerCase() === 'cash on delivery' &&
                                                        order.paymentStatus?.toLowerCase() !== 'paid' && (
                                                            <span className="badge badge-info badge-lg font-semibold">
                                                                💵 Cash on Delivery
                                                            </span>
                                                        )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Order Details Modal */}
            {showDetailsModal && selectedOrder && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-4xl max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setShowDetailsModal(false)}
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        >
                            ✕
                        </button>

                        <h3 className="font-bold text-3xl mb-6 text-center" style={{ color: '#5089e6' }}>
                            Order Details
                        </h3>

                        <div className="space-y-6">
                            {/* Order Info */}
                            <div className="bg-linear-to-br from-blue-50 to-white p-6 rounded-2xl border-2" style={{ borderColor: '#e0ecff' }}>
                                <h4 className="text-xl font-bold text-gray-900 mb-4">Order Information</h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-500 font-medium">Order ID</label>
                                        <p className="text-gray-900 font-mono font-semibold">{selectedOrder._id}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500 font-medium">Order Date</label>
                                        <p className="text-gray-900 font-semibold">{formatDate(selectedOrder.orderDate)}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500 font-medium">Status</label>
                                        <p>
                                            <span className={`badge ${getStatusBadge(selectedOrder.status)} badge-lg font-semibold capitalize`}>
                                                {selectedOrder.status}
                                            </span>
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500 font-medium">Total Amount</label>
                                        <p className="text-2xl font-bold" style={{ color: '#5089e6' }}>৳{selectedOrder.totalPrice.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="bg-linear-to-br from-purple-50 to-white p-6 rounded-2xl border-2" style={{ borderColor: '#f3e8ff' }}>
                                <h4 className="text-xl font-bold text-gray-900 mb-4">Product Details</h4>
                                <div className="flex items-center gap-4 mb-4">
                                    <img
                                        src={selectedOrder.productImage}
                                        alt={selectedOrder.productName}
                                        className="w-24 h-24 object-cover rounded-lg"
                                    />
                                    <div>
                                        <h5 className="text-lg font-bold">{selectedOrder.productName}</h5>
                                        <p className="text-sm text-gray-500">{selectedOrder.category}</p>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-500 font-medium">Quantity</label>
                                        <p className="text-gray-900 font-semibold text-lg">{selectedOrder.orderQuantity} pcs</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500 font-medium">Price per Unit</label>
                                        <p className="text-gray-900 font-semibold text-lg">৳{selectedOrder.pricePerUnit}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500 font-medium">Payment Method</label>
                                        <p className="text-gray-900 font-semibold">{selectedOrder.paymentOptions?.join(', ')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Info */}
                            <div className="bg-linear-to-br from-green-50 to-white p-6 rounded-2xl border-2" style={{ borderColor: '#dcfce7' }}>
                                <h4 className="text-xl font-bold text-gray-900 mb-4">Delivery Information</h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-500 font-medium">Customer Name</label>
                                        <p className="text-gray-900 font-semibold">{selectedOrder.firstName} {selectedOrder.lastName}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500 font-medium">Contact Number</label>
                                        <p className="text-gray-900 font-semibold">{selectedOrder.contactNumber}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-sm text-gray-500 font-medium">Delivery Address</label>
                                        <p className="text-gray-900 font-semibold">{selectedOrder.deliveryAddress}</p>
                                    </div>
                                    {selectedOrder.additionalNotes && (
                                        <div className="md:col-span-2">
                                            <label className="text-sm text-gray-500 font-medium">Additional Notes</label>
                                            <p className="text-gray-900">{selectedOrder.additionalNotes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Tracking Timeline */}
                            <div className="bg-linear-to-br from-orange-50 to-white p-6 rounded-2xl border-2" style={{ borderColor: '#ffedd5' }}>
                                <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6" style={{ color: '#5089e6' }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                                    </svg>
                                    Order Tracking Timeline
                                </h4>
                                <ul className="steps steps-vertical">
                                    <li className={`step ${selectedOrder.status.toLowerCase() !== 'cancelled' ? 'step-primary' : ''}`}>
                                        <div className="text-left ml-4">
                                            <p className="font-semibold">Order Placed</p>
                                            <p className="text-sm text-gray-500">{formatDate(selectedOrder.orderDate)}</p>
                                        </div>
                                    </li>
                                    <li className={`step ${['processing', 'shipped', 'delivered'].includes(selectedOrder.status.toLowerCase()) ? 'step-primary' : ''}`}>
                                        <div className="text-left ml-4">
                                            <p className="font-semibold">Processing</p>
                                            <p className="text-sm text-gray-500">Order is being prepared</p>
                                        </div>
                                    </li>
                                    <li className={`step ${['shipped', 'delivered'].includes(selectedOrder.status.toLowerCase()) ? 'step-primary' : ''}`}>
                                        <div className="text-left ml-4">
                                            <p className="font-semibold">Shipped</p>
                                            <p className="text-sm text-gray-500">Order is on the way</p>
                                        </div>
                                    </li>
                                    <li className={`step ${selectedOrder.status.toLowerCase() === 'delivered' ? 'step-primary' : ''}`}>
                                        <div className="text-left ml-4">
                                            <p className="font-semibold">Delivered</p>
                                            <p className="text-sm text-gray-500">Order completed</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="modal-action">
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                style={{ backgroundColor: '#5089e6', borderColor: '#5089e6' }}
                                className="btn text-white"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyParcels;