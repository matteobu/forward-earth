import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Building2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Database,
  FileText,
  ShoppingBag,
  SquarePlus,
  TableProperties,
  Users,
} from 'lucide-react';
import { NavItem, NavItemOrDivider, SidebarProps } from '@/utils/interfaces';

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {
      Consumption: true,
      'Product Footprint': true,
      Manage: true,
    }
  );

  const toggleGroup = (heading: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [heading]: !prev[heading],
    }));
  };

  let currentHeading = '';
  const NAV_ITEMS: NavItemOrDivider[] = [
    {
      divider: true,
      heading: 'Consumption',
    },
    {
      title: 'Insert Consumption',
      icon: <SquarePlus size={20} className="text-indigo-600" />,
      path: '/dashboard/consumptions/new',
    },
    {
      title: 'Consumptions List',
      icon: <TableProperties size={20} className="text-gray-500" />,
      path: '/dashboard/consumptions/list',
    },
    {
      title: 'Emission tracker',
      icon: <ClipboardCheck size={20} className="text-purple-600" />,
      path: '/emission-tracker',
    },
    {
      title: 'Data collection',
      icon: <Database size={20} className="text-gray-500" />,
      path: '/data-collection',
    },
    {
      divider: true,
      heading: 'Product Footprint',
    },
    {
      title: 'Product Catalogue',
      icon: <ShoppingBag size={20} className="text-gray-500" />,
      path: '/product-catalogue',
    },
    {
      title: 'PCF assessment',
      icon: <FileText size={20} className="text-gray-500" />,
      path: '/pcf-assessment',
    },
    {
      divider: true,
      heading: 'Manage',
    },
    {
      title: 'Company',
      icon: <Building2 size={20} className="text-gray-500" />,
      path: '/company',
    },
    {
      title: 'Users',
      icon: <Users size={20} className="text-gray-500" />,
      path: '/users',
    },
  ];

  return (
    <aside
      className={`bg-white h-auto w-full min-h-screen shadow-lg flex flex-col pt-6 ${className} rounded-2xl`}
    >
      {/* Logo and Brand */}
      <div className="px-6 mb-8 flex items-center justify-between">
        <div className="flex items-center">
          <img
            src="/fe_logo.svg"
            alt="Forward Earth Logo"
            className="h-7 w-auto"
          />
          <span className="ml-2 text-lg font-semibold text-gray-800">
            Forward Earth
          </span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item, index) => {
            if ('divider' in item && item.divider) {
              currentHeading = item.heading || '';
              return (
                <li key={`divider-${index}`} className="pt-4 mt-4">
                  {item.heading && (
                    <div className="flex items-center justify-between mb-1 px-3">
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {item.heading}
                      </h3>
                      <button
                        onClick={() =>
                          item.heading && toggleGroup(item.heading)
                        }
                        className="bg-white text-gray-400 hover:text-gray-600 p-1 rounded-lg focus:outline-none"
                      >
                        {expandedGroups[item.heading] ? (
                          <ChevronDown size={14} />
                        ) : (
                          <ChevronRight size={14} />
                        )}
                      </button>
                    </div>
                  )}
                </li>
              );
            }

            const navItem = item as NavItem;

            if (!expandedGroups[currentHeading]) {
              return null;
            }

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
