import { Avatar, AvatarFallback } from '../ui/avatar';

export function Header() {
    return (
        <header className="h-16 border-b bg-white/80 backdrop-blur-sm flex items-center justify-end px-6 sticky top-0 z-10">

            {/* Right section */}
            <div className="flex items-center gap-4">
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
