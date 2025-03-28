import { useState } from 'react';
import UserForm from './ui/userForm';

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUsername] = useState('');
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col">
        <nav className="flex flex-col gap-2 mt-3">test</nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-gray-800 text-white p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Welcome {isAuthenticated ? userName : ''}
            {/* TO ADD A USE CONTEXT TO SHARE THE USER NAME */}
          </h2>
          <div className="ml-auto">
            <UserForm
              setIsAuthenticated={setIsAuthenticated}
              setUsername={setUsername}
              isAuthenticated={isAuthenticated}
            />
          </div>
        </header>

        <main className="flex-1 p-6 bg-gray-100">
          <h3 className="text-2xl font-semibold">Your Content</h3>
          <p className="mt-4 text-lg">
            Here is where your dynamic content will be displayed!
          </p>
        </main>
      </div>
    </div>
  );
}
