import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, ClipboardCheck, History,
  BarChart3, Settings, LogOut, Menu, X, Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AuthUser } from '@/types';
import logoSrc from '@/assets/logo.png';

interface SidebarProps {
  user: AuthUser;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
}

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/employees', icon: Users, label: 'Employees' },
  { to: '/attendance', icon: ClipboardCheck, label: 'Mark Attendance' },
  { to: '/history', icon: History, label: 'Attendance History' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar({ user, onLogout, isOpen, onClose, companyName }: SidebarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 h-full z-30 flex flex-col sidebar-bg transition-transform duration-200',
        'w-64',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0 lg:static lg:z-auto'
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="w-9 h-9 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center flex-shrink-0">
            <img src={logoSrc} alt="Logo" className="w-full h-full object-cover" onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><polyline points="9 16 11 18 15 14"></polyline></svg>';
            }} />
          </div>
          <div className="overflow-hidden">
            <p className="text-white font-semibold text-sm truncate">{companyName}</p>
            <p className="text-white/40 text-xs">Attendance System</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto text-white/50 hover:text-white lg:hidden transition-colors p-1"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150 text-sm font-medium',
                isActive
                  ? 'sidebar-active sidebar-text-active'
                  : 'sidebar-text sidebar-hover'
              )}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User profile + logout */}
        <div className="px-3 pb-4 border-t border-white/10 pt-4">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg mb-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user.name.split(' ').map(n => n[0]).join('').slice(0,2)}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-white text-sm font-medium truncate">{user.name}</p>
              <p className="text-white/40 text-xs">{user.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full sidebar-text sidebar-hover text-sm font-medium transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

export function SidebarToggle({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-lg hover:bg-muted transition-colors lg:hidden"
      aria-label="Toggle sidebar"
    >
      <Menu size={20} />
    </button>
  );
}
