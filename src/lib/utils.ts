import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function getDepartmentColor(dept: string): string {
  const colors: Record<string, string> = {
    IT: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    HR: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    Finance: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    Marketing: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    Sales: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    Operations: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    Engineering: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    Design: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  };
  return colors[dept] || 'bg-gray-100 text-gray-700';
}
