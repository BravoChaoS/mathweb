import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col text-slate-800">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:scale-105 transition-transform">
              M
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">MathWeb <span className="text-slate-400 font-normal text-sm ml-1">六年级几何</span></span>
          </Link>
          {!isHome && (
            <Link to="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 px-3 py-1 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors">
              返回目录
            </Link>
          )}
        </div>
      </header>

      <main className="flex-grow w-full max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 py-6 mt-8">
        <div className="max-w-5xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2024 MathWeb Open Source Project. Designed for Education.</p>
          <p className="mt-1">基于人教版小学六年级数学教材</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;