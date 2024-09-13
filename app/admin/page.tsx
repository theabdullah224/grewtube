"use client"
import React, { useEffect, useState } from 'react';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all users from the database
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/getUsers'); // Implement this API
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#181A1B] text-white">
      {/* Sidebar */}
      <aside className="bg-[#232527] text-white w-64 p-6 flex flex-col">
        {/* Logo */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-center text-[#F8EF6D]">LOGO</h1>
        </div>
        {/* Sidebar Links */}
        <nav>
          <ul>
            <li className="mb-6">
              <a href="#" className="text-white text-lg font-semibold hover:text-[#F8EF6D] transition duration-200">
                Users
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Dashboard Header */}
        <div className="mb-6">
          <h2 className="text-4xl font-bold text-[#F8EF6D]">Dashboard</h2>
        </div>

        {/* User Count Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#2B2D32] p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold text-gray-400">Total Users</h3>
            <p className="text-5xl mt-4 font-bold text-[#F8EF6D]">{users.length}</p>
          </div>
        </div>

        {/* User List */}
        <div className="bg-[#2B2D32] p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-gray-200 mb-4">User List</h3>
          {loading ? (
            <p>Loading users...</p>
          ) : (
            <ul className="space-y-4">
              {users.map((user) => (
                <li key={user._id} className="bg-gray-800 p-4 rounded-md shadow-sm">
                  <p className="text-lg">{user.username || user.email}</p> {/* Show username or email */}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
