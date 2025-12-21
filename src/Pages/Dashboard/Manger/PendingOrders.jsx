import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import axios from 'axios';
import Swal from 'sweetalert2';
import useAuth from '../../../Hooks/useAuth';

const PendingOrders = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [userStatus, setUserStatus] = useState(null);

    // Fetch user status
    React.useEffect(() => {
        if (user?.email) {
            fetch(`${import.meta.env.VITE_backend_url}/users/${user.email}`)
                .then(res => res.json())
                .then(data => {
                    setUserStatus(data.status);
                })
                .catch(err => console.error(err));
        }
    }, [user]);

    // Fetch pending orders for manager's products
    const { data: orders = [], isLoading } = useQuery({
        queryKey: ['pendingOrders', user?.email],
        queryFn: async () => {
            const response = await axios.get(
                `${import.meta.env.VITE_backend_url}/orders?status=pending&managerEmail=${user?.email}`
            );
            return response.data;
        },
        enabled: !!user?.email
    });

    // Approve order mutation
    const approveMutation = useMutation({
        mutationFn: async (orderId) => {
            const response = await axios.patch(
                `${import.meta.env.VITE_backend_url}/orders/${orderId}`,
                {
                    status: 'Approved',
                    approvedAt: new Date().toISOString()
                }
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['pendingOrders']);
            Swal.fire({
                icon: 'success',
                title: 'Approved!',
                text: 'Order has been approved successfully',
                confirmButtonColor: '#5089e6',
                timer: 2000
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to approve order',
                confirmButtonColor: '#5089e6'
            });
        }
    });

    // Reject order mutation
    const rejectMutation = useMutation({
        mutationFn: async (orderId) => {
            const response = await axios.patch(
                `${import.meta.env.VITE_backend_url}/orders/${orderId}`,
                {
                    status: 'Rejected',
                    rejectedAt: new Date().toISOString()
                }
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['pendingOrders']);
            Swal.fire({
                icon: 'success',
                title: 'Rejected!',
                text: 'Order has been rejected',
                confirmButtonColor: '#5089e6',
                timer: 2000
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to reject order',
                confirmButtonColor: '#5089e6'
            });
        }
    });

    const handleApprove = (order) => {
        // Check if manager is suspended
        if (userStatus === 'suspended') {
            Swal.fire({
                icon: 'error',
                title: 'Account Suspended',
                html: `
                    <p class="mb-2">Your account has been suspended and you cannot approve orders.</p>
                    <p class="text-sm text-gray-600">Please contact support for more information.</p>
                `,
                confirmButtonColor: '#5089e6'
            });
            return;
        }

        Swal.fire({
            title: 'Approve Order?',
            text: `Approve order #${order._id} from ${order.email}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#5089e6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, approve it!'
        }).then((result) => {
            if (result.isConfirmed) {
                approveMutation.mutate(order._id);
            }
        });
    };

    const handleReject = (order) => {
        // Check if manager is suspended
        if (userStatus === 'suspended') {
            Swal.fire({
                icon: 'error',
                title: 'Account Suspended',
                html: `
                    <p class="mb-2">Your account has been suspended and you cannot reject orders.</p>
                    <p class="text-sm text-gray-600">Please contact support for more information.</p>
                `,
                confirmButtonColor: '#5089e6'
            });
            return;
        }

        Swal.fire({
            title: 'Reject Order?',
            text: `Reject order #${order._id} from ${order.email}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, reject it!'
        }).then((result) => {
            if (result.isConfirmed) {
                rejectMutation.mutate(order._id);
            }
        });
    };

    const handleViewDetails = (order) => {
        // Show order details in modal
        Swal.fire({
            title: 'Order Details',
            html: `
                <div class="text-left">
                    <p><strong>Order ID:</strong> ${order._id}</p>
                    <p><strong>Customer:</strong> ${order.firstName} ${order.lastName}</p>
                    <p><strong>Email:</strong> ${order.email}</p>
                    <p><strong>Phone:</strong> ${order.phone}</p>
                    <p><strong>Product:</strong> ${order.productName}</p>
                    <p><strong>Quantity:</strong> ${order.orderQuantity}</p>
                    <p><strong>Total Price:</strong> $${order.totalPrice?.toFixed(2)}</p>
                    <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                    <p><strong>Address:</strong> ${order.address}, ${order.city}, ${order.postalCode}</p>
                    <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</p>
                </div>
            `,
            width: 600,
            confirmButtonColor: '#5089e6'
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

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg" style={{ color: '#5089e6' }}></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
            <div className="container mx-auto">
                {/* Header */}
                <div className="mb-8" data-aos="fade-up">
                    <h1 className="text-4xl font-bold text-gray-900">Pending Orders</h1>
                    <p className="text-gray-600 mt-2">Review and approve or reject pending orders</p>
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
                            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: '#5089e6' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-7 h-7">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-gray-900">{filteredOrders.length}</p>
                                <p className="text-gray-600">Pending Orders</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-7 h-7">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                            <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-7 h-7">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-gray-900">
                                    {filteredOrders.reduce((sum, order) => sum + (order.orderQuantity || 0), 0)}
                                </p>
                                <p className="text-gray-600">Total Items</p>
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
                                    <th>Order Date</th>
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
                                                <p className="text-lg font-semibold">No pending orders</p>
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
                                                    {new Date(order.orderDate).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleApprove(order)}
                                                        className="btn btn-sm btn-success text-white"
                                                        disabled={approveMutation.isPending}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(order)}
                                                        className="btn btn-sm btn-error text-white"
                                                        disabled={rejectMutation.isPending}
                                                    >
                                                        Reject
                                                    </button>
                                                    <button
                                                        onClick={() => handleViewDetails(order)}
                                                        className="btn btn-sm text-white"
                                                        style={{ backgroundColor: '#5089e6' }}
                                                    >
                                                        View
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
            </div>
        </div>
    );
};

export default PendingOrders;