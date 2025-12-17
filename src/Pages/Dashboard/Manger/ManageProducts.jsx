import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import axios from 'axios';
import Swal from 'sweetalert2';
import useAuth from '../../../Hooks/useAuth';

const ManageProducts = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    // Fetch products created by manager
    const { data: products = [], isLoading } = useQuery({
        queryKey: ['managerProducts', user?.email],
        queryFn: async () => {
            const response = await axios.get(
                `${import.meta.env.VITE_backend_url}/products?email=${user?.email}`
            );
            return response.data;
        },
        enabled: !!user?.email
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (productId) => {
            await axios.delete(`${import.meta.env.VITE_backend_url}/products/${productId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['managerProducts']);
            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Product has been deleted successfully',
                confirmButtonColor: '#5089e6',
                timer: 2000
            });
        }
    });

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: async ({ productId, productData }) => {
            const response = await axios.put(
                `${import.meta.env.VITE_backend_url}/products/${productId}`,
                productData
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['managerProducts']);
            setEditingProduct(null);
            setImageFile(null);
            setImagePreview('');
            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'Product has been updated successfully',
                confirmButtonColor: '#5089e6',
                timer: 2000
            });
        }
    });

    const handleDelete = (product) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `Delete "${product.productName}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#5089e6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(product._id);
            }
        });
    };

    const handleEdit = (product) => {
        setEditingProduct({
            ...product,
            paymentOptions: product.paymentOptions || []
        });
        setImagePreview(product.image);
        document.getElementById('edit_modal').showModal();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid File',
                    text: 'Please select a valid image file',
                    confirmButtonColor: '#5089e6'
                });
                return;
            }

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
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            let imageUrl = editingProduct.image;

            // Upload new image if selected
            if (imageFile) {
                const imageFormData = new FormData();
                imageFormData.append('image', imageFile);

                const imgbbResponse = await axios.post(
                    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_hosting_key}`,
                    imageFormData
                );

                imageUrl = imgbbResponse.data.data.url;
            }

            const productData = {
                productName: editingProduct.productName,
                description: editingProduct.description,
                category: editingProduct.category,
                image: imageUrl,
                price: parseFloat(editingProduct.price),
                availableQuantity: parseInt(editingProduct.availableQuantity),
                minimumOrder: parseInt(editingProduct.minimumOrder),
                paymentOptions: editingProduct.paymentOptions
            };

            updateMutation.mutate({
                productId: editingProduct._id,
                productData
            });

            document.getElementById('edit_modal').close();
        } catch (error) {
            console.error('Error updating product:', error);
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: error.response?.data?.message || 'Failed to update product',
                confirmButtonColor: '#5089e6'
            });
        }
    };

    const handlePaymentOptionToggle = (option) => {
        setEditingProduct(prev => ({
            ...prev,
            paymentOptions: prev.paymentOptions.includes(option)
                ? prev.paymentOptions.filter(o => o !== option)
                : [...prev.paymentOptions, option]
        }));
    };

    // Filter products
    const filteredProducts = products.filter(product =>
        product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Manage Products</h1>
                    <p className="text-gray-600 mt-2">View and manage your created products</p>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Search Products</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Search by name or category..."
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
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead style={{ backgroundColor: '#5089e6' }} className="text-white">
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Payment Mode</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-8 text-gray-500">
                                            No products found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <tr key={product._id}>
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
                                                <div>
                                                    <div className="font-bold">{product.productName}</div>
                                                    <div className="text-sm opacity-70">{product.category}</div>
                                                </div>
                                            </td>
                                            <td className="font-semibold">${product.price?.toFixed(2)}</td>
                                            <td>
                                                <div className="flex flex-wrap gap-1">
                                                    {product.paymentOptions?.map((option, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="badge badge-sm text-white"
                                                            style={{ backgroundColor: '#5089e6' }}
                                                        >
                                                            {option}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        className="btn btn-sm text-white"
                                                        style={{ backgroundColor: '#5089e6' }}
                                                    >
                                                        Update
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product)}
                                                        className="btn btn-sm btn-error text-white"
                                                    >
                                                        Delete
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

                {/* Edit Modal */}
                <dialog id="edit_modal" className="modal">
                    <div className="modal-box max-w-3xl">
                        <h3 className="font-bold text-2xl mb-6">Update Product</h3>
                        <form onSubmit={handleUpdate}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Product Name */}
                                <div className="form-control md:col-span-2">
                                    <label className="label">
                                        <span className="label-text font-semibold">Product Name</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={editingProduct?.productName || ''}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, productName: e.target.value })}
                                        className="input input-bordered"
                                        required
                                    />
                                </div>

                                {/* Category */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Category</span>
                                    </label>
                                    <select
                                        value={editingProduct?.category || ''}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                                        className="select select-bordered"
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
                                        <span className="label-text font-semibold">Price ($)</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={editingProduct?.price || ''}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                                        className="input input-bordered"
                                        step="0.01"
                                        min="0"
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
                                        value={editingProduct?.availableQuantity || ''}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, availableQuantity: e.target.value })}
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
                                        value={editingProduct?.minimumOrder || ''}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, minimumOrder: e.target.value })}
                                        className="input input-bordered"
                                        min="1"
                                        required
                                    />
                                </div>

                                {/* Image Upload */}
                                <div className="form-control md:col-span-2">
                                    <label className="label">
                                        <span className="label-text font-semibold">Product Image</span>
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="file-input file-input-bordered w-full"
                                    />
                                    {imagePreview && (
                                        <div className="mt-3 flex justify-center">
                                            <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="form-control md:col-span-2">
                                    <label className="label">
                                        <span className="label-text font-semibold">Description</span>
                                    </label>
                                    <textarea
                                        value={editingProduct?.description || ''}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
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
                                        {['Cash on Delivery', 'PayFast'].map(option => (
                                            <label key={option} className="label cursor-pointer gap-2">
                                                <input
                                                    type="checkbox"
                                                    className="checkbox"
                                                    checked={editingProduct?.paymentOptions?.includes(option)}
                                                    onChange={() => handlePaymentOptionToggle(option)}
                                                />
                                                <span className="label-text">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="modal-action">
                                <button type="button" className="btn" onClick={() => document.getElementById('edit_modal').close()}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn text-white"
                                    style={{ backgroundColor: '#5089e6' }}
                                    disabled={updateMutation.isPending}
                                >
                                    {updateMutation.isPending ? 'Updating...' : 'Update Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>
            </div>
        </div>
    );
};

export default ManageProducts;