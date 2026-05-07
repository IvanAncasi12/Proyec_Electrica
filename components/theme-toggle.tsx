'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);
 
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const system = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    const initial = saved || system;
    
    setTheme(initial);
    document.documentElement.classList.toggle('light', initial === 'light');
  }, []);
 
  useEffect(() => {
    if (!mounted) return;
    
    document.documentElement.classList.toggle('light', theme === 'light');
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) return null; 

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl border transition-all duration-300 hover:scale-110 hover:shadow-lg"
      style={{
        borderColor: 'var(--color-primario)',
        backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
        color: theme === 'dark' ? '#fbbf24' : '#f59e0b'
      }}
      aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
      title={theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 transition-transform hover:rotate-12" />
      ) : (
        <Moon className="w-5 h-5 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}