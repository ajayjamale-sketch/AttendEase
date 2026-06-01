import { Bell, Moon, Sun, Search } from 'lucide-react';
import { SidebarToggle } from './Sidebar';
import { cn } from '@/lib/utils';
import { getTodayString, formatDate } from '@/lib/utils';

interface HeaderProps {
  title: string;
  darkMode: boolean;
  onToggleDark: () => void;
  onMenuClick: () => void;
}

export function Header({ title, darkMode, onToggleDark, onMenuClick }: HeaderProps) {
  const today = getTodayString();

  return (
    <header className="bg-card border-b border-border px-4 sm:px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
      <SidebarToggle onClick={onMenuClick} />

      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-semibold text-foreground truncate">{title}</h1>
        <p className="text-xs text-muted-foreground hidden sm:block">{formatDate(today)}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleDark}
          className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
        </button>
      </div>
    </header>
  );
}
