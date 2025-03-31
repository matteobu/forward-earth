import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { Routes, Route } from 'react-router-dom';
import ConsumptionForm from './consumption/ConsumptionForm';
import ConsumptionList from './consumption/consumption-list/ConsumptionList';
import Sidebar from './Sidebar';

export default function Dashboard() {
  const { logout } = useAuth();
  const { userContext } = useUser();

  return (
    <div className="flex h-screen w-screen">
      <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col">
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-gray-800 text-white p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Welcome {userContext.name}</h2>
          <button
            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded text-white"
            onClick={logout}
          >
            LOGOUT
          </button>
        </header>

        <main className="flex-1 p-6 bg-gray-100 overflow-auto">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="consumptions/list" element={<ConsumptionList />} />
            <Route path="consumptions/new" element={<ConsumptionForm />} />
            <Route path="consumptions/:id/edit" element={<ConsumptionForm />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// Componente semplice per la home della dashboard
function DashboardHome() {
  return (
    <div>
      <h3 className="text-2xl font-semibold">Dashboard</h3>
      <p className="mt-4 text-lg">
        Benvenuto nella tua dashboard. Usa il menu laterale per navigare.
      </p>
    </div>
  );
}
