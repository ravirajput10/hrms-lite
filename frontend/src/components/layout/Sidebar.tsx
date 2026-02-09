import { Link, useLocation } from 'react-router-dom';
import { Users, CalendarCheck, LayoutDashboard, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/employees', label: 'Employees', icon: Users },
    { to: '/attendance', label: 'Attendance', icon: CalendarCheck },
];

export function Sidebar({ isCollapsed, onToggle }: { isCollapsed: boolean; onToggle: () => void }) {
    const location = useLocation();

    return (
        <aside
            className={cn(
                "h-screen bg-slate-900 text-white flex flex-col transition-all duration-300 ease-in-out relative z-40 shadow-2xl",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            {/* Toggle Button */}
            <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="absolute -right-4 top-10 h-8 w-8 rounded-full bg-blue-600 text-white hover:bg-blue-700 hover:text-white border-2 border-slate-50 shadow-lg z-50 flex items-center justify-center transition-transform duration-300"
            >
                {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </Button>

            {/* Logo */}
            <div className={cn(
                "p-6 border-b border-slate-800/50 flex flex-col transition-all duration-300",
                isCollapsed ? "items-center px-2" : "items-start"
            )}>
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 min-w-[40px] rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg transform rotate-3">
                        <span className="text-xl font-black text-white italic">H</span>
                    </div>
                    {!isCollapsed && (
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent truncate">
                            HRMS Lite
                        </h1>
                    )}
                </div>
                {!isCollapsed && <p className="text-[10px] text-slate-500 mt-2 font-semibold uppercase tracking-widest pl-1">Human Resource</p>}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.to;
                        const Icon = item.icon;
                        return (
                            <li key={item.to}>
                                <Link
                                    to={item.to}
                                    title={isCollapsed ? item.label : undefined}
                                    className={cn(
                                        'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative',
                                        isActive
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20'
                                            : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                                    )}
                                >
                                    <Icon className={cn(
                                        "w-5 h-5 transition-transform duration-300",
                                        isActive ? "scale-110" : "group-hover:scale-110"
                                    )} />
                                    {!isCollapsed && <span className="font-medium whitespace-nowrap">{item.label}</span>}

                                    {isCollapsed && (
                                        <div className="absolute left-full ml-4 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-xl border border-slate-700">
                                            {item.label}
                                        </div>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            {!isCollapsed && (
                <div className="p-6 border-t border-slate-800/50">
                    <p className="text-[10px] text-slate-600 text-center font-medium uppercase tracking-tighter">
                        © 2024 Ethara.ai • HRMS Lite
                    </p>
                </div>
            )}
        </aside>
    );
}
