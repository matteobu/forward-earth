import React, { useState } from 'react';
import { Input } from '@headlessui/react';

const UserForm = ({
  setIsAuthenticated,
  setUsername,
  isAuthenticated,
}: {
  setIsAuthenticated: (value: boolean) => void;
  setUsername: (value: string) => void;
  isAuthenticated: boolean;
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const userData = {
      name,
      email,
    };

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const responseData = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        setUsername(responseData.user.name);

        if (responseData.message === 'User already exists') {
          alert('User authenticated successfully!');
        } else {
          alert('User added successfully!');
        }
      } else {
        alert('Failed to add user.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding user.');
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/users/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setIsAuthenticated(false);
        alert('Logged out successfully');
      } else {
        alert('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Error during logout');
    }
  };

  return (
    <div>
      {!isAuthenticated && (
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-4 bg-gray-800 rounded-md max-w-2xl mx-auto p-4"
        >
          <div className="flex flex-col gap-2 w-full">
            <Input
              id="name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="p-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </form>
      )}

      {isAuthenticated && (
        <div className="mt-4 text-center">
          <button
            onClick={handleLogout}
            className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserForm;
