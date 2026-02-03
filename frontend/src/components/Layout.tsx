import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { LayoutDashboard, Users, UserCog, Menu, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';
import Sidebar from './ui/sidebar';

export default function Layout() {
  const { user} = useAuthStore();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMinified, setIsMinified] = useState(false);

  const menus = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['ALL'] },
    { label: 'Data Anggota', path: '/members', icon: Users, roles: ['ALL'] },
    { label: 'Daftar Anggota', path: '/register', icon: UserPlus, roles: ['ALL'] },
    { label: 'User Management', path: '/users', icon: UserCog, roles: ['ADMIN_PUSAT'] },
  ];

  const filteredMenus = menus.filter(m => m.roles.includes('ALL') || m.roles.includes(user?.role));

  return (
    <div className="min-h-screen bg-[#f9f9f9] flex font-sans text-slate-600">
      <Sidebar 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        isMinified={isMinified}
        setIsMinified={setIsMinified}
      />



      <div className={clsx(
        "flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ease-in-out",
        isMinified ? "lg:ml-20" : "lg:ml-64"
      )}>
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="lg:hidden p-2 text-gray-500">
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 capitalize">
              {location.pathname.replace('/', '').replace('-', ' ') || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-800">{user?.username}</p>
                <p className="text-xs text-gray-500">{user?.role?.replace('_', ' ')}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                {user?.username?.substring(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}