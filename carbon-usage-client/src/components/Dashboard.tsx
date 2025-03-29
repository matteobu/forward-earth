import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '../contexts/UserContext';

export default function Dashboard() {
  const { logout } = useAuth();
  const { name } = useUser();

  return (
    <div className="flex h-screen w-screen">
      <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col">
        <nav className="flex flex-col gap-2 mt-3">test</nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-gray-800 text-white p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Welcome {name}</h2>
          <button className="bg-red-400" onClick={logout}>
            LOGOUT
          </button>
        </header>

        <main className="flex-1 p-6 bg-gray-100">
          <h3 className="text-2xl font-semibold">Your Content</h3>
          <p className="mt-4 text-lg"></p>
        </main>
      </div>
    </div>
  );
}
