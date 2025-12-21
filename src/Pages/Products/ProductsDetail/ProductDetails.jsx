import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router';
import useAuth from '../../../Hooks/useAuth';
import Swal from 'sweetalert2';

const ProductDetails = () => {
    const location = useLocation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(location.state?.product);
    const [loading, setLoading] = useState(!location.state?.product);
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [userStatus, setUserStatus] = useState(null);
    const [orderQuantity, setOrderQuantity] = useState('');
    const [orderPrice, setOrderPrice] = useState(0);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        contactNumber: '',
        deliveryAddress: '',
        additionalNotes: ''
    });

    useEffect(() => {
        // If product not in state, fetch from API
        if (!location.state?.product) {
            setLoading(true);
            fetch(`${import.meta.env.VITE_backend_url}/products/${id}`)
                .then(res => res.json())
                .then(data => {
                    setProduct(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [id, location.state]);

    // Fetch user role from database
    useEffect(() => {
        if (user?.email) {
            fetch(`${import.meta.env.VITE_backend_url}/users/${user.email}`)
                .then(res => res.json())
                .then(data => {
                    setUserRole(data.role);
                    setUserStatus(data.status);
                })
                .catch(err => console.error(err));
        }
    }, [user]);

    // Calculate order price when quantity changes
    useEffect(() => {
        if (orderQuantity && product?.price) {
            setOrderPrice(parseFloat(orderQuantity) * parseFloat(product.price));
        } else {
            setOrderPrice(0);
        }
    }, [orderQuantity, product]);

    const handleOrderNowClick = () => {
        if (!user) {
            Swal.fire({
                icon: 'warning',
                title: 'Login Required',
                text: 'Please login to place an order',
                confirmButtonColor: '#5089e6'
            });
            navigate('/login', { state: location.pathname });
            return;
        }

        if (userRole === 'admin' || userRole === 'manager') {
            Swal.fire({
                icon: 'error',
                title: 'Access Denied',
                text: 'Admin and Manager users cannot place orders',
                confirmButtonColor: '#5089e6'
            });
            return;
        }

        // Check if user is suspended
        if (userStatus === 'suspended') {
            Swal.fire({
                icon: 'error',
                title: 'Account Suspended',
                html: `
                    <p class="mb-2">Your account has been suspended and you cannot place new orders.</p>
                    <p class="text-sm text-gray-600">Please contact support for more information.</p>
                `,
                confirmButtonColor: '#5089e6'
            });
            return;
        }

        // Initialize quantity with minimum order
        setOrderQuantity(product.minimumOrder.toString());
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleQuantityChange = (e) => {
        const value = e.target.value;
        setOrderQuantity(value);
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();

        // Validation
        if (!orderQuantity || orderQuantity < product.minimumOrder) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Quantity',
                text: `Minimum order quantity is ${product.minimumOrder}`,
                confirmButtonColor: '#5089e6'
            });
            return;
        }

        if (orderQuantity > product.availableQuantity) {
            Swal.fire({
                icon: 'error',
                title: 'Insufficient Stock',
                text: `Only ${product.availableQuantity} units available`,
                confirmButtonColor: '#5089e6'
            });
            return;
        }

        const orderData = {
            email: user.email,
            productId: product._id || id,
            productName: product.productName,
            productImage: product.image,
            category: product.category,
            pricePerUnit: product.price,
            orderQuantity: parseInt(orderQuantity),
            totalPrice: orderPrice,
            firstName: formData.firstName,
            lastName: formData.lastName,
            contactNumber: formData.contactNumber,
            deliveryAddress: formData.deliveryAddress,
            additionalNotes: formData.additionalNotes,
            paymentOptions: product.paymentOptions,
            orderDate: new Date().toISOString(),
            status: 'pending'
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_backend_url}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (response.ok) {
                setShowModal(false);

                // Check if online payment is required
                const requiresOnlinePayment = product.paymentOptions?.some(
                    option => option.toLowerCase().includes('online') ||
                        option.toLowerCase().includes('stripe') ||
                        option.toLowerCase().includes('payfast')
                );

                if (requiresOnlinePayment) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Order Placed!',
                        text: 'Redirecting to payment...',
                        confirmButtonColor: '#5089e6',
                        timer: 2000
                    });
                    // TODO: Redirect to payment page
                    // navigate(`/payment/${result.orderId}`);
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: 'Order Placed Successfully!',
                        text: 'You can view your order in My Orders page',
                        confirmButtonColor: '#5089e6'
                    });
                }

                // Reset form
                setFormData({
                    firstName: '',
                    lastName: '',
                    contactNumber: '',
                    deliveryAddress: '',
                    additionalNotes: ''
                });
                setOrderQuantity('');
            } else {
                throw new Error(result.message || 'Failed to place order');
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Order Failed',
                text: error.message || 'Something went wrong. Please try again.',
                confirmButtonColor: '#5089e6'
            });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h2>
                <button onClick={() => navigate('/products')} className="btn btn-primary">
                    Back to Products
                </button>
            </div>
        );
    }

    const { productName, description, category, image, price, availableQuantity, minimumOrder, paymentOptions } = product;

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-gray-100 py-12 px-4">
            <div className="container mx-auto max-w-7xl">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/products')}
                    className="btn btn-ghost mb-6 gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    Back to Products
                </button>

                <div className="grid md:grid-cols-2 gap-10 bg-white rounded-3xl shadow-2xl overflow-hidden p-8 md:p-12">
                    {/* Left Side - Image */}
                    <div className="space-y-6">
                        <div className="relative overflow-hidden rounded-2xl shadow-xl">
                            <img
                                src={image}
                                alt={productName}
                                className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-6 left-6">
                                <span style={{ backgroundColor: '#5089e6' }} className="text-white font-semibold px-6 py-4 text-base rounded-lg shadow-lg">
                                    {category}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Details */}
                    <div className="space-y-6">
                        {/* Product Name */}
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                                {productName}
                            </h1>
                            <div style={{ backgroundColor: '#5089e6' }} className="h-1 w-24 rounded-full"></div>
                        </div>

                        {/* Description */}
                        <div className="bg-gray-50 p-6 rounded-xl">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {description}
                            </p>
                        </div>

                        {/* Price Section */}
                        <div style={{ background: 'linear-gradient(135deg, #5089e6 0%, #3a6bc7 100%)' }} className="p-8 rounded-xl text-white shadow-lg">
                            <p className="text-sm font-medium mb-2 opacity-90">Price per unit</p>
                            <p className="text-5xl font-bold">৳{price}</p>
                        </div>

                        {/* Quantity & Order Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200">
                                <p className="text-sm text-gray-600 mb-1">Available Stock</p>
                                <p className="text-3xl font-bold text-green-700">{availableQuantity}</p>
                                <p className="text-xs text-gray-500 mt-1">pieces</p>
                            </div>
                            <div className="bg-orange-50 p-6 rounded-xl border-2 border-orange-200">
                                <p className="text-sm text-gray-600 mb-1">Minimum Order</p>
                                <p className="text-3xl font-bold text-orange-700">{minimumOrder}</p>
                                <p className="text-xs text-gray-500 mt-1">pieces</p>
                            </div>
                        </div>

                        {/* Payment Options */}
                        <div className="bg-blue-50 p-6 rounded-xl border-2" style={{ borderColor: '#5089e6' }}>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6" style={{ color: '#5089e6' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                                </svg>
                                Payment Options
                            </h3>
                            <div className="flex gap-3 flex-wrap">
                                {paymentOptions?.map((option, index) => (
                                    <span
                                        key={index}
                                        style={{ backgroundColor: '#5089e6' }}
                                        className="text-white border-none px-6 py-4 text-base font-semibold rounded-lg shadow-md"
                                    >
                                        {option}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={handleOrderNowClick}
                                style={{ backgroundColor: '#5089e6', borderColor: '#5089e6' }}
                                className="btn flex-1 text-white text-lg py-6 hover:scale-105 transition-transform shadow-lg border-none hover:opacity-90"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                </svg>
                                Order Now
                            </button>
                            <button style={{ borderColor: '#5089e6', color: '#5089e6' }} className="btn btn-outline flex-1 text-lg py-6 hover:scale-105 transition-transform hover:bg-blue-50">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>
                                Contact Seller
                            </button>
                        </div>
                    </div>
                </div>

                {/* Additional Info Section */}
                <div className="mt-10 bg-white rounded-3xl shadow-xl p-8 md:p-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Product Information</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6" style={{ color: '#5089e6' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-1">Quality Assured</h4>
                                <p className="text-sm text-gray-600">All products undergo strict quality control</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6" style={{ color: '#5089e6' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-1">Fast Delivery</h4>
                                <p className="text-sm text-gray-600">Timely delivery to your location</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6" style={{ color: '#5089e6' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-1">24/7 Support</h4>
                                <p className="text-sm text-gray-600">Always here to help with your orders</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Modal */}
            {showModal && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-3xl">
                        <button
                            onClick={() => setShowModal(false)}
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        >
                            ✕
                        </button>

                        <h3 className="font-bold text-3xl mb-6 text-center" style={{ color: '#5089e6' }}>
                            Order Form
                        </h3>

                        <form onSubmit={handleSubmitOrder} className="space-y-4">
                            {/* Email - Read Only */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Email</span>
                                </label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    readOnly
                                    className="input input-bordered bg-gray-100"
                                />
                            </div>

                            {/* Product Title - Read Only */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Product Title</span>
                                </label>
                                <input
                                    type="text"
                                    value={productName || ''}
                                    readOnly
                                    className="input input-bordered bg-gray-100"
                                />
                            </div>

                            {/* Price Info - Read Only */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Price per Unit</span>
                                </label>
                                <input
                                    type="text"
                                    value={`৳${price}`}
                                    readOnly
                                    className="input input-bordered bg-gray-100"
                                />
                            </div>

                            {/* First Name & Last Name */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">First Name *</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        required
                                        className="input input-bordered"
                                        placeholder="Enter first name"
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Last Name *</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        required
                                        className="input input-bordered"
                                        placeholder="Enter last name"
                                    />
                                </div>
                            </div>

                            {/* Order Quantity */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Order Quantity *</span>
                                </label>
                                <input
                                    type="number"
                                    value={orderQuantity}
                                    onChange={handleQuantityChange}
                                    min={minimumOrder}
                                    max={availableQuantity}
                                    required
                                    className="input input-bordered"
                                    placeholder={`Min: ${minimumOrder}, Max: ${availableQuantity}`}
                                />
                                <label className="label">
                                    <span className="label-text-alt text-gray-500">
                                        Minimum: {minimumOrder} | Available: {availableQuantity}
                                    </span>
                                </label>
                            </div>

                            {/* Order Price - Read Only & Calculated */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Total Order Price</span>
                                </label>
                                <input
                                    type="text"
                                    value={`৳${orderPrice.toFixed(2)}`}
                                    readOnly
                                    className="input input-bordered bg-gray-100 font-bold text-lg"
                                    style={{ color: '#5089e6' }}
                                />
                            </div>

                            {/* Contact Number */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Contact Number *</span>
                                </label>
                                <input
                                    type="tel"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleInputChange}
                                    required
                                    className="input input-bordered"
                                    placeholder="Enter contact number"
                                />
                            </div>

                            {/* Delivery Address */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Delivery Address *</span>
                                </label>
                                <textarea
                                    name="deliveryAddress"
                                    value={formData.deliveryAddress}
                                    onChange={handleInputChange}
                                    required
                                    className="textarea textarea-bordered h-24"
                                    placeholder="Enter full delivery address"
                                ></textarea>
                            </div>

                            {/* Additional Notes */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Additional Notes / Instructions</span>
                                </label>
                                <textarea
                                    name="additionalNotes"
                                    value={formData.additionalNotes}
                                    onChange={handleInputChange}
                                    className="textarea textarea-bordered h-24"
                                    placeholder="Any special instructions or notes (optional)"
                                ></textarea>
                            </div>

                            {/* Payment Options Display */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Available Payment Options</span>
                                </label>
                                <div className="flex gap-2 flex-wrap">
                                    {paymentOptions?.map((option, index) => (
                                        <span
                                            key={index}
                                            style={{ backgroundColor: '#5089e6' }}
                                            className="badge badge-lg text-white px-4 py-3"
                                        >
                                            {option}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="modal-action">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="btn btn-outline"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{ backgroundColor: '#5089e6', borderColor: '#5089e6' }}
                                    className="btn text-white hover:opacity-90"
                                >
                                    Place Order
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;