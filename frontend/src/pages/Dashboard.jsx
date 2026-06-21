import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
    CalendarDays,
    Users,
    Award,
    TrendingUp,
    Clock,
    MapPin
} from 'lucide-react';

function StatCard({ title, value, sub, icon }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{title}</p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{value}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{sub}</p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {icon}
                </div>
            </div>
        </div>
    );
}

function StatusPill({ status }) {
    const styles =
        status === 'Upcoming'
            ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
            : status === 'In Progress'
                ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-200'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200';

    return (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles}`}>
            {status}
        </span>
    );
}

export default function Dashboard() {
    const { user } = useAuth();
    const [recentWorkshops, setRecentWorkshops] = useState([]);
    const [statsData, setStatsData] = useState({ workshops: 0, participants: 0, certificates: 0, attendance: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/stats').then(res => setStatsData(res.data)).catch(() => {});
        api.get('/workshops')
            .then(res => {
                const sorted = res.data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
                const formatted = sorted.slice(0, 4).map(ws => {
                    let dateStr = '';
                    if (ws.startDate && ws.endDate) {
                        const start = new Date(ws.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                        const end = new Date(ws.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                        dateStr = start === end ? start : `${start} - ${end}`;
                    }

                    return {
                        title: ws.title,
                        instructor: ws.instructor?.name || 'N/A',
                        instructorId: ws.instructor?._id,
                        date: dateStr,
                        time: ws.time || '',
                        location: ws.venue || '',
                        status: (() => {
                            if (!ws.startDate || !ws.endDate) return 'Upcoming';
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const startDate = new Date(ws.startDate);
                            startDate.setHours(0, 0, 0, 0);
                            const endDate = new Date(ws.endDate);
                            endDate.setHours(23, 59, 59, 999);

                            if (endDate < today) return 'Completed';
                            if (today >= startDate && today <= endDate) return 'In Progress';
                            return 'Upcoming';
                        })(),
                        current: ws.current || 0,
                        total: ws.seats || 0
                    };
                });
                setRecentWorkshops(formatted);
                setLoading(false);
            })
            .catch(err => {
                setError("Failed to load recent workshops.");
                setLoading(false);
            });
    }, []);

    if (!user) return null;

    const stats = [
        { title: 'Total Workshops', value: statsData.workshops.toString(), sub: 'Overall total' },
        { title: 'Active Participants', value: statsData.participants.toString(), sub: 'Registered users' },
        { title: 'Certificates Issued', value: statsData.certificates.toString(), sub: 'Generated so far' },
        { title: 'Attendance Rate', value: `${statsData.attendance}%`, sub: 'Across all workshops' },
    ];

    const icons = [
        <CalendarDays key="a" className="h-5 w-5" />,
        <Users key="b" className="h-5 w-5" />,
        <Award key="c" className="h-5 w-5" />,
        <TrendingUp key="d" className="h-5 w-5" />,
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Dashboard</h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Welcome back{user?.name ? `, ${user.name}` : ''}! Here's what's happening with your workshops.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((s, idx) => (
                    <StatCard key={s.title} title={s.title} value={s.value} sub={s.sub} icon={icons[idx]} />
                ))}
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between px-5 py-4">
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Recent Workshops</h2>
                    <Link to="/workshops" className="text-sm font-medium text-teal-700 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300">
                        View all
                    </Link>
                </div>

                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                    {loading ? (
                        <div className="px-5 py-5 text-center text-sm text-slate-500 dark:text-slate-400">
                            Loading workshops...
                        </div>
                    ) : error ? (
                        <div className="px-5 py-5 text-center text-sm text-red-500 dark:text-red-400">
                            {error}
                        </div>
                    ) : recentWorkshops.length === 0 ? (
                        <div className="px-5 py-5 text-center text-sm text-slate-500 dark:text-slate-400">
                            No workshops found.
                        </div>
                    ) : (
                        recentWorkshops.map((w) => {
                            const pct = Math.round((w.current / w.total) * 100);
                            return (
                                <div key={w.title} className="px-5 py-5">
                                    <div className="flex items-start justify-between gap-6">
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{w.title}</p>
                                                <StatusPill status={w.status} />
                                            </div>

                                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                                {w.instructor}
                                                {w.instructorId === user?.id && (
                                                    <span className="ml-2 text-xs italic text-teal-600 dark:text-teal-400">(you)</span>
                                                )}
                                            </p>

                                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                                                <span className="inline-flex items-center gap-1">
                                                    <CalendarDays className="h-4 w-4" />
                                                    {w.date}
                                                </span>
                                                <span className="inline-flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    {w.time}
                                                </span>
                                                <span className="inline-flex items-center gap-1">
                                                    <MapPin className="h-4 w-4" />
                                                    {w.location}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="shrink-0 text-right">
                                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                                {w.current}/{w.total}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">participants</p>
                                            <div className="mt-2 h-1.5 w-28 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                                                <div className="h-full w-full origin-left scale-x-0 rounded-full bg-teal-500 dark:bg-teal-400" style={{ transform: `scaleX(${pct / 100})` }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}