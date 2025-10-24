"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        const decoded = jwtDecode(token);
        if (
          parsedUser.email === decoded.email &&
          parsedUser.name &&
          parsedUser.role &&
          ['Admin', 'HOD', 'Quality', 'Employee', 'PDC'].includes(parsedUser.role)
        ) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
          router.push('/');
        }
      } catch (error) {
        console.error('Error decoding token or parsing user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        router.push('/');
      }
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      router.push('/');
    }
  }, [router]);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}