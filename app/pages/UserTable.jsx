'use client';

import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

export default function UserTable({ title, users, onAdd, onEdit, onDelete }) {
  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 py-3 px-4 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition duration-300 transform hover:scale-105"
        >
          <FaPlus />
          Add User
        </button>
      </div>
      <div className="overflow-x-auto bg-white/90 rounded-2xl shadow-2xl border border-gray-200">
        <table className="min-w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-700 uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-6 py-3 font-medium">Name</th>
              <th scope="col" className="px-6 py-3 font-medium">Email</th>
              <th scope="col" className="px-6 py-3 font-medium">Contact Number</th>
              <th scope="col" className="px-6 py-3 font-medium">Department</th>
              <th scope="col" className="px-6 py-3 font-medium">Designation</th>
              <th scope="col" className="px-6 py-3 font-medium">Role</th>
              <th scope="col" className="px-6 py-3 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
13                  <td className="px-6 py-4">{user.contact_number || '-'}</td>
                  <td className="px-6 py-4">{user.department_name || '-'}</td>
                  <td className="px-6 py-4">{user.designation || '-'}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() => onEdit(user)}
                        className="text-blue-600 hover:text-blue-800 transition-colors transform hover:scale-110"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(user.id)}
                        className="text-red-600 hover:text-red-800 transition-colors transform hover:scale-110"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}