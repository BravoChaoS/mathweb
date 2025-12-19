import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Home,
    Triangle,
    Circle,
    Trees,
    Shapes,
    Scale,
    FileQuestion,
    Calculator,
    ChevronRight,
    X
} from 'lucide-react';

const navItems = [
    { path: '/', label: '首页', icon: Home },
    { path: '/triangle-perimeter', label: '三角形周长与面积', icon: Triangle },
    { path: '/circle-area', label: '圆的面积', icon: Circle },
    { path: '/tree-planting', label: '植树问题', icon: Trees },
    { path: '/composite-area', label: '组合图形面积', icon: Shapes },
    { path: '/equation-solver', label: '解方程', icon: Scale },
    { path: '/word-problems', label: '列方程解决问题', icon: FileQuestion },
    { path: '/decimal-operations', label: '小数乘除法', icon: Calculator },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    return (
        <aside
            className={`
                fixed top-0 left-0 z-40 h-screen w-64 bg-white shadow-2xl border-r border-slate-100
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0
            `}
        >
            <div className="p-6 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
                        M
                    </div>
                    <div>
                        <h1 className="font-bold text-lg text-slate-800 tracking-tight leading-tight">MathWeb</h1>
                        <p className="text-xs text-slate-500 font-medium">六年级数学可视化</p>
                    </div>
                </div>
                {/* Close button for mobile */}
                <button
                    onClick={onClose}
                    className="md:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                            `group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 ease-in-out ${isActive
                                ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <div className="flex items-center gap-3.5">
                                    <item.icon
                                        size={20}
                                        className={`transition-colors duration-300 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                                            }`}
                                    />
                                    <span className="font-medium tracking-wide text-sm">{item.label}</span>
                                </div>
                                {isActive && (
                                    <ChevronRight size={16} className="text-indigo-400 animate-pulse" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100/50">
                    <p className="text-xs text-slate-400 text-center leading-relaxed">
                        © 2024 MathWeb<br />
                        Designed for Education
                    </p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
