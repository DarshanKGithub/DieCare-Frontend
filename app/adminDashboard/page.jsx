'use client';

import { useState, useEffect } from 'react';
import UserTable from '../UserTable'; // Assuming UserTable is in the same directory or a components folder
import UserModal from '../UserModel'; // Assuming UserModal is in the same directory or a components folder
import { FaSpinner } from 'react-icons/fa';

export default function AdminDashboard() {
  const [hodUsers, setHodUsers] = useState([]);
  const [employeeUsers, setEmployeeUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // For editing
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [userRole, setUserRole] = useState('hod'); // 'hod' or 'employee'

  // Fetch user data
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      // Placeholder data
      setHodUsers([
        { id: 1, name: 'John Doe', email: 'john.doe@diecare.com', department: 'Mechanical' },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@diecare.com', department: 'Production' },
      ]);
      setEmployeeUsers([
        { id: 3, name: 'Mike Ross', email: 'mike.ross@diecare.com', department: 'Assembly' },
        { id: 4, name: 'Sarah Lee', email: 'sarah.lee@diecare.com', department: 'Quality' },
      ]);
      setLoading(false);
    }, 1500); // Simulate 1.5 second loading time
  }, []);

  // --- Modal Handlers ---
  const handleOpenModal = (mode, role, user = null) => {
    setModalMode(mode);
    setUserRole(role);
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
  };

  // --- CRUD Handlers ---
  const handleSaveUser = (userData) => {
    const targetStateSetter = userRole === 'hod' ? setHodUsers : setEmployeeUsers;

    if (modalMode === 'add') {
      // Add new user with a temporary ID
      targetStateSetter(prev => [...prev, { ...userData, id: Date.now() }]);
    } else {
      // Update existing user
      targetStateSetter(prev => prev.map(u => u.id === userData.id ? userData : u));
    }
    handleCloseModal();
  };

  const handleDeleteUser = (userId, role) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        const targetStateSetter = role === 'hod' ? setHodUsers : setEmployeeUsers;
        targetStateSetter(prev => prev.filter(user => user.id !== userId));
    }
  };


  return (
    <>
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            {loading && <FaSpinner className="animate-spin text-2xl text-blue-600" />}
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading user data...</div>
          ) : (
            <div className="space-y-12">
              {/* HOD Users Section */}
              <UserTable
                title="HOD Users"
                users={hodUsers}
                onAdd={() => handleOpenModal('add', 'hod')}
                onEdit={(user) => handleOpenModal('edit', 'hod', user)}
                onDelete={(userId) => handleDeleteUser(userId, 'hod')}
              />

              {/* Employee Users Section */}
              <UserTable
                title="Employee Users"
                users={employeeUsers}
                onAdd={() => handleOpenModal('add', 'employee')}
                onEdit={(user) => handleOpenModal('edit', 'employee', user)}
                onDelete={(userId) => handleDeleteUser(userId, 'employee')}
              />
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <UserModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveUser}
          user={currentUser}
          mode={modalMode}
          role={userRole}
        />
      )}
    </>
  );
}