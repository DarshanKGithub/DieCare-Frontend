'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Swal from 'sweetalert2';
import UserTable from '../UserTable';
import UserModal from '../UserModel';
import { FaSpinner, FaSignOutAlt } from 'react-icons/fa';

export default function AdminDashboard() {
  const [hodUsers, setHodUsers] = useState([]);
  const [employeeUsers, setEmployeeUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [userRole, setUserRole] = useState('hod');

  // Prevent navigation to login page if authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Check if user is trying to navigate to login page
    if (token && pathname === '/') {
      Swal.fire({
        icon: 'warning',
        title: 'Access Denied',
        text: 'You must logout before accessing the login page.',
        confirmButtonColor: '#1e40af',
        timer: 1500,
        showConfirmButton: false,
      });
      router.push('/dashboard'); // Redirect back to dashboard
      return;
    }

    // If no token, redirect to login
    if (!token) {
      router.push('/');
      return;
    }

    // Fetch user data
    const fetchUsers = async (role, setUsers) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users?role=${role}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch ${role} users`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error(`[FETCH ${role.toUpperCase()} ERROR] ${error.message}`);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Error fetching ${role} users: ${error.message}`,
          confirmButtonColor: '#1e40af',
        });
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchUsers('hod', setHodUsers),
        fetchUsers('employee', setEmployeeUsers),
      ]);
      setLoading(false);
    };

    fetchData();
  }, [router, pathname]);

  // Logout Handler with SweetAlert2 Confirmation
  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#1e40af',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        router.push('/');
        Swal.fire({
          icon: 'success',
          title: 'Logged Out',
          text: 'You have been logged out successfully!',
          confirmButtonColor: '#1e40af',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  // Modal Handlers
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

  // CRUD Handlers
  const handleSaveUser = async (userData) => {
    const token = localStorage.getItem('token');
    const url = modalMode === 'add' ? `${process.env.NEXT_PUBLIC_API_URL}/register` : `${process.env.NEXT_PUBLIC_API_URL}/users/${userData.id}`;
    const method = modalMode === 'add' ? 'POST' : 'PUT';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${modalMode} user`);
      }

      const updatedUser = await response.json();
      const targetStateSetter = userRole === 'hod' ? setHodUsers : setEmployeeUsers;

      if (modalMode === 'add') {
        targetStateSetter((prev) => [...prev, updatedUser.user]);
      } else {
        targetStateSetter((prev) => prev.map((u) => (u.id === updatedUser.user.id ? updatedUser.user : u)));
      }

      handleCloseModal();
      Swal.fire({
        icon: 'success',
        title: `User ${modalMode === 'add' ? 'Added' : 'Updated'}`,
        text: `User ${modalMode === 'add' ? 'added' : 'updated'} successfully!`,
        confirmButtonColor: '#1e40af',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(`[${modalMode.toUpperCase()} USER ERROR] ${error.message}`);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error ${modalMode === 'add' ? 'adding' : 'updating'} user: ${error.message}`,
        confirmButtonColor: '#1e40af',
      });
    }
  };

  const handleDeleteUser = async (userId, role) => {
    const result = await Swal.fire({
      title: 'Are you sure you want to delete this user?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e40af',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });

    if (result.isConfirmed) {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete user');
        }

        const targetStateSetter = role === 'hod' ? setHodUsers : setEmployeeUsers;
        targetStateSetter((prev) => prev.filter((user) => user.id !== userId));
        Swal.fire({
          icon: 'success',
          title: 'User Deleted',
          text: 'User deleted successfully!',
          confirmButtonColor: '#1e40af',
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error(`[DELETE USER ERROR] ${error.message}`);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Error deleting user: ${error.message}`,
          confirmButtonColor: '#1e40af',
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-blue-900 to-gray-700">
      {/* Header */}
      <header className="bg-gray-900/90 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl text-white font-semibold tracking-tight">DieCare</span>
            <span className="text-white text-2xl font-bold">Admin Portal</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2 bg-blue-800 rounded-lg hover:bg-blue-900 hover:shadow-xl transition duration-300 transform hover:scale-105"
          >
            <FaSignOutAlt className="text-lg" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-gray-900">Admin Dashboard</h2>
            {loading && <FaSpinner className="animate-spin text-xl text-blue-600" />}
          </div>

          {loading ? (
            <div className="text-center py-10 text-gray-500">Loading user data...</div>
          ) : (
            <div className="space-y-8">
              <UserTable
                title="HOD Users"
                users={hodUsers}
                onAdd={() => handleOpenModal('add', 'hod')}
                onEdit={(user) => handleOpenModal('edit', 'hod', user)}
                onDelete={(userId) => handleDeleteUser(userId, 'hod')}
              />
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

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-400">
          © 2025 DieCare Engineering IT Department. All rights reserved.
        </footer>
      </main>

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
    </div>
  );
}