import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const OrderTrackng = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Fetch all orders for the user
    const { data: orders = [], isLoading, refetch } = useQuery({
        queryKey: ['trackOrders', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/orders?email=${user?.email}`);
            return res.data;
        },
        enabled: !!user?.email
    });

    // Get status badge color
    const getStatusBadge = (status) => {
        if (!status) return 'badge-neutral';
        const statusLower = status.toLowerCase();
        switch (statusLower) {
            case 'pending':
                return 'badge-warning';
            case 'approved':
                return 'badge-info';
            case 'in production':
            case 'in-production':
                return 'badge-primary';
            case 'shipped':
                return 'badge-accent';
            case 'delivered':
                return 'badge-success';
            case 'cancelled':
                return 'badge-error';
            default:
                return 'badge-neutral';
        }
    };

    // Get latest tracking update
    const getLatestUpdate = (order) => {
        if (order.trackingTimeline && order.trackingTimeline.length > 0) {
            const latest = order.trackingTimeline[order.trackingTimeline.length - 1];
            return {
                status: latest.status,
                date: latest.date,
                time: latest.time,
                location: latest.location
            };
        }
        return null;
    };

    // Filter orders
    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.trackingId?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' ||
            order.status?.toLowerCase() === filterStatus.toLowerCase();

        return matchesSearch && matchesStatus;
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-[#5089e6]"></span>
                    <p className="mt-4 text-gray-600">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Track All Orders</h1>
                    <p className="text-gray-600">Monitor the progress of all your orders in one place</p>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search Input */}
                        <div className="flex-grow">
                            <input
                                type="text"
                                placeholder="Search by product name, order ID, or tracking number..."
                                className="input input-bordered w-full"
                                style={{ borderColor: '#5089e6' }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="sm:w-48">
                            <select
                                className="select select-bordered w-full"
                                style={{ borderColor: '#5089e6' }}
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="in production">In Production</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        {/* Refresh Button */}
                        <button
                            onClick={() => refetch()}
                            className="btn text-white"
                            style={{ backgroundColor: '#5089e6' }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Orders Summary Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-md p-4 text-center">
                        <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                        <p className="text-sm text-gray-600">Total Orders</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4 text-center">
                        <p className="text-2xl font-bold text-yellow-600">
                            {orders.filter(o => o.status?.toLowerCase() === 'pending').length}
                        </p>
                        <p className="text-sm text-gray-600">Pending</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600">
                            {orders.filter(o => o.status?.toLowerCase() === 'in production' || o.status?.toLowerCase() === 'in-production').length}
                        </p>
                        <p className="text-sm text-gray-600">In Production</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4 text-center">
                        <p className="text-2xl font-bold text-green-600">
                            {orders.filter(o => o.status?.toLowerCase() === 'delivered').length}
                        </p>
                        <p className="text-sm text-gray-600">Delivered</p>
                    </div>
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 mx-auto text-gray-400 mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <p className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</p>
                        <p className="text-gray-600">
                            {searchTerm || filterStatus !== 'all'
                                ? 'Try adjusting your search or filter criteria'
                                : 'You haven\'t placed any orders yet'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => {
                            const latestUpdate = getLatestUpdate(order);

                            return (
                                <div key={order._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                    <div className="p-6">
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                            {/* Left Section: Order Info */}
                                            <div className="flex-grow">
                                                <div className="flex items-start gap-4">
                                                    {/* Order Icon */}
                                                    <div className="hidden sm:flex items-center justify-center w-16 h-16 rounded-lg bg-blue-50">
                                                        <span className="text-3xl">📦</span>
                                                    </div>

                                                    {/* Order Details */}
                                                    <div className="flex-grow">
                                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                                            <h3 className="text-lg font-semibold text-gray-900">
                                                                {order.productName}
                                                            </h3>
                                                            <span className={`badge ${getStatusBadge(order.status)}`}>
                                                                {order.status || 'Pending'}
                                                            </span>
                                                            {order.paymentStatus?.toLowerCase() === 'paid' && (
                                                                <span className="badge badge-success badge-sm">
                                                                    ✓ Paid
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                                                            <p>
                                                                <span className="font-medium">Order ID:</span>{' '}
                                                                <span className="font-mono text-xs">{order._id}</span>
                                                            </p>
                                                            <p>
                                                                <span className="font-medium">Quantity:</span>{' '}
                                                                {order.orderQuantity} units
                                                            </p>
                                                            {order.trackingId && (
                                                                <p>
                                                                    <span className="font-medium">Tracking:</span>{' '}
                                                                    <span className="font-mono text-xs">{order.trackingId}</span>
                                                                </p>
                                                            )}
                                                            <p>
                                                                <span className="font-medium">Total:</span>{' '}
                                                                <span className="font-semibold text-gray-900">
                                                                    ৳{order.totalPrice}
                                                                </span>
                                                            </p>
                                                        </div>

                                                        {/* Latest Update */}
                                                        {latestUpdate && (
                                                            <div className="mt-3 p-3 bg-blue-50 rounded-md border-l-4 border-[#5089e6]">
                                                                <p className="text-sm font-semibold text-[#5089e6] mb-1">
                                                                    Latest Update:
                                                                </p>
                                                                <p className="text-sm text-gray-700">
                                                                    {latestUpdate.status}
                                                                </p>
                                                                <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-600">
                                                                    {latestUpdate.date && (
                                                                        <span>📅 {latestUpdate.date}</span>
                                                                    )}
                                                                    {latestUpdate.time && (
                                                                        <span>🕐 {latestUpdate.time}</span>
                                                                    )}
                                                                    {latestUpdate.location && (
                                                                        <span>📍 {latestUpdate.location}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Section: Action Button */}
                                            <div className="lg:ml-4">
                                                <Link
                                                    to={`/dashboard/track-order/${order._id}`}
                                                    className="btn text-white w-full lg:w-auto"
                                                    style={{ backgroundColor: '#5089e6' }}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5 mr-2"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                        />
                                                    </svg>
                                                    View Tracking
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderTrackng;