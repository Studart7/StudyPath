import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar.tsx';
import { Menu, X, Sun, Moon } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function Layout({ children, title, subtitle, actions }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('studypath_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('studypath_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <div className="min-h-screen bg-bg text-text flex font-sans overflow-x-hidden transition-colors duration-200">
      
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Drawer Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-black/40 backdrop-blur-sm">
          <div className="relative animate-in slide-in-from-left duration-200">
            <Sidebar />
            <button 
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-[-44px] bg-surface text-text p-2 border border-border rounded-lg shadow-sm"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex-1" onClick={() => setSidebarOpen(false)}></div>
        </div>
      )}

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* Top Header */}
        <header className="h-16 border-b border-border bg-surface/80 flex items-center justify-between px-6 shrink-0 sticky top-0 z-20 shadow-sm/5 backdrop-blur transition-colors duration-200">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 hover:bg-elevated rounded-lg md:hidden text-muted"
            >
              <Menu size={24} />
            </button>
            
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-text leading-none">{title}</span>
              {subtitle && <span className="text-xs text-muted mt-1.5 font-medium leading-none">{subtitle}</span>}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {actions}
            <button 
              onClick={toggleTheme}
              className="p-2 border border-border text-muted hover:text-text hover:bg-elevated rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </header>

        {/* Content body */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
}
