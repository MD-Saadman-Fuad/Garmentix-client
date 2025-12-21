import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import useAuth from '../../../Hooks/useAuth';
import Swal from 'sweetalert2';

const ProductsCard = ({ product }) => {
    const { _id, productName, category, image, price, availableQuantity, minimumOrder, paymentOptions } = product;
    const productId = _id;
    const { user } = useAuth();
    const navigate = useNavigate();
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
            navigate('/login');
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
        setOrderQuantity(minimumOrder?.toString() || '1');
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
        if (!orderQuantity || orderQuantity < (minimumOrder || 1)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Quantity',
                text: `Minimum order quantity is ${minimumOrder || 1}`,
                confirmButtonColor: '#5089e6'
            });
            return;
        }

        if (orderQuantity > availableQuantity) {
            Swal.fire({
                icon: 'error',
                title: 'Insufficient Stock',
                text: `Only ${availableQuantity} units available`,
                confirmButtonColor: '#5089e6'
            });
            return;
        }

        const orderData = {
            email: user.email,
            productId: product._id || productId,
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
            status: 'pending',
            paymentStatus: 'unpaid',
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
                        text: 'You can view your order in My Orders page for further details.',
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

    return (
        <>
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden group">
                {/* Image Section */}
                <figure className="relative overflow-hidden h-64">
                    <img
                        src={image}
                        alt={productName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 badge badge-primary text-white font-semibold px-4 py-3">
                        {category}
                    </div>
                </figure>

                {/* Content Section */}
                <div className="card-body p-6">
                    {/* Title */}
                    <h2 className="card-title text-xl font-bold text-gray-800 mb-2">
                        {productName}
                    </h2>

                    {/* Description */}
                    {/* <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {description}
                </p> */}

                    {/* Price & Quantity Info */}
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <p className="text-sm text-gray-500">Price</p>
                            <p className="text-2xl font-bold text-primary">৳{price}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Available</p>
                            <p className="text-lg font-semibold text-gray-800">{availableQuantity} pcs</p>
                        </div>
                    </div>

                    {/* Minimum Order */}
                    {/* <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                        <span className="font-semibold text-gray-800">Min. Order:</span> {minimumOrder} pieces
                    </p>
                </div> */}

                    {/* Payment Options */}
                    {/* <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Payment Options:</p>
                    <div className="flex gap-2 flex-wrap">
                        {paymentOptions?.map((option, index) => (
                            <span
                                key={index}
                                className="badge badge-outline badge-sm px-3 py-2"
                            >
                                {option}
                            </span>
                        ))}
                    </div>
                </div> */}

                    {/* Action Buttons */}
                    <div className="card-actions justify-between mt-4">
                        <Link
                            to={`/products/${productId}`}
                            state={{ product }}
                            className="btn btn-outline btn-primary flex-1 hover:scale-105 transition-transform"
                        >
                            View Details
                        </Link>
                        <button
                            onClick={handleOrderNowClick}
                            className="btn btn-primary flex-1 text-white hover:scale-105 transition-transform"
                        >
                            Order Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Order Modal - Outside the card */}
            {showModal && (
                <div className="modal modal-open z-50">
                    <div className="modal-box max-w-3xl max-h-[90vh] overflow-y-auto">
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
                                    min={minimumOrder || 1}
                                    max={availableQuantity}
                                    required
                                    className="input input-bordered"
                                    placeholder={`Min: ${minimumOrder || 1}, Max: ${availableQuantity}`}
                                />
                                <label className="label">
                                    <span className="label-text-alt text-gray-500">
                                        Minimum: {minimumOrder || 1} | Available: {availableQuantity}
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
                            {paymentOptions && paymentOptions.length > 0 && (
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Available Payment Options</span>
                                    </label>
                                    <div className="flex gap-2 flex-wrap">
                                        {paymentOptions.map((option, index) => (
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
                            )}

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
        </>
    );
};

export default ProductsCard;