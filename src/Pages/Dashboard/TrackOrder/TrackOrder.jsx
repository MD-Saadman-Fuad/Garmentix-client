import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import useAuth from '../../../Hooks/useAuth';
import Swal from 'sweetalert2';

const TrackOrder = () => {
    const { orderId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    // Fetch order data
    const { data: order, isLoading, error, refetch } = useQuery({
        queryKey: ['order', orderId],
        queryFn: async () => {
            const response = await axiosSecure.get(`/orders/${orderId}`);
            return response.data;
        },
        enabled: !!orderId,
    });

    useEffect(() => {
        if (error) {
            console.error('Error fetching order:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error Loading Order',
                text: 'Unable to load order tracking information. Please try again.',
                confirmButtonColor: '#5089e6',
            }).then(() => {
                navigate(`/dashboard/my-orders/${user?.email}`);
            });
        }
    }, [error, navigate, user?.email]);

    // Check if user is authorized to view this order
    useEffect(() => {
        if (order && user && order.email !== user.email) {
            Swal.fire({
                icon: 'error',
                title: 'Access Denied',
                text: 'You are not authorized to view this order.',
                confirmButtonColor: '#5089e6',
            }).then(() => {
                navigate(`/dashboard/my-orders/${user?.email}`);
            });
        }
    }, [order, user, navigate]);

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

    // Timeline step icon component
    const StepIcon = ({ status, isCompleted, isLatest }) => {
        const iconMap = {
            'cutting completed': '✂️',
            'sewing started': '🧵',
            'sewing completed': '🪡',
            'finishing': '✨',
            'qc checked': '✓',
            'packed': '📦',
            'shipped': '🚚',
            'out for delivery': '🚛',
            'delivered': '🏠',
        };

        const icon = iconMap[status?.toLowerCase()] || '📋';

        return (
            <div
                className={`flex items-center justify-center w-12 h-12 rounded-full border-4 ${isLatest
                    ? 'bg-[#5089e6] border-[#5089e6] text-white shadow-lg scale-110'
                    : isCompleted
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'bg-gray-200 border-gray-300 text-gray-500'
                    }`}
            >
                <span className="text-2xl">{icon}</span>
            </div>
        );
    };

    // Timeline component
    const Timeline = ({ timeline }) => {
        if (!timeline || timeline.length === 0) {
            return (
                <div className="text-center py-8 text-gray-500">
                    <p className="text-lg">No tracking information available yet.</p>
                    <p className="text-sm mt-2">Check back later for updates on your order.</p>
                </div>
            );
        }

        return (
            <div className="relative">
                {timeline.map((step, index) => {
                    const isLatest = index === timeline.length - 1;
                    const isCompleted = step.completed || index < timeline.length - 1;

                    return (
                        <div key={index} className="flex gap-4 mb-8 last:mb-0">
                            {/* Timeline line and icon */}
                            <div className="flex flex-col items-center">
                                <StepIcon status={step.status} isCompleted={isCompleted} isLatest={isLatest} />
                                {index < timeline.length - 1 && (
                                    <div
                                        className={`w-1 flex-grow my-2 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'
                                            }`}
                                        style={{ minHeight: '40px' }}
                                    />
                                )}
                            </div>

                            {/* Step details */}
                            <div
                                className={`flex-grow pb-8 ${isLatest ? 'bg-blue-50 border-l-4 border-[#5089e6] pl-4 -ml-2 py-2' : ''
                                    }`}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                    <h3
                                        className={`text-lg font-semibold ${isLatest ? 'text-[#5089e6]' : 'text-gray-800'
                                            }`}
                                    >
                                        {step.status}
                                        {isLatest && (
                                            <span className="ml-2 text-sm font-normal text-[#5089e6]">(Current)</span>
                                        )}
                                    </h3>
                                    <div className="text-sm text-gray-600">
                                        {step.date && <span className="font-medium">{step.date}</span>}
                                        {step.time && <span className="ml-2">{step.time}</span>}
                                    </div>
                                </div>

                                {step.location && (
                                    <p className="text-sm text-gray-600 mb-2">
                                        <span className="font-medium">📍 Location:</span> {step.location}
                                    </p>
                                )}

                                {step.notes && (
                                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md mb-2">
                                        {step.notes}
                                    </p>
                                )}

                                {step.images && step.images.length > 0 && (
                                    <div className="flex gap-2 mt-3 flex-wrap">
                                        {step.images.map((img, imgIndex) => (
                                            <img
                                                key={imgIndex}
                                                src={img}
                                                alt={`${step.status} ${imgIndex + 1}`}
                                                className="w-24 h-24 object-cover rounded-md border border-gray-300 cursor-pointer hover:scale-105 transition-transform"
                                                onClick={() => window.open(img, '_blank')}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-[#5089e6]"></span>
                    <p className="mt-4 text-gray-600">Loading order tracking...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6" data-aos="fade-up">
                    <Link
                        to={`/dashboard/my-orders/${user?.email}`}
                        className="text-[#5089e6] hover:text-blue-700 flex items-center gap-2 mb-4"
                    >
                        <span>←</span> Back to My Orders
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Track Your Order</h1>
                </div>

                {/* Order Details Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6" data-aos="fade-up">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left column */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600">Order ID</p>
                                    <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded inline-block">
                                        {order._id}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Product Name</p>
                                    <p className="font-semibold text-gray-900">{order.productName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Quantity</p>
                                    <p className="font-semibold text-gray-900">{order.orderQuantity} units</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Price</p>
                                    <p className="font-semibold text-gray-900">৳{order.totalPrice}</p>
                                </div>
                            </div>
                        </div>

                        {/* Right column */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Status Information</h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600">Current Status</p>
                                    <span className={`badge ${getStatusBadge(order.status)} badge-lg mt-1`}>
                                        {order.status || 'Pending'}
                                    </span>
                                </div>
                                {order.trackingId && (
                                    <div>
                                        <p className="text-sm text-gray-600">Tracking Number</p>
                                        <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded inline-block">
                                            {order.trackingId}
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-gray-600">Payment Status</p>
                                    <span
                                        className={`badge ${order.paymentStatus?.toLowerCase() === 'paid'
                                            ? 'badge-success'
                                            : 'badge-warning'
                                            } mt-1`}
                                    >
                                        {order.paymentStatus || 'Pending'}
                                    </span>
                                </div>
                                {order.paymentMethod && (
                                    <div>
                                        <p className="text-sm text-gray-600">Payment Method</p>
                                        <p className="font-semibold text-gray-900">{order.paymentMethod}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Delivery Address */}
                    {order.deliveryAddress && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delivery Address</h3>
                            <p className="text-gray-700">{order.deliveryAddress}</p>
                            {order.contactNumber && (
                                <p className="text-gray-700 mt-1">
                                    <span className="font-medium">Contact:</span> {order.contactNumber}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Timeline Card */}
                <div className="bg-white rounded-lg shadow-md p-6" data-aos="fade-up">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Timeline</h2>
                    <Timeline timeline={order.trackingTimeline} />
                </div>

                {/* Refresh button */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => refetch()}
                        className="btn btn-outline text-[#5089e6] hover:bg-[#5089e6] hover:text-white"
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
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                        Refresh Tracking
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrackOrder;
