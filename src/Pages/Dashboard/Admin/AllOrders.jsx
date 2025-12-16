import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import axios from 'axios';

const AllOrders = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const { data: orders = [], refetch, isLoading } = useQuery({
        queryKey: ['allOrders'],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_backend_url}/orders`);
            return res.data;
        }
    });

    const handleViewDetails = (order) => {
        navigate(`/dashboard/order-details/${order._id}`, { state: { order } });
    };

    const handleStatusUpdate = async (orderId, currentStatus) => {
        // const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

        const { value: newStatus } = await Swal.fire({
            title: 'Update Order Status',
            input: 'select',
            inputOptions: {
                pending: 'Pending',
                processing: 'Processing',
                shipped: 'Shipped',
                delivered: 'Delivered',
                cancelled: 'Cancelled'
            },
            inputValue: currentStatus,
            showCancelButton: true,
            confirmButtonColor: '#5089e6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Update',
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to select a status!';
                }
            }
        });

        if (newStatus) {
            try {
                await axios.patch(`${import.meta.env.VITE_backend_url}/orders/${orderId}`, {
                    status: newStatus
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Order status has been updated.',
                    confirmButtonColor: '#5089e6'
                });
                refetch();
            } catch (error) {
                console.error('Error updating order status:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Failed to update order status',
                    confirmButtonColor: '#5089e6'
                });
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const statusColors = {
            pending: 'badge-warning',
            processing: 'badge-info',
            shipped: 'badge-primary',
            delivered: 'badge-success',
            cancelled: 'badge-error'
        };
        return statusColors[status?.toLowerCase()] || 'badge-neutral';
    };

    // Filter orders based on search and status
    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.productTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.lastName?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || order.status?.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
    });

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
                    <h1 className="text-4xl font-bold text-gray-900">All Orders</h1>
                    <p className="text-gray-600 mt-2">Manage all customer orders</p>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Search */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Search Orders</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Search by Order ID, User, Product..."
                                className="input input-bordered"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Filter by Status</span>
                            </label>
                            <select
                                className="select select-bordered"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mt-4 text-sm text-gray-600">
                        Showing {filteredOrders.length} of {orders.length} orders
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-16">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 mx-auto text-gray-400 mb-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Orders Found</h3>
                            <p className="text-gray-500">
                                {searchTerm || statusFilter !== 'all'
                                    ? 'Try adjusting your search or filter criteria.'
                                    : 'There are no orders in the system yet.'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead style={{ backgroundColor: '#5089e6' }}>
                                    <tr className="text-white text-base">
                                        <th>Order ID</th>
                                        <th>User</th>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Total Price</th>
                                        <th>Status</th>
                                        <th>Order Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order) => (
                                        <tr key={order._id} className="hover">
                                            <td>
                                                <div className="font-mono text-sm font-semibold" style={{ color: '#5089e6' }}>
                                                    #{order._id?.slice(-8).toUpperCase()}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-900">
                                                        {order.firstName} {order.lastName}
                                                    </span>
                                                    <span className="text-sm text-gray-500">{order.email}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar">
                                                        <div className="w-12 h-12 rounded-lg">
                                                            <img
                                                                src={order.productImage}
                                                                alt={order.productTitle}
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="font-semibold text-gray-900 line-clamp-2">
                                                        {order.productTitle}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge badge-lg badge-ghost">
                                                    {order.orderQuantity}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="font-bold text-lg" style={{ color: '#5089e6' }}>
                                                    ${order.totalPrice?.toFixed(2)}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge badge-lg ${getStatusBadge(order.status)} capitalize font-semibold`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="text-sm text-gray-600">
                                                    {formatDate(order.orderDate)}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleViewDetails(order)}
                                                        className="btn btn-sm"
                                                        style={{ backgroundColor: '#5089e6', color: 'white' }}
                                                        title="View Details"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(order._id, order.status)}
                                                        className="btn btn-sm btn-outline"
                                                        style={{ borderColor: '#5089e6', color: '#5089e6' }}
                                                        title="Update Status"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                                        </svg>
                                                        Status
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                    {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                        <div key={status} className="bg-white rounded-xl shadow-lg p-4">
                            <div className="text-center">
                                <div className="text-3xl font-bold" style={{ color: '#5089e6' }}>
                                    {orders.filter(o => o.status?.toLowerCase() === status).length}
                                </div>
                                <div className="text-sm text-gray-600 capitalize mt-1">{status}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllOrders;