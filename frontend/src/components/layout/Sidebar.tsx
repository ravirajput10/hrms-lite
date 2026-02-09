import { Link, useLocation } from 'react-router-dom';
import { Users, CalendarCheck, LayoutDashboard } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/employees', label: 'Employees', icon: Users },
    { to: '/attendance', label: 'Attendance', icon: CalendarCheck },
];

export function Sidebar() {
    const location = useLocation();

    return (
        <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-slate-700">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    HRMS Lite
                </h1>
                <p className="text-xs text-slate-400 mt-1">Human Resource Management</p>
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
                                    className={cn(
                                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                                        isActive
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                    )}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-700">
                <p className="text-xs text-slate-500 text-center">
                    © 2024 HRMS Lite
                </p>
            </div>
        </aside>
    );
}
