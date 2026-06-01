import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { AuthUser } from '@/types';
import { getSettings } from '@/utils/localStorage';

interface LayoutProps {
  user: AuthUser;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDark: () => void;
}

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/employees': 'Employee Management',
  '/attendance': 'Mark Attendance',
  '/history': 'Attendance History',
  '/reports': 'Reports & Analytics',
  '/settings': 'Settings',
};

export function Layout({ user, onLogout, darkMode, onToggleDark }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const settings = getSettings();
  const title = PAGE_TITLES[location.pathname] || 'AttendEase';

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        user={user}
        onLogout={onLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        companyName={settings.companyName}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          title={title}
          darkMode={darkMode}
          onToggleDark={onToggleDark}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
