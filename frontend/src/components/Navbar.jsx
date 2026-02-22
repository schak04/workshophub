import { Link, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Calendar,
    Users,
    FileText,
    MessageSquare,
    Award,
    ClipboardCheck,
    LogOut,
    Sun,
    Moon
} from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [darkMode, setDarkMode] = useState(() => {
        try {
            return document.documentElement.classList.contains('dark');
        } catch {
            return false;
        }
    });

    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
        try {
            localStorage.setItem('wh_theme', darkMode ? 'dark' : 'light');
        } catch { }
    }, [darkMode]);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('wh_theme');
            if (saved === 'dark') setDarkMode(true);
            if (saved === 'light') setDarkMode(false);
        } catch(err) {
            console.error(err.message);
        }
    }, []);

    const navItems = useMemo(() => {
        if (!user) return [];

        const items = [
            { to: '/', label: 'Dashboard', icon: LayoutDashboard },
            { to: '/workshops', label: 'Workshops', icon: Calendar },
            { to: '/registrations', label: 'Registrations', icon: Users },
            { to: '/materials', label: 'Materials', icon: FileText },
            { to: '/feedback', label: 'Feedback', icon: MessageSquare },
            { to: '/certificates', label: 'Certificates', icon: Award },
        ];

        if (user.role !== 'participant') {
            items.splice(3, 0, {
                to: '/attendance',
                label: 'Attendance',
                icon: ClipboardCheck
            });
        }
        return items;
    }, [user]);

    const isActive = (to) => {
        if (to === '/') return location.pathname === '/';
        return location.pathname === to || location.pathname.startsWith(to + '/');
    };

    const pageTitle = useMemo(() => {
        const current = navItems.find(item =>
            isActive(item.to)
        );
        return current?.label || 'Dashboard';
    }, [location.pathname, navItems]);

    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
    if (isAuthPage) {
        return null;
    }

    return (
        <div className='flex'>
            <aside className='hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0'>
                <div className='flex h-full flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950'>
                    <div className='flex h-16 items-center px-6'>
                        <Link
                            to='/'
                            className='text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100'
                        >
                            WorkshopHub
                        </Link>
                    </div>

                    <nav className='flex-1 px-3 space-y-1'>
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    className={[
                                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                        isActive(item.to)
                                            ? 'bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900/60 dark:hover:text-slate-100'
                                    ].join(' ')}
                                >
                                    <Icon className='h-4 w-4' />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className='border-t border-slate-200 p-4 dark:border-slate-800'>
                        <div className='flex items-center justify-between gap-3'>
                            <div className='min-w-0'>
                                <p className='truncate text-sm font-medium text-slate-900 dark:text-slate-100'>
                                    {user?.name}
                                </p>
                                <p className='truncate text-xs text-slate-500 dark:text-slate-400'>
                                    {user?.role}
                                </p>
                            </div>

                            <button
                                onClick={logout}
                                className='rounded-lg border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors'
                            >
                                <LogOut className='h-4 w-4' />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            <header className='flex w-full items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950 md:ml-64 sm:px-6 lg:px-8'>
                <h2 className='text-sm font-medium text-slate-600 dark:text-slate-300'>
                    {pageTitle}
                </h2>

                <button
                    onClick={() => setDarkMode(v => !v)}
                    className='rounded-lg border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors'
                >
                    {darkMode ? (
                        <Sun className='h-4 w-4' />
                    ) : (
                        <Moon className='h-4 w-4' />
                    )}
                </button>
            </header>
        </div>
    );
}