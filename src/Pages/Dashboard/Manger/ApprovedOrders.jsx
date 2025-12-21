import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Swal from 'sweetalert2';
import useAuth from '../../../Hooks/useAuth';

const ApprovedOrders = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [trackingData, setTrackingData] = useState({
        location: '',
        note: '',
        status: ''
    });

    // Fetch approved orders for manager
    const { data: orders = [], isLoading } = useQuery({
        queryKey: ['approvedOrders', user?.email],
        queryFn: async () => {
            const response = await axios.get(
                `${import.meta.env.VITE_backend_url}/orders?status=Approved&managerEmail=${user?.email}`
            );
            return response.data;
        },
        enabled: !!user?.email
    });

    // Fetch tracking info for specific order
    const { data: trackingInfo = [] } = useQuery({
        queryKey: ['orderTracking', selectedOrder?._id],
        queryFn: async () => {
            const response = await axios.get(
                `${import.meta.env.VITE_backend_url}/orders/${selectedOrder._id}/tracking`
            );
            return response.data;
        },
        enabled: !!selectedOrder?._id
    });

    // Add tracking mutation
    const addTrackingMutation = useMutation({
        mutationFn: async ({ orderId, tracking }) => {
            const response = await axios.post(
                `${import.meta.env.VITE_backend_url}/orders/${orderId}/tracking`,
                tracking
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['orderTracking']);
            queryClient.invalidateQueries(['approvedOrders']);
            setTrackingData({ location: '', note: '', status: '' });
            document.getElementById('tracking_modal').close();
            Swal.fire({
                icon: 'success',
                title: 'Tracking Added!',
                text: 'Tracking information has been added successfully',
                confirmButtonColor: '#5089e6',
                timer: 2000
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to add tracking',
                confirmButtonColor: '#5089e6'
            });
        }
    });

    const handleAddTracking = (order) => {
        setSelectedOrder(order);
        setTrackingData({ location: '', note: '', status: '' });
        document.getElementById('tracking_modal').showModal();
    };

    const handleViewTracking = (order) => {
        setSelectedOrder(order);
        document.getElementById('view_tracking_modal').showModal();
    };

    const handleSubmitTracking = (e) => {
        e.preventDefault();

        if (!trackingData.status) {
            Swal.fire({
                icon: 'warning',
                title: 'Status Required',
                text: 'Please select a tracking status',
                confirmButtonColor: '#5089e6'
            });
            return;
        }

        const tracking = {
            location: trackingData.location,
            note: trackingData.note,
            status: trackingData.status,
            timestamp: new Date().toISOString(),
            updatedBy: user?.email
        };

        addTrackingMutation.mutate({
            orderId: selectedOrder._id,
            tracking
        });
    };

    // Filter orders based on search
    const filteredOrders = orders.filter(order => {
        const searchLower = searchTerm.toLowerCase();
        return (
            order._id?.toLowerCase().includes(searchLower) ||
            order.firstName?.toLowerCase().includes(searchLower) ||
            order.lastName?.toLowerCase().includes(searchLower) ||
            order.email?.toLowerCase().includes(searchLower) ||
            order.productName?.toLowerCase().includes(searchLower)
        );
    });

    // const getStatusBadge = (status) => {
    //     const statusColors = {
    //         'Cutting Completed': 'badge-info',
    //         'Sewing Started': 'badge-primary',
    //         'Finishing': 'badge-warning',
    //         'QC Checked': 'badge-accent',
    //         'Packed': 'badge-success',
    //         'Shipped': 'badge-success',
    //         'Out for Delivery': 'badge-success'
    //     };
    //     return statusColors[status] || 'badge-ghost';
    // };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg" style={{ color: '#5089e6' }}></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-gray-100 p-6">
            <div className="container mx-auto">
                {/* Header */}
                <div className="mb-8" data-aos="fade-up">
                    <h1 className="text-4xl font-bold text-gray-900">Approved Orders</h1>
                    <p className="text-gray-600 mt-2">Manage approved orders and add tracking information</p>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6" data-aos="fade-up">
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

                    {/* Results Count */}
                    <div className="mt-4 text-sm text-gray-600">
                        Showing {filteredOrders.length} of {orders.length} orders
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-7 h-7">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-gray-900">{filteredOrders.length}</p>
                                <p className="text-gray-600">Approved Orders</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: '#5089e6' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-7 h-7">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-gray-900">
                                    ${filteredOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0).toFixed(2)}
                                </p>
                                <p className="text-gray-600">Total Value</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-purple-500 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-7 h-7">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-gray-900">
                                    {filteredOrders.reduce((sum, order) => sum + (order.orderQuantity || 0), 0)}
                                </p>
                                <p className="text-gray-600">Total Units</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden" data-aos="fade-up">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead style={{ backgroundColor: '#5089e6' }} className="text-white">
                                <tr>
                                    <th>Order ID</th>
                                    <th>User</th>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Approved Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-8">
                                            <div className="flex flex-col items-center gap-3 text-gray-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                                                </svg>
                                                <p className="text-lg font-semibold">No approved orders</p>
                                                {searchTerm && <p className="text-sm">Try adjusting your search criteria.</p>}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <tr key={order._id}>
                                            <td>
                                                <span className="font-mono text-sm font-semibold">
                                                    #{order._id.slice(-8)}
                                                </span>
                                            </td>
                                            <td>
                                                <div>
                                                    <div className="font-bold">{order.firstName} {order.lastName}</div>
                                                    <div className="text-sm opacity-70">{order.email}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="font-semibold">{order.productName}</div>
                                            </td>
                                            <td>
                                                <span className="badge badge-lg font-semibold">{order.orderQuantity}</span>
                                            </td>
                                            <td>
                                                <div className="text-sm">
                                                    {order.approvedAt ? new Date(order.approvedAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    }) : 'N/A'}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleAddTracking(order)}
                                                        className="btn btn-sm text-white"
                                                        style={{ backgroundColor: '#5089e6' }}
                                                    >
                                                        Add Tracking
                                                    </button>
                                                    <button
                                                        onClick={() => handleViewTracking(order)}
                                                        className="btn btn-sm btn-outline"
                                                        style={{ borderColor: '#5089e6', color: '#5089e6' }}
                                                    >
                                                        View Tracking
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add Tracking Modal */}
                <dialog id="tracking_modal" className="modal">
                    <div className="modal-box max-w-2xl">
                        <h3 className="font-bold text-2xl mb-6">Add Tracking Information</h3>
                        {selectedOrder && (
                            <div className="bg-blue-50 p-4 rounded-lg mb-6">
                                <p className="text-sm"><strong>Order ID:</strong> #{selectedOrder._id.slice(-8)}</p>
                                <p className="text-sm"><strong>Product:</strong> {selectedOrder.productName}</p>
                                <p className="text-sm"><strong>Customer:</strong> {selectedOrder.firstName} {selectedOrder.lastName}</p>
                            </div>
                        )}
                        <form onSubmit={handleSubmitTracking}>
                            <div className="space-y-4">
                                {/* Status */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Status <span className="text-red-500">*</span></span>
                                    </label>
                                    <select
                                        value={trackingData.status}
                                        onChange={(e) => setTrackingData({ ...trackingData, status: e.target.value })}
                                        className="select select-bordered w-full"
                                        required
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Cutting Completed">Cutting Completed</option>
                                        <option value="Sewing Started">Sewing Started</option>
                                        <option value="Finishing">Finishing</option>
                                        <option value="QC Checked">QC Checked</option>
                                        <option value="Packed">Packed</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Out for Delivery">Out for Delivery</option>
                                    </select>
                                </div>

                                {/* Location */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Location</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={trackingData.location}
                                        onChange={(e) => setTrackingData({ ...trackingData, location: e.target.value })}
                                        placeholder="e.g., Production Floor A, Warehouse, Delivery Hub"
                                        className="input input-bordered w-full"
                                    />
                                </div>

                                {/* Note */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Note</span>
                                    </label>
                                    <textarea
                                        value={trackingData.note}
                                        onChange={(e) => setTrackingData({ ...trackingData, note: e.target.value })}
                                        placeholder="Add any additional notes or updates..."
                                        className="textarea textarea-bordered h-24"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="modal-action">
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => document.getElementById('tracking_modal').close()}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn text-white"
                                    style={{ backgroundColor: '#5089e6' }}
                                    disabled={addTrackingMutation.isPending}
                                >
                                    {addTrackingMutation.isPending ? 'Adding...' : 'Add Tracking'}
                                </button>
                            </div>
                        </form>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>

                {/* View Tracking Modal */}
                <dialog id="view_tracking_modal" className="modal">
                    <div className="modal-box max-w-3xl">
                        <h3 className="font-bold text-2xl mb-6">Tracking Timeline</h3>
                        {selectedOrder && (
                            <div className="bg-blue-50 p-4 rounded-lg mb-6">
                                <p className="text-sm"><strong>Order ID:</strong> #{selectedOrder._id.slice(-8)}</p>
                                <p className="text-sm"><strong>Product:</strong> {selectedOrder.productName}</p>
                                <p className="text-sm"><strong>Customer:</strong> {selectedOrder.firstName} {selectedOrder.lastName}</p>
                            </div>
                        )}

                        {/* Timeline */}
                        <div className="space-y-4">
                            {trackingInfo.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto mb-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                    </svg>
                                    <p className="text-lg font-semibold">No tracking information yet</p>
                                    <p className="text-sm">Add tracking updates to monitor order progress</p>
                                </div>
                            ) : (
                                <ul className="timeline timeline-vertical">
                                    {trackingInfo.map((track, index) => (
                                        <li key={index}>
                                            {index !== 0 && <hr style={{ backgroundColor: '#5089e6' }} />}
                                            <div className="timeline-start timeline-box">
                                                <div className="font-bold text-lg">{track.status}</div>
                                                <div className="text-sm text-gray-500 mb-2">
                                                    {new Date(track.timestamp).toLocaleString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                                {track.location && (
                                                    <div className="flex items-center gap-2 text-sm mb-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                                        </svg>
                                                        <span>{track.location}</span>
                                                    </div>
                                                )}
                                                {track.note && (
                                                    <p className="text-sm text-gray-700 mt-2">{track.note}</p>
                                                )}
                                            </div>
                                            <div className="timeline-middle">
                                                <div className="w-5 h-5 rounded-full" style={{ backgroundColor: '#5089e6' }}></div>
                                            </div>
                                            <hr style={{ backgroundColor: '#5089e6' }} />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="modal-action">
                            <button
                                className="btn"
                                onClick={() => document.getElementById('view_tracking_modal').close()}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>
            </div>
        </div>
    );
};

export default ApprovedOrders;