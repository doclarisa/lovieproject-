'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('siteAuthenticated');
    if (auth !== 'true') {
      router.push('/');
    }

    const adminAuth = localStorage.getItem('adminAuthenticated');
    if (adminAuth === 'true') {
      setIsAdmin(true);
    }
  }, [router]);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (adminPassword === correctPassword) {
      localStorage.setItem('adminAuthenticated', 'true');
      setIsAdmin(true);
      setError('');
    } else {
      setError('Invalid admin password');
      setAdminPassword('');
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>

        <form onSubmit={handleAdminLogin} className="bg-white rounded-lg shadow-md p-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Password
            </label>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => {
                setAdminPassword(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter admin password"
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Panel</h1>

      <div className="bg-white rounded-lg shadow-md p-8">
        <p className="text-gray-700 mb-4">Welcome to the admin panel!</p>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">Admin Features</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>Manage profiles</li>
            <li>View submissions</li>
            <li>System settings</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
