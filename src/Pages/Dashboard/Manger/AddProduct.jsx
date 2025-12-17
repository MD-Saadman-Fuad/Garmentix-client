import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import axios from 'axios';
import useAuth from '../../../Hooks/useAuth';

const AddProduct = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [formData, setFormData] = useState({
        productName: '',
        description: '',
        price: '',
        category: '',
        availableQuantity: '',
        minimumOrder: '',
        paymentOptions: [],
        showOnHome: false
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid File',
                    text: 'Please select a valid image file',
                    confirmButtonColor: '#5089e6'
                });
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                Swal.fire({
                    icon: 'error',
                    title: 'File Too Large',
                    text: 'Image size should not exceed 5MB',
                    confirmButtonColor: '#5089e6'
                });
                return;
            }

            setImageFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePaymentOptionToggle = (option) => {
        setFormData(prev => ({
            ...prev,
            paymentOptions: prev.paymentOptions.includes(option)
                ? prev.paymentOptions.filter(o => o !== option)
                : [...prev.paymentOptions, option]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Validate payment options
            if (formData.paymentOptions.length === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Payment Options Required',
                    text: 'Please select at least one payment option',
                    confirmButtonColor: '#5089e6'
                });
                setIsSubmitting(false);
                return;
            }

            // Validate image
            if (!imageFile) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Image Required',
                    text: 'Please upload a product image',
                    confirmButtonColor: '#5089e6'
                });
                setIsSubmitting(false);
                return;
            }

            let imageUrl = '';

            // Upload image to ImgBB
            try {
                const imageFormData = new FormData();
                imageFormData.append('image', imageFile);

                const imgbbResponse = await axios.post(
                    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_hosting_key}`,
                    imageFormData
                );

                imageUrl = imgbbResponse.data.data.url;
            } catch (imgError) {
                console.error('Error uploading image:', imgError);
                Swal.fire({
                    icon: 'error',
                    title: 'Image Upload Failed',
                    text: 'Failed to upload image. Please try again.',
                    confirmButtonColor: '#5089e6'
                });
                setIsSubmitting(false);
                return;
            }

            // Prepare product data
            const productData = {
                productName: formData.productName,
                description: formData.description,
                category: formData.category,
                image: imageUrl,
                price: parseFloat(formData.price),
                availableQuantity: parseInt(formData.availableQuantity),
                minimumOrder: parseInt(formData.minimumOrder),
                paymentOptions: formData.paymentOptions,
                showOnHome: formData.showOnHome,
                email: user?.email || '',
                createdAt: new Date().toISOString()
            };

            // Submit to backend
            const response = await axios.post(
                `${import.meta.env.VITE_backend_url}/products`,
                productData
            );

            if (response.data) {
                Swal.fire({
                    icon: 'success',
                    title: 'Product Created!',
                    text: 'Product has been added successfully',
                    confirmButtonColor: '#5089e6',
                    timer: 2000,
                    timerProgressBar: true
                });

                // Reset form
                setFormData({
                    productName: '',
                    description: '',
                    price: '',
                    category: '',
                    availableQuantity: '',
                    minimumOrder: '',
                    paymentOptions: [],
                    showOnHome: false
                });
                setImageFile(null);
                setImagePreview('');

                // Reset file input
                const fileInput = document.getElementById('productImage');
                if (fileInput) fileInput.value = '';
            }
        } catch (error) {
            console.error('Error adding product:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.response?.data?.message || 'Failed to add product',
                confirmButtonColor: '#5089e6'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-gray-100 py-8 px-4">
            <div className="container mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Add New Product</h1>
                    <p className="text-gray-600 mt-2">Fill in the product details below</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Product Name */}
                            <div className="form-control md:col-span-2">
                                <label className="label">
                                    <span className="label-text font-semibold text-base">
                                        Product Name <span className="text-red-500">*</span>
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    name="productName"
                                    value={formData.productName}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Men's Formal Shirt"
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            {/* Category */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold text-base">
                                        Category <span className="text-red-500">*</span>
                                    </span>
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="select select-bordered w-full"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option value="Shirt">Shirt</option>
                                    <option value="Pant">Pant</option>
                                    <option value="Jacket">Jacket</option>
                                    <option value="Accessories">Accessories</option>
                                </select>
                            </div>

                            {/* Price */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold text-base">
                                        Price ($) <span className="text-red-500">*</span>
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    placeholder="1600"
                                    className="input input-bordered w-full"
                                    step="0.01"
                                    min="0"
                                    required
                                />
                            </div>

                            {/* Available Quantity */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold text-base">
                                        Available Quantity <span className="text-red-500">*</span>
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    name="availableQuantity"
                                    value={formData.availableQuantity}
                                    onChange={handleInputChange}
                                    placeholder="500"
                                    className="input input-bordered w-full"
                                    min="0"
                                    required
                                />
                            </div>

                            {/* Minimum Order */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold text-base">
                                        Minimum Order <span className="text-red-500">*</span>
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    name="minimumOrder"
                                    value={formData.minimumOrder}
                                    onChange={handleInputChange}
                                    placeholder="25"
                                    className="input input-bordered w-full"
                                    min="1"
                                    required
                                />
                            </div>

                            {/* Product Image Upload */}
                            <div className="form-control md:col-span-2">
                                <label className="label">
                                    <span className="label-text font-semibold text-base">
                                        Product Image <span className="text-red-500">*</span>
                                    </span>
                                </label>
                                <input
                                    type="file"
                                    id="productImage"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="file-input file-input-bordered w-full"
                                    style={{ borderColor: '#5089e6' }}
                                    required
                                />
                                <p className="text-sm text-gray-500 mt-1">Max file size: 5MB. Supported formats: JPG, PNG, GIF</p>

                                {/* Image Preview */}
                                {imagePreview && (
                                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                        <p className="text-sm font-semibold text-gray-700 mb-3">Image Preview:</p>
                                        <div className="flex justify-center">
                                            <div className="avatar">
                                                <div className="w-48 h-48 rounded-lg shadow-lg">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Product preview"
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="form-control md:col-span-2">
                                <label className="label">
                                    <span className="label-text font-semibold text-base">
                                        Description <span className="text-red-500">*</span>
                                    </span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Full-sleeve formal shirt suitable for office wear."
                                    className="textarea textarea-bordered h-32 w-full"
                                    required
                                ></textarea>
                            </div>

                            {/* Payment Options */}
                            <div className="form-control md:col-span-2">
                                <label className="label">
                                    <span className="label-text font-semibold text-base">
                                        Payment Options <span className="text-red-500">*</span>
                                    </span>
                                </label>
                                <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
                                    {['Cash on Delivery', 'PayFast'].map(option => (
                                        <label key={option} className="label cursor-pointer gap-3 bg-white px-6 py-3 rounded-lg border-2 border-gray-200 hover:border-[#5089e6] transition-colors">
                                            <input
                                                type="checkbox"
                                                className="checkbox"
                                                style={{ borderColor: '#5089e6' }}
                                                checked={formData.paymentOptions.includes(option)}
                                                onChange={() => handlePaymentOptionToggle(option)}
                                            />
                                            <span className="label-text font-medium text-base">{option}</span>
                                        </label>
                                    ))}
                                </div>
                                {formData.paymentOptions.length > 0 && (
                                    <p className="text-sm font-medium mt-2" style={{ color: '#5089e6' }}>
                                        ✓ Selected: {formData.paymentOptions.join(', ')}
                                    </p>
                                )}
                            </div>

                            {/* Show on Home Page Toggle */}
                            <div className="form-control md:col-span-2">
                                <div className="flex items-center justify-between p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
                                    <div className="flex-1">
                                        <label className="label cursor-pointer justify-start gap-4">
                                            <input
                                                type="checkbox"
                                                name="showOnHome"
                                                className="toggle"
                                                style={{ backgroundColor: formData.showOnHome ? '#5089e6' : '' }}
                                                checked={formData.showOnHome}
                                                onChange={handleInputChange}
                                            />
                                            <div>
                                                <span className="label-text font-bold text-base text-gray-900">Show on Home Page</span>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Enable this to display the product in the "Our Products" section on the homepage
                                                </p>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-4 mt-8">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="btn btn-outline flex-1"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn text-white flex-1"
                                style={{ backgroundColor: '#5089e6' }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="loading loading-spinner"></span>
                                        Adding Product...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                        Add Product
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                        <div className="flex gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-blue-600 shrink-0">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <p className="font-semibold text-blue-900">Automatic Visibility</p>
                                <p className="text-sm text-blue-800 mt-1">
                                    Once created, products will automatically appear in the "All Products" page for customers to view and purchase.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                        <div className="flex gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-green-600 shrink-0">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>
                            <div>
                                <p className="font-semibold text-green-900">Home Page Feature</p>
                                <p className="text-sm text-green-800 mt-1">
                                    Enable "Show on Home Page" to feature this product in the homepage "Our Products" section.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;