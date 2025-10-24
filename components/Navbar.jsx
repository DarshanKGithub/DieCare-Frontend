"use client";

import Link from 'next/link';
import { Bell, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { useNotificationStore } from '../app/store/notificationStore';
import { useAuth } from '../app/contexts/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { notifications, unreadCount, initialize, markAsRead, clearNotifications } = useNotificationStore();

  useEffect(() => {
    const protectedRoutes = [
      '/admin-dashboard',
      '/hod-dashboard',
      '/quality-dashboard',
      '/employee-dashboard',
      '/pdc-dashboard',
    ];

    if (!user && !protectedRoutes.includes(pathname)) {
      router.push('/');
    } else if (user) {
      const token = localStorage.getItem('accessToken');
      initialize(user.role, token);
    }

    setIsLoading(false);
  }, [user, router, pathname, initialize]);

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    router.push('/');
    setIsLogoutModalOpen(false);
  };

  if (isLoading) {
    return <div className="bg-gray-800/50 w-full p-4 text-white">Loading...</div>;
  }

  return (
    <>
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        title="Confirm Logout"
      >
        Are you sure you want to logout?
      </ConfirmationModal>
      <nav className="bg-gray-800/50 backdrop-blur-sm w-full p-4 shadow-lg flex justify-between items-center fixed top-0 left-0 right-0 z-10">
        <h1 className="text-xl font-bold text-white">DieCare</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-300">Welcome, {user ? `${user.name} (${user.role})` : 'Guest'}</span>
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="text-gray-300 hover:text-white focus:outline-none relative"
            >
              <Bell size={24} />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2 py-1">
                  {unreadCount}
                </span>
              )}
            </button>
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-96 bg-gray-700 rounded-lg shadow-lg p-4 z-50">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Notifications</h3>
                  {notifications.length > 0 && (
                    <button
                      onClick={() => clearNotifications(localStorage.getItem('accessToken'))}
                      className="text-sm text-cyan-400 hover:text-cyan-300"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <p className="text-gray-400">No new notifications</p>
                ) : (
                  notifications.map(notification => (
                    <Link
                      key={notification.id}
                      href={`/quality-dashboard/task/${notification.task_id}`}
                      className={`block p-3 mb-2 rounded ${notification.read ? 'bg-gray-600' : 'bg-gray-800'}`}
                      onClick={() => {
                        markAsRead(notification.id, localStorage.getItem('accessToken'));
                        setIsNotificationOpen(false);
                      }}
                    >
                      <p className="text-sm font-medium">{notification.part_name}</p>
                      <p className="text-xs text-gray-400">Company: {notification.company_name}</p>
                      <p className="text-xs text-gray-400">Location: {notification.location}</p>
                      <p className="text-xs text-gray-400">SAP Code: {notification.sap_code}</p>
                      <p className="text-xs text-gray-400">Comments: {notification.comments}</p>
                      <p className="text-xs text-gray-400">{new Date(notification.created_at).toLocaleString()}</p>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </nav>
    </>
  );
}