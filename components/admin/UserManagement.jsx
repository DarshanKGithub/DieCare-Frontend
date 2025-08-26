"use client";
import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { PlusCircle } from 'lucide-react';
import { UserModal } from './UserModal';
import { Edit, Trash2 } from 'lucide-react';



export const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    const fetchUsers = async () => {
        if (!token) {
            setError("Authentication token not found.");
            setLoading(false);
            return;
        }
        setLoading(true);
        const response = await apiService.getAllUsers(token);
        if (response.success) {
            // Filter out the Admin role from the main display list
            const displayUsers = response.users.filter(u => u.role !== 'Admin');
            setUsers(displayUsers);
            setFilteredUsers(displayUsers);
        } else {
            setError(response.message || "Failed to fetch users.");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, [token]);

    useEffect(() => {
        if (filter === 'All') {
            setFilteredUsers(users);
        } else {
            setFilteredUsers(users.filter(user => user.role === filter));
        }
    }, [filter, users]);

    const handleAddUser = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };
    
    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            const response = await apiService.deleteUser(userId, token);
            if (response.success) {
                fetchUsers(); // Re-fetch users to update the list
            } else {
                alert(`Error: ${response.message}`);
            }
        }
    };

    const handleSaveUser = () => {
        fetchUsers(); // Re-fetch users after adding/editing
    };

    if (loading) return <p className="text-center text-gray-400">Loading users...</p>;
    if (error) return <p className="text-center text-red-400">{error}</p>;

    return (
        <div className="bg-gray-800/50 p-6 rounded-lg shadow-xl w-full">
            {isModalOpen && <UserModal user={editingUser} onClose={() => setIsModalOpen(false)} onSave={handleSaveUser} token={token} />}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">User Management</h2>
                <div className="flex items-center gap-4">
                    <div className="flex bg-gray-700 rounded-lg p-1">
                        {['All', 'HOD', 'Quality', 'Employee','PDC'].map(role => (
                            <button
                                key={role}
                                onClick={() => setFilter(role)}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${filter === role ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                    <button onClick={handleAddUser} className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg">
                        <PlusCircle size={20} />
                        Add User
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-gray-300">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Designation</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                <td className="p-4">{user.name}</td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4"><span className={`px-2 py-1 text-xs rounded-full ${user.role === 'HOD' ? 'bg-purple-600' : user.role === 'Quality' ? 'bg-blue-600' : 'bg-green-600' ? 'bg-amber-400' : user.role === 'PDC'} `}>{user.role}</span></td>
                                <td className="p-4">{user.designation || 'N/A'}</td>
                                <td className="p-4 flex gap-2">
                                    <button onClick={() => handleEditUser(user)} className="text-gray-400 hover:text-cyan-400"><Edit size={18} /></button>
                                    <button onClick={() => handleDeleteUser(user.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredUsers.length === 0 && <p className="text-center py-8 text-gray-500">No users found for this role.</p>}
            </div>
        </div>
    );
};