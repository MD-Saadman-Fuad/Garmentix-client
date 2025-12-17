import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import axios from 'axios';
import userPNG from '../../../assets/user.png';

const ManageUsers = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const { data: users = [], refetch, isLoading } = useQuery({
        queryKey: ['allUsers'],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_backend_url}/users`);
            return res.data;
        }
    });

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setSelectedRole(user.role || 'buyer');
        setSelectedStatus(user.status || 'active');
        setShowEditModal(true);
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(
                `${import.meta.env.VITE_backend_url}/users/${selectedUser.email}`,
                {
                    role: selectedRole,
                    status: selectedStatus
                }
            );

            if (response.data) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'User updated successfully',
                    confirmButtonColor: '#5089e6'
                });
                setShowEditModal(false);
                refetch();
            }
        } catch (error) {
            console.error('Error updating user:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to update user',
                confirmButtonColor: '#5089e6'
            });
        }
    };

    const handleDeleteUser = (userEmail, userName) => {
        Swal.fire({
            title: 'Delete User?',
            text: `Are you sure you want to delete "${userName}"? This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#5089e6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${import.meta.env.VITE_backend_url}/users/${userEmail}`);
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'User has been deleted.',
                        confirmButtonColor: '#5089e6'
                    });
                    refetch();
                } catch (error) {
                    console.error('Error deleting user:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'Failed to delete user',
                        confirmButtonColor: '#5089e6'
                    });
                }
            }
        });
    };

    const getRoleBadge = (role) => {
        const roleColors = {
            admin: 'badge-error',
            manager: 'badge-warning',
            buyer: 'badge-info'
        };
        return roleColors[role?.toLowerCase()] || 'badge-neutral';
    };

    const getStatusBadge = (status) => {
        const statusColors = {
            active: 'badge-success',
            suspended: 'badge-error',
            pending: 'badge-warning'
        };
        return statusColors[status?.toLowerCase()] || 'badge-neutral';
    };

    // Filter users based on search
    const filteredUsers = users.filter(user => {
        const searchLower = searchTerm.toLowerCase();
        return (
            user.name?.toLowerCase().includes(searchLower) ||
            user.displayName?.toLowerCase().includes(searchLower) ||
            user.email?.toLowerCase().includes(searchLower) ||
            user.role?.toLowerCase().includes(searchLower)
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
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Manage Users</h1>
                    <p className="text-gray-600 mt-2">Manage user roles and permissions</p>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Search Users</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Search by name, email, or role..."
                            className="input input-bordered"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Results Count */}
                    <div className="mt-4 text-sm text-gray-600">
                        Showing {filteredUsers.length} of {users.length} users
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {filteredUsers.length === 0 ? (
                        <div className="text-center py-16">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 mx-auto text-gray-400 mb-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                            </svg>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Users Found</h3>
                            <p className="text-gray-500">
                                {searchTerm ? 'Try adjusting your search criteria.' : 'There are no users in the system yet.'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead style={{ backgroundColor: '#5089e6' }}>
                                    <tr className="text-white text-base">
                                        <th>Photo</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user._id || user.email} className="hover">
                                            <td>
                                                <div className="avatar">
                                                    <div className="w-12 h-12 rounded-full">
                                                        <img
                                                            src={user.photoURL || userPNG}
                                                            alt={user.displayName || user.name}
                                                            className="object-cover"
                                                            onError={(e) => {
                                                                console.log("Image failed to load:", user.photoURL);
                                                                e.target.src = userPNG;
                                                            }}
                                                            crossOrigin="anonymous"
                                                            referrerPolicy="no-referrer"
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="font-semibold text-gray-900">
                                                    {user.displayName || user.name || 'N/A'}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="text-sm text-gray-700">{user.email}</div>
                                            </td>
                                            <td>
                                                <span className={`badge badge-lg ${getRoleBadge(user.role)} capitalize font-semibold`}>
                                                    {user.role || 'buyer'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge badge-lg ${getStatusBadge(user.status)} capitalize font-semibold`}>
                                                    {user.status || 'active'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEditUser(user)}
                                                        className="btn btn-sm"
                                                        style={{ backgroundColor: '#5089e6', color: 'white' }}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                        </svg>
                                                        Update
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user.email, user.displayName || user.name)}
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

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-3xl font-bold" style={{ color: '#5089e6' }}>
                                    {users.filter(u => u.role === 'admin').length}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">Admins</div>
                            </div>
                            <div className="badge badge-error badge-lg">Admin</div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-3xl font-bold" style={{ color: '#5089e6' }}>
                                    {users.filter(u => u.role === 'manager').length}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">Managers</div>
                            </div>
                            <div className="badge badge-warning badge-lg">Manager</div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-3xl font-bold" style={{ color: '#5089e6' }}>
                                    {users.filter(u => u.role === 'buyer' || !u.role).length}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">Buyers</div>
                            </div>
                            <div className="badge badge-info badge-lg">Buyer</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-2xl mb-6" style={{ color: '#5089e6' }}>Update User</h3>
                        <form onSubmit={handleUpdateUser}>
                            {/* User Info Display */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="avatar">
                                        <div className="w-16 h-16 rounded-full">
                                            <img
                                                src={selectedUser.photoURL || userPNG}
                                                alt={selectedUser.displayName || selectedUser.name}
                                                className="object-cover"
                                                onError={(e) => {
                                                    console.log("Image failed to load:", selectedUser.photoURL);
                                                    e.target.src = userPNG;
                                                }}
                                                crossOrigin="anonymous"
                                                referrerPolicy="no-referrer"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-lg text-gray-900">
                                            {selectedUser.displayName || selectedUser.name || 'N/A'}
                                        </div>
                                        <div className="text-sm text-gray-600">{selectedUser.email}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Role Selection */}
                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text font-semibold">User Role</span>
                                </label>
                                <select
                                    className="select select-bordered"
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    required
                                >
                                    <option value="buyer">Buyer</option>
                                    <option value="manager">Manager</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            {/* Status Selection */}
                            <div className="form-control mb-6">
                                <label className="label">
                                    <span className="label-text font-semibold">Account Status</span>
                                </label>
                                <select
                                    className="select select-bordered"
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    required
                                >
                                    <option value="active">Active</option>
                                    <option value="suspended">Suspended</option>
                                    <option value="pending">Pending</option>
                                </select>
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
                                    Update User
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

export default ManageUsers;