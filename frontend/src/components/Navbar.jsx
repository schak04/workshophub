import { Link, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';

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
        const common = [
            { to: '/workshops', label: 'Workshops' },
            { to: '/registrations', label: 'Registrations' },
            { to: '/materials', label: 'Materials' },
            { to: '/feedback', label: 'Feedback' },
            { to: '/certificates', label: 'Certificates' },
        ];
        if (user.role !== 'participant') {
            common.splice(2, 0, { to: '/attendance', label: 'Attendance' }); // after Registrations
        }
        return common;
    }, [user]);

    const isActive = (to) => {
        if (to === '/') return location.pathname === '/';
        return location.pathname === to || location.pathname.startsWith(to + '/');
    };

    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
    if (isAuthPage) {
        return (
            <div className='border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950'>
                <div className='mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
                    <Link to='/' className='text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100'>
                        WorkshopHub
                    </Link>
                    <button
                        type='button'
                        onClick={() => setDarkMode((v) => !v)}
                        className='rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors'
                    >
                        {darkMode ? 'Dark' : 'Light'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='flex'>
            <aside className='hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0'>
                <div className='flex h-full flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950'>
                    <div className='flex h-16 items-center px-6'>
                        <Link to='/' className='text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100'>
                            WorkshopHub
                        </Link>
                    </div>

                    <nav className='flex-1 px-3'>
                        <div className='space-y-1'>
                            {navItems.map((item) => (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    className={[
                                        'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                        isActive(item.to)
                                            ? 'bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900/60 dark:hover:text-slate-100',
                                    ].join(' ')}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </nav>

                    <div className='border-t border-slate-200 p-4 dark:border-slate-800'>
                        {user ? (
                            <div className='flex items-center justify-between gap-3'>
                                <div className='min-w-0'>
                                    <p className='truncate text-sm font-medium text-slate-900 dark:text-slate-100'>
                                        {user?.name || 'Account'}
                                    </p>
                                    <p className='truncate text-xs text-slate-500 dark:text-slate-400'>{user?.role}</p>
                                </div>
                                <button
                                    type='button'
                                    onClick={logout}
                                    className='rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors'
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className='flex gap-2'>
                                <Link to='/login' className='btn-secondary w-full text-center'>
                                    Login
                                </Link>
                                <Link to='/signup' className='btn-primary w-full text-center'>
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            <header className='flex w-full items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950 md:ml-64 sm:px-6 lg:px-8'>
                <div className='flex items-center gap-3'>
                    <Link to='/' className='md:hidden text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100'>
                        WorkshopHub
                    </Link>
                    <div className='hidden md:block'>
                        <p className='text-sm text-slate-500 dark:text-slate-400'>
                            {location.pathname === '/' ? 'Dashboard' : 'Workspace'}
                        </p>
                    </div>
                </div>

                <div className='flex items-center gap-2'>
                    <button
                        type='button'
                        onClick={() => setDarkMode((v) => !v)}
                        className='rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors'
                    >
                        {darkMode ? 'Dark' : 'Light'}
                    </button>
                </div>
            </header>
        </div>
    );
}