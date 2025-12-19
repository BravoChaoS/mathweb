import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      {/* Mobile Header / Hamburger */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 h-16 flex items-center justify-between transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">
            M
          </div>
          <span className="font-bold text-slate-800 tracking-tight">MathWeb</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg active:scale-95 transition-all"
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full md:ml-64 min-h-screen relative p-4 pt-20 md:p-8 md:pt-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;