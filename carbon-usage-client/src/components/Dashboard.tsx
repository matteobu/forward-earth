import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { Routes, Route } from 'react-router-dom';
import ConsumptionForm from './consumption/ConsumptionForm';
import ConsumptionList from './consumption/consumption-list/ConsumptionList';
import Sidebar from './Sidebar';
import { ActivityTypeProvider } from '@/contexts/ActivityTypeContext';
import { LogOut } from 'lucide-react';
import MainPage from './main-page/MainPage';
import ConsumptionDataCollection from './consumption/ConsumptionDataCollection';
import ProductsCatalogue from './products-catalogue/ProductsCatalogue';
import CompanyDashboard from './company/CompanyDashboard';
import ProductionTable from './production/ProductionList';

export default function Dashboard() {
  const { logout } = useAuth();
  const { userContext } = useUser();

  return (
    <div className="flex h-screen w-screen bg-indigo-50">
      <aside className="w-64  text-white p-4 flex flex-col">
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-gray-50 text-white p-4 flex items-center justify-between rounded-2xl mt-4 mb-1 mr-4">
          <h2 className="text-lg text-gray-700 font-semibold">
            Welcome {userContext.name}
          </h2>
          <button
            className="p-1 bg-red-500 hover:bg-red-600 rounded text-white"
            onClick={logout}
          >
            <LogOut size={16} />
          </button>
        </header>

        <main className="flex-1 p-6 bg-gray-50 overflow-auto rounded-2xl mb-4 mr-4">
          <ActivityTypeProvider>
            <Routes>
              <Route index element={<MainPage />} />
              <Route path="consumptions/list" element={<ConsumptionList />} />
              <Route path="consumptions/new" element={<ConsumptionForm />} />
              <Route
                path="consumptions/data-collection"
                element={<ConsumptionDataCollection />}
              />
              <Route
                path="consumptions/:id/edit"
                element={<ConsumptionForm />}
              />
              <Route
                path="products-catalogue"
                element={<ProductsCatalogue />}
              />
              <Route path="production/list" element={<ProductionTable />} />
              <Route path="company-dashboard" element={<CompanyDashboard />} />
            </Routes>
          </ActivityTypeProvider>
        </main>
      </div>
    </div>
  );
}
