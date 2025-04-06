import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { Routes, Route } from 'react-router-dom';
import ConsumptionForm from './consumption/ConsumptionForm';
import ConsumptionList from './consumption/consumption-list/ConsumptionList';
import Sidebar from './Sidebar';
import { ActivityTypeProvider } from '@/contexts/ActivityTypeContext';
import { LogOut } from 'lucide-react';
import MainPage from './main-page/MainPage';
import ProductsCatalogue from './products-catalogue/ProductsCatalogue';
import CompanyDashboard from './company/CompanyDashboard';
import ProductionTable from './production/ProductionList';
import { URL_ENDPOINTS } from '@/utils/endpoints';

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
              <Route
                path={URL_ENDPOINTS.CONSUMPTION_LIST}
                element={<ConsumptionList />}
              />
              <Route
                path={URL_ENDPOINTS.CONSUMPTION_NEW}
                element={<ConsumptionForm />}
              />
              <Route
                path={URL_ENDPOINTS.PRODUCTS_CATALOGUE}
                element={<ProductsCatalogue />}
              />
              <Route
                path={URL_ENDPOINTS.PRODUCTION_LIST}
                element={<ProductionTable />}
              />
              <Route    path={URL_ENDPOINTS.COMPANY_DASHBOARD} element={<CompanyDashboard />} />
            </Routes>
          </ActivityTypeProvider>
        </main>
      </div>
    </div>
  );
}
