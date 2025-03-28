import React, { useState } from 'react';
import { Input } from '@headlessui/react';

const UserForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const userData = { name, email };

    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert('User added successfully!');
      } else {
        alert('Failed to add user.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding user.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-4  bg-gray-800 rounded-md max-w-2xl mx-auto"
    >
      <div className="flex flex-col gap-2">
        <Input
          id="name"
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="p-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Input
          id="email"
          type="email"
          placeholder="email"
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
  );
};

export default UserForm;
