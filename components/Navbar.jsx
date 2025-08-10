"use client";

import { LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ConfirmationModal } from '../components/ConfirmationModal';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname(); // Get current route
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
     const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    useEffect(() => {
        const protectedRoutes = [
            '/admin-dashboard',
            '/hod-dashboard',
            '/quality-dashboard',
            '/employee-dashboard',
            '/dashboard',
        ];

        const userData = localStorage.getItem('user');
        console.log('Navbar userData:', userData); // Debug localStorage

        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                if (parsedUser.name && parsedUser.role) {
                    setUser(parsedUser);
                } else {
                    console.error('Invalid user data in localStorage:', parsedUser);
                    localStorage.removeItem('user');
                    if (!protectedRoutes.includes(pathname)) {
                        router.push('/');
                    }
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('user');
                if (!protectedRoutes.includes(pathname)) {
                    router.push('/');
                }
            }
        } else if (!protectedRoutes.includes(pathname)) {
            router.push('/');
        }

        setIsLoading(false);
    }, [router, pathname]);

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
                <h1 className="text-xl font-bold text-white">ERP Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-300">Welcome, {user ? `${user.name} (${user.role})` : 'Guest'}</span>
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
};