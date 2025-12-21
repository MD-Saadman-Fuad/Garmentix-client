import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import axios from 'axios';

const AllProductsAdmin = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        productName: '',
        description: '',
        price: '',
        category: '',
        image: '',
        availableQuantity: '',
        minimumOrder: '',
        paymentOptions: []
    });

    const { data: products = [], refetch, isLoading } = useQuery({
        queryKey: ['allProducts'],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_backend_url}/products`);
            return res.data;
        }
    });

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setFormData({
            productName: product.productName || '',
            description: product.description || '',
            price: product.price || '',
            category: product.category || '',
            image: product.image || '',
            availableQuantity: product.availableQuantity || '',
            minimumOrder: product.minimumOrder || '',
            paymentOptions: product.paymentOptions || []
        });
        setShowEditModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePaymentOptionToggle = (option) => {
        setFormData(prev => ({
            ...prev,
            paymentOptions: prev.paymentOptions.includes(option)
                ? prev.paymentOptions.filter(o => o !== option)
                : [...prev.paymentOptions, option]
        }));
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(
                `${import.meta.env.VITE_backend_url}/products/${selectedProduct._id}`,
                formData
            );

            if (response.data) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Product updated successfully',
                    confirmButtonColor: '#5089e6'
                });
                setShowEditModal(false);
                refetch();
            }
        } catch (error) {
            console.error('Error updating product:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to update product',
                confirmButtonColor: '#5089e6'
            });
        }
    };

    const handleDelete = (productId, productName) => {
        Swal.fire({
            title: 'Delete Product?',
            text: `Are you sure you want to delete "${productName}"? This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#5089e6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${import.meta.env.VITE_backend_url}/products/${productId}`);
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'Product has been deleted.',
                        confirmButtonColor: '#5089e6'
                    });
                    refetch();
                } catch (error) {
                    console.error('Error deleting product:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'Failed to delete product',
                        confirmButtonColor: '#5089e6'
                    });
                }
            }
        });
    };

    const handleToggleShowOnHome = async (productId, currentStatus) => {
        try {
            await axios.put(
                `${import.meta.env.VITE_backend_url}/products/${productId}`,
                { showOnHome: !currentStatus }
            );
            refetch();
        } catch (error) {
            console.error('Error updating product:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to update product visibility',
                confirmButtonColor: '#5089e6'
            });
        }
    };

    // Filter products based on search
    const filteredProducts = products.filter(product => {
        const searchLower = searchTerm.toLowerCase();
        return (
            product.productName?.toLowerCase().includes(searchLower) ||
            product.category?.toLowerCase().includes(searchLower) ||
            product.description?.toLowerCase().includes(searchLower)
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
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-gray-100 py-8 px-4">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8" data-aos="fade-up">
                    <h1 className="text-4xl font-bold text-gray-900">All Products</h1>
                    <p className="text-gray-600 mt-2">Manage all products in the system</p>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6" data-aos="fade-up">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Search Products</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Search by name, category, or description..."
                            className="input input-bordered"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Results Count */}
                    <div className="mt-4 text-sm text-gray-600">
                        Showing {filteredProducts.length} of {products.length} products
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden" data-aos="fade-up">
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-16">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 mx-auto text-gray-400 mb-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                            </svg>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Found</h3>
                            <p className="text-gray-500">
                                {searchTerm ? 'Try adjusting your search criteria.' : 'There are no products in the system yet.'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead style={{ backgroundColor: '#5089e6' }}>
                                    <tr className="text-white text-base">
                                        <th>Image</th>
                                        <th>Product Name</th>
                                        <th>Price</th>
                                        <th>Category</th>
                                        <th>Available Qty</th>
                                        <th>Min Order</th>
                                        <th>Show on Home</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((product) => (
                                        <tr key={product._id} className="hover">
                                            <td>
                                                <div className="avatar">
                                                    <div className="w-16 h-16 rounded-lg">
                                                        <img
                                                            src={product.image}
                                                            alt={product.productName}
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="font-semibold text-gray-900">{product.productName}</div>
                                                <div className="text-sm text-gray-500 line-clamp-2">{product.description}</div>
                                            </td>
                                            <td>
                                                <span className="font-bold text-lg" style={{ color: '#5089e6' }}>
                                                    ${product.price}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="badge badge-outline">{product.category}</span>
                                            </td>
                                            <td>
                                                <div className="text-sm text-gray-700">{product.availableQuantity || 0}</div>
                                            </td>
                                            <td>
                                                <div className="text-sm text-gray-700">{product.minimumOrder || 0}</div>
                                            </td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    className="toggle toggle-success"
                                                    checked={product.showOnHome || false}
                                                    onChange={() => handleToggleShowOnHome(product._id, product.showOnHome)}
                                                />
                                            </td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        className="btn btn-sm"
                                                        style={{ backgroundColor: '#5089e6', color: 'white' }}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                        </svg>
                                                        Update
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product._id, product.title)}
                                                        className="btn btn-sm btn-error text-white"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                        </svg>
                                                        Delete
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
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-3xl max-h-[90vh] overflow-y-auto">
                        <h3 className="font-bold text-2xl mb-6" style={{ color: '#5089e6' }}>Update Product</h3>
                        <form onSubmit={handleUpdateProduct}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Product Name */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Product Name</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="productName"
                                        value={formData.productName}
                                        onChange={handleInputChange}
                                        className="input input-bordered"
                                        required
                                    />
                                </div>

                                {/* Price */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Price ($)</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="input input-bordered"
                                        step="0.01"
                                        required
                                    />
                                </div>

                                {/* Category */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Category</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="input input-bordered"
                                        required
                                    />
                                </div>

                                {/* Product Image URL */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Product Image URL</span>
                                    </label>
                                    <input
                                        type="url"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleInputChange}
                                        className="input input-bordered"
                                        required
                                    />
                                </div>

                                {/* Available Quantity */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Available Quantity</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="availableQuantity"
                                        value={formData.availableQuantity}
                                        onChange={handleInputChange}
                                        className="input input-bordered"
                                        min="0"
                                        required
                                    />
                                </div>

                                {/* Minimum Order */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Minimum Order</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="minimumOrder"
                                        value={formData.minimumOrder}
                                        onChange={handleInputChange}
                                        className="input input-bordered"
                                        min="1"
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div className="form-control md:col-span-2">
                                    <label className="label">
                                        <span className="label-text font-semibold">Description</span>
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="textarea textarea-bordered h-24"
                                        required
                                    ></textarea>
                                </div>

                                {/* Payment Options */}
                                <div className="form-control md:col-span-2">
                                    <label className="label">
                                        <span className="label-text font-semibold">Payment Options</span>
                                    </label>
                                    <div className="flex flex-wrap gap-4">
                                        {['Bank Transfer', 'Cash on Delivery', 'Credit Card', 'PayPal'].map(option => (
                                            <label key={option} className="label cursor-pointer gap-2">
                                                <input
                                                    type="checkbox"
                                                    className="checkbox checkbox-primary"
                                                    checked={formData.paymentOptions.includes(option)}
                                                    onChange={() => handlePaymentOptionToggle(option)}
                                                />
                                                <span className="label-text">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="modal-action">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="btn btn-outline"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn text-white"
                                    style={{ backgroundColor: '#5089e6' }}
                                >
                                    Update Product
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="modal-backdrop" onClick={() => setShowEditModal(false)}></div>
                </div>
            )}
        </div>
    );
};

export default AllProductsAdmin;