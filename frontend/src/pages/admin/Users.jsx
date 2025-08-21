import React, { useState, useEffect } from 'react';
import api from '../../api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/users/');
        setUsers(response.data.results || response.data);
      } catch (err) {
        setError('Failed to fetch users. You may not have permission.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div className="text-center text-gray-500 dark:text-gray-400">Loading users...</div>;
  if (error) return <div className="text-center text-red-500 p-4 bg-red-50 rounded-md">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-black dark:text-white">Manage Users</h1>

      <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-black border border-gray-200 text-xs text-gray-700 dark:text-gray-300 uppercase">
            <tr>
              <th className="px-6 py-3">User ID</th>
              <th className="px-6 py-3">Username</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Date Joined</th>
              <th className="px-6 py-3">Staff Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="bg-white dark:bg-black border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4 font-medium text-black dark:text-white">{user.id}</td>
                <td className="px-6 py-4 text-gray-900 dark:text-gray-200">{user.username}</td>
                <td className="px-6 py-4 text-gray-900 dark:text-gray-200">{user.email || 'N/A'}</td>
                <td className="px-6 py-4 text-gray-900 dark:text-gray-200">{new Date(user.date_joined).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  {user.is_staff ? (
                    <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">Admin</span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">User</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;