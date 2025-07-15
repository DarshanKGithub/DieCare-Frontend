'use client'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useState } from 'react'
import Link from 'next/link'

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/register`, data);
      alert('✅ Registered Successfully');
      console.log(response.data);
    } catch (error) {
      alert('❌ Registration Failed: ' + (error.response?.data?.error || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-blue-100 to-gray-200 px-4">
      <div className="flex flex-col md:flex-row bg-white shadow-2xl rounded-3xl overflow-hidden max-w-5xl w-full h-[90%]">

        {/* Left Side */}
        <div className="md:w-1/2 bg-gradient-to-br from-blue-800 to-blue-600 flex flex-col justify-center p-6">
          <h1 className="text-white text-3xl font-bold text-center mb-2">Join DieCare Portal</h1>
          <p className="text-white text-center text-sm font-light">A Smart Solution for Engineering Teams</p>
        </div>

        {/* Right Side */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Register</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 overflow-y-auto h-[75%]">

            <div className="flex flex-col space-y-1">
              <input placeholder="Full Name" {...register('name', { required: 'Name is required' })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="flex flex-col space-y-1">
              <input placeholder="Email Address" type="email" {...register('email', { required: 'Email is required' })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col space-y-1">
              <input placeholder="Contact Number" {...register('contact_number', { required: 'Contact is required' })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              {errors.contact_number && <p className="text-xs text-red-500">{errors.contact_number.message}</p>}
            </div>

            <div className="flex flex-col space-y-1">
              <input placeholder="Department" {...register('department_name', { required: 'Department is required' })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              {errors.department_name && <p className="text-xs text-red-500">{errors.department_name.message}</p>}
            </div>

            <div className="flex flex-col space-y-1">
              <input placeholder="Designation" {...register('designation', { required: 'Designation is required' })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              {errors.designation && <p className="text-xs text-red-500">{errors.designation.message}</p>}
            </div>

            <div className="flex flex-col space-y-1">
              <select {...register('role', { required: 'Role is required' })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Select Role</option>
                <option value="employee">Employee</option>
                <option value="hod">Head of Department</option>
              </select>
              {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
            </div>

            <div className="flex flex-col space-y-1">
              <input placeholder="Password" type="password" {...register('password', { required: 'Password is required' })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold text-white ${loading ? 'bg-gray-400' : 'bg-blue-700 hover:bg-blue-800'} transition`}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <Link href="/" className="text-center text-blue-700 font-semibold text-sm mt-4 hover:underline">Already Registered? Login</Link>

          <p className="text-center text-xs text-gray-500 mt-2">Powered by DieCare Engineering IT Department</p>
        </div>
      </div>
    </div>
  );
}
