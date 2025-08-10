"use client";

import { LogOut } from 'lucide-react';
import { useEffect } from 'react';


export const Navbar = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        // This effect runs on the client side after the component mounts
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            // If no user data, redirect to login
            router.push('/login');
        }
    }, [router]);

    const handleLogout = () => {
        // Clear user data from storage
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        // Redirect to the login page
        router.push('/login');
    };

    return (
        <nav className="bg-gray-800/50 backdrop-blur-sm w-full p-4 shadow-lg flex justify-between items-center">
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
    );
};