'use client'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useState } from 'react'

export default function Home() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, data);
      alert('✅ Login Successful');
      console.log(response.data);
      // Redirect Logic Here
    } catch (error) {
      alert('❌ Login Failed: ' + (error.response?.data?.error || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-blue-100 to-gray-200 p-4">
      <div className="flex flex-col md:flex-row bg-white shadow-2xl rounded-3xl overflow-hidden max-w-5xl w-full">
        
        {/* Left Side - Company Image */}
        <div className="md:w-1/2 bg-gradient-to-br from-blue-800 to-blue-600 flex items-center justify-center p-8">
          <h1 className="text-white text-4xl font-bold text-center leading-snug">
            DieCare IT Department<br />
          </h1>
        </div>

        {/* Right Side - Login Form */}
        <div className="md:w-1/2 p-10 flex flex-col justify-center space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">Employee Login</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div>
              <label className="block text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="yourname@endurance.com"
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Password</label>
              <input
                type="password"
                {...register('password', { required: 'Password is required' })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter password"
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg font-semibold text-white ${loading ? 'bg-gray-400' : 'bg-blue-700 hover:bg-blue-800'} transition`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

          </form>

          <p className="text-center text-sm text-gray-500">
            Powered by DieCare Engineering IT Department
          </p>
        </div>
      </div>
    </div>
  );
}
