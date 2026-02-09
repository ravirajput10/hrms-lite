import { Bell, Search } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Input } from '../ui/input';

export function Header() {
    return (
        <header className="h-16 border-b bg-white/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-10">
            {/* Search */}
            <div className="flex items-center gap-4 flex-1 max-w-md">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
                    />
                </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors">
                    <Bell className="h-5 w-5 text-slate-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User */}
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
                            A
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block">
                        <p className="text-sm font-medium text-slate-900">Admin</p>
                        <p className="text-xs text-slate-500">Administrator</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
