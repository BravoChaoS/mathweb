import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen relative p-8">
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;