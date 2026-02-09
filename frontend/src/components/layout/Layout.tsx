import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function Layout() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
            <div className="flex-1 flex flex-col h-full overflow-hidden transition-all duration-300">
                <Header />
                <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
