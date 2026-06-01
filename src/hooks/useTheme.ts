import { useState, useEffect, useCallback } from 'react';
import { getSettings, saveSettings } from '@/utils/localStorage';

export function useTheme() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const settings = getSettings();
    return settings.darkMode;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      const next = !prev;
      const settings = getSettings();
      saveSettings({ ...settings, darkMode: next });
      return next;
    });
  }, []);

  return { darkMode, toggleDarkMode };
}
