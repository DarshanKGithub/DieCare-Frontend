'use client';

import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Link from 'next/link';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Validate environment variables
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('API URL is not configured');
      }
      if (!process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        throw new Error('Admin email is not configured');
      }

      // Log the email being used for debugging
      console.log('Attempting login with email:', data.email);

      let response;
      const isAdmin = data.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      const endpoint = isAdmin
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`;

      console.log('Calling endpoint:', endpoint);

      response = await axios.post(endpoint, {
        email: data.email,
        password: data.password,
      });

      // Log the response for debugging
      console.log('API Response:', response.data);

      const { token } = response.data;
      if (!token) {
        throw new Error('No token received from server');
      }

      localStorage.setItem('token', token);

      // Decode token safely
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload.role;
        console.log('Decoded token role:', role);

        if (!role) {
          throw new Error('Role not found in token');
        }

        await Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'You have logged in successfully! Redirecting...',
          confirmButtonColor: '#1e40af',
          timer: 1500,
          showConfirmButton: false,
        });

        // Navigate based on role
        if (role === 'admin') {
          console.log('Navigating to /adminDashboard');
          router.push('/adminDashboard');
        } else if (role === 'hod') {
          console.log('Navigating to /HODDashboard');
          router.push('/HODDashboard');
        } else if (role === 'employee') {
          console.log('Navigating to /employeeDashboard');
          router.push('/employeeDashboard');
        } else {
          throw new Error(`Unknown role: ${role}`);
        }
      } catch (decodeError) {
        console.error('Token decoding error:', decodeError);
        throw new Error('Invalid token format');
      }
    } catch (error) {
      console.error('Login error:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.response?.data?.message || error.message || 'An unknown error occurred',
        confirmButtonColor: '#1e40af',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 px-4 py-12">
      <div className="flex flex-col md:flex-row bg-white/90 shadow-2xl rounded-2xl overflow-hidden max-w-6xl w-full h-[85vh] border border-gray-200">
        <div className="md:w-1/2 bg-gradient-to-br from-gray-800 via-blue-900 to-gray-700 flex flex-col justify-center p-10 relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Cpath fill=%22none%22 stroke=%22%23ffffff33%22 stroke-width=%221%22 d=%22M10 10 L90 90 M10 90 L90 10%22/%3E%3C/svg%3E')] opacity-10"></div>
          <h1 className="text-white text-4xl font-bold text-center mb-4 drop-shadow-lg">DieCare Portal</h1>
          <p className="text-white text-center text-lg font-medium">Innovative Engineering Solutions</p>
          <div className="mt-6 text-center">
            <span className="inline-block px-4 py-2 bg-blue-600/50 rounded-full text-white text-sm font-semibold animate-pulse">
              Powered by Precision
            </span>
          </div>
        </div>
        <div className="md:w-1/2 p-10 flex flex-col justify-center bg-gray-50">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Secure Login</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col space-y-2">
              <input
                placeholder="Email Address"
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>
            <div className="flex flex-col space-y-2">
              <input
                placeholder="Password"
                type="password"
                {...register('password', { required: 'Password is required' })}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
              />
              {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold text-white ${
                loading ? 'bg-gray-500' : 'bg-blue-700 hover:bg-blue-800'
              } transition duration-300 transform hover:scale-105`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-6">
            © 2025 DieCare Engineering IT Department. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}