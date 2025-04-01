/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Building2,
  FileText,
  LayoutDashboard,
  ShoppingBag,
  SquarePlus,
  TableProperties,
  Users,
} from 'lucide-react';
import {
  NavItem,
  NavItemOrDivider,
  SidebarProps,
} from '@/interfaces/interfaces';

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside
      className={`h-full  bg-gray-50 overflow-y-auto shadow-lg flex flex-col pt-6 ${className} rounded-2xl`}
    >
      {/* Logo and Brand */}
      <div className="px-6 mb-8 flex items-center justify-center">
        <div className="flex items-center">
          <img
            src="/fe_logo.svg"
            alt="Forward Earth Logo"
            className="h-7 w-60 object-contain"
          />
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item, index) => {
            if ('divider' in item && item.divider) {
              return (
                <li key={`divider-${index}`} className="pt-4 mt-4">
                  {item.heading && (
                    <div className="flex items-center justify-between mb-1 px-3">
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {item.heading}
                      </h3>
                    </div>
                  )}
                </li>
              );
            }

            const navItem = item as NavItem;

            return (
              <li key={`nav-${index}`}>
                <a
                  href={navItem.path || '#'}
                  onClick={(e) => {
                    e.preventDefault();
                    if (navItem.path) navigate(navItem.path);
                  }}
                  className={`flex items-center px-3 py-2 text-sm rounded-md group cursor-pointer ${
                    location.pathname === navItem.path
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{navItem.icon}</span>
                  <span>{navItem.title}</span>
                  {navItem.path === '/emission-tracker' && (
                    <span className="ml-auto bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-md">
                      New
                    </span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

export const NAV_ITEMS: NavItemOrDivider[] = [
  {
    divider: true,
    heading: 'Dashboard',
  },
  {
    title: 'Dashboard',
    icon: <LayoutDashboard size={20} className="text-gray-600" />,
    path: '/dashboard',
  },
  {
    divider: true,
    heading: 'Company Footprint',
  },
  {
    title: 'Insert Consumption',
    icon: <SquarePlus size={20} className="text-gray-600" />,
    path: '/dashboard/consumptions/new',
  },
  {
    title: 'Consumptions List',
    icon: <TableProperties size={20} className="text-gray-500" />,
    path: '/dashboard/consumptions/list',
  },
  {
    divider: true,
    heading: 'Product Footprint',
  },
  {
    title: 'Products Catalogue',
    icon: <ShoppingBag size={20} className="text-gray-500" />,
    path: '/dashboard/products-catalogue',
  },
  {
    title: 'PCF assessment',
    icon: <FileText size={20} className="text-red-500" />,
    path: '/pcf-assessment',
  },
  {
    divider: true,
    heading: 'Manage',
  },
  {
    title: 'Company Dashboard',
    icon: <Building2 size={20} className="text-gray-500" />,
    path: '/dashboard/company-dashboard',
  },
  {
    title: 'Users',
    icon: <Users size={20} className="text-red-500" />,
    path: '/users',
  },
];
