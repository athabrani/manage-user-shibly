import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth'; // Sesuaikan path store Anda
import { 
  LayoutDashboard, 
  Users, 
  UserCog,
  UserPlus, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Menu,
  X 
} from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  isMinified: boolean;
  setIsMinified: (minified: boolean) => void;
}

export default function Sidebar({ isMobileOpen, setIsMobileOpen, isMinified, setIsMinified }: SidebarProps) {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  // Definisi Menu (Sama seperti sebelumnya)
  const menus = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['ALL'] },
    { label: 'Data Anggota', path: '/members', icon: Users, roles: ['ALL'] },
    { label: 'Daftar Anggota', path: '/register', icon: UserPlus, roles: ['ALL'] },
    { label: 'User Management', path: '/users', icon: UserCog, roles: ['ADMIN_PUSAT'] },
  ];

  const filteredMenus = menus.filter(m => m.roles.includes('ALL') || m.roles.includes(user?.role));

  return (
    <>

      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          type="button" 
          onClick={() => setIsMobileOpen(true)}
          className="p-2 inline-flex justify-center items-center gap-x-2 bg-white border border-gray-200 text-gray-800 text-sm font-medium rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
        >
          <Menu size={20} />
          <span className="sr-only">Open Sidebar</span>
        </button>
      </div>

 
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-50 bg-gray-900/50 lg:hidden transition-opacity"
        />
      )}


      <aside 
        className={clsx(
          "fixed top-0 start-0 bottom-0 z-[60] bg-white border-e border-gray-200 transition-all duration-300 transform",
          isMinified ? "lg:w-20" : "lg:w-64",
          isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="relative flex flex-col h-full max-h-full">
          

          <header className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
            <div className={clsx("flex items-center gap-2 overflow-hidden whitespace-nowrap", isMinified && "lg:justify-center")}>
              <div className="flex-shrink-0 bg-blue-600 text-white p-1.5 rounded-lg">
                <span className="font-bold text-lg leading-none">OA</span>
              </div>
              <span className={clsx("text-xl font-bold tracking-wider text-gray-800 transition-opacity duration-300", isMinified ? "lg:hidden" : "block")}>
                ORG<span className="text-blue-500">APP</span>
              </span>
            </div>

            <div className="lg:hidden">
              <button 
                onClick={() => setIsMobileOpen(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>

            <div className="hidden lg:block absolute -right-3 top-6">
              <button 
                onClick={() => setIsMinified(!isMinified)}
                className="flex justify-center items-center size-6 bg-white border border-gray-200 text-gray-500 hover:text-blue-600 rounded-full shadow-sm focus:outline-none transition-colors"
              >
                {isMinified ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
              </button>
            </div>
          </header>

          <nav className="h-full overflow-y-auto p-3 flex flex-col justify-between custom-scrollbar">
            <ul className="space-y-1.5">
              {filteredMenus.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link 
                      to={item.path} 
                      title={isMinified ? item.label : ''} 
                      className={clsx(
                        "flex items-center gap-x-3.5 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap",
                        isActive 
                          ? "bg-blue-50 text-blue-600" 
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                        isMinified && "justify-center px-2"
                      )}
                    >
                      <item.icon size={20} className="flex-shrink-0" />
                      <span className={clsx("transition-opacity duration-300", isMinified ? "lg:hidden" : "block")}>
                        {item.label}
                      </span>
                      
    
                      {isActive && isMinified && (
                        <span className="absolute right-2 top-2 w-2 h-2 rounded-full bg-blue-600 lg:block hidden"></span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="pt-4 border-t border-gray-100 mt-auto">
              <button 
                onClick={logout} 
                title={isMinified ? "Sign Out" : ""}
                className={clsx(
                  "flex items-center gap-x-3.5 py-2.5 px-3 w-full rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors whitespace-nowrap",
                  isMinified && "justify-center px-2"
                )}
              >
                <LogOut size={20} className="flex-shrink-0" />
                <span className={clsx("transition-opacity duration-300", isMinified ? "lg:hidden" : "block")}>
                  Sign Out
                </span>
              </button>
            </div>

          </nav>
        </div>
      </aside>
    </>
  );
}