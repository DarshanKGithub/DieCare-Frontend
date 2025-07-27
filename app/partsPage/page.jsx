'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import axios from 'axios';

// Mock data for parts
const mockParts = [
  { serial_number: 'P001', part_name: 'Gearbox', company_name: 'Acme Corp', sap_code: 'SAP123', location: 'Warehouse A' },
  { serial_number: 'P002', part_name: 'Shaft', company_name: 'Beta Inc', sap_code: 'SAP456', location: 'Warehouse B' },
];

export default function PartsPage() {
  const router = useRouter();
  const [parts, setParts] = useState(mockParts);
  const [partsLoading, setPartsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const userRole = localStorage.getItem('role') || 'employee';
    setToken(storedToken);
    setRole(userRole);

    if (!storedToken || userRole !== 'employee') {
      console.log('No token or incorrect role, redirecting to login');
      router.push('/');
      return;
    }

    // Fetch parts from API
    const fetchParts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/parts`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        setParts(response.data);
        setPartsLoading(false);
      } catch (error) {
        console.error('Error fetching parts:', error);
        setParts(mockParts); // Fallback to mock data
        setPartsLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to fetch parts',
          confirmButtonColor: '#1e40af',
        });
      }
    };
    fetchParts();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-blue-900 to-gray-700">
      <nav className="bg-gray-900/90 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-white text-2xl font-bold">DieCare Portal - Parts</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/employeeDashboard')}
                className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold transition duration-300"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-white mb-6">Parts Inventory</h1>
        <div className="bg-white/90 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Parts List</h2>
          {partsLoading ? (
            <p className="text-gray-600">Loading parts...</p>
          ) : parts.length === 0 ? (
            <p className="text-gray-600">No parts available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SAP Code</th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th> */}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {parts.map((part) => (
                    <tr key={part.serial_number}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{part.serial_number}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{part.part_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{part.company_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{part.sap_code}</td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{part.location}</td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}