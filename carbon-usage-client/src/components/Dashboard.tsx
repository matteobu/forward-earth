import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import UserForm from './UserForm';

export default function Dashboard() {
  const handleButtonClick = () => {
    console.log('Home button clicked');
    // You can add more logic here, such as navigating to a different page, etc.
  };
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col">
        <nav className="flex flex-col gap-2 mt-3">
          <Button
            variant="default"
            className="text-left"
            onClick={handleButtonClick}
          >
            Home
          </Button>
          <Button variant="ghost" className="text-left">
            Users
          </Button>
          <Button variant="ghost" className="text-left">
            Settings
          </Button>
          <UserForm />
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-gray-800 text-white p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Welcome</h2>
          <Button variant="outline" className="text-white">
            <Menu className="w-6 h-6" />
          </Button>
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
