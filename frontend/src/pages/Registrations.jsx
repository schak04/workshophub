import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { XCircle } from 'lucide-react';

function StatusPill({ status }) {
    const s = (status || '').toLowerCase();

    const cls =
        s === 'registered'
            ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-200'
            : s === 'cancelled' || s === 'canceled'
                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200';

    return (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
            {status}
        </span>
    );
}

export default function Registrations() {
    const { user } = useAuth();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const res = await api.get('/registrations');
                setRegistrations(res.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load registrations');
            } finally {
                setLoading(false);
            }
        };

        fetchRegistrations();
    }, []);

    const handleUnregister = async (registrationId) => {
        try {
            setError('');
            await api.put(`/registrations/${registrationId}/unregister`);
            setRegistrations(registrations.map(reg =>
                reg._id === registrationId ? { ...reg, status: 'cancelled' } : reg
            ));
        } catch (err) {
            console.error(err);
            setError('Failed to unregister');
        }
    };

    if (loading) {
        return (
            <div className='space-y-6'>
                <div>
                    <div className='h-8 w-56 rounded bg-slate-200/70 dark:bg-slate-800/70' />
                    <div className='mt-2 h-4 w-80 rounded bg-slate-200/70 dark:bg-slate-800/70' />
                </div>
                <div className='rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
                    <div className='h-4 w-full rounded bg-slate-200/70 dark:bg-slate-800/70' />
                    <div className='mt-3 h-4 w-2/3 rounded bg-slate-200/70 dark:bg-slate-800/70' />
                    <div className='mt-3 h-4 w-1/2 rounded bg-slate-200/70 dark:bg-slate-800/70' />
                </div>
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            <div>
                <h1 className='text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100'>
                    {user.role === 'participant' ? "My Registrations" : "Workshop Registrations"}
                </h1>
                <p className='mt-1 text-sm text-slate-600 dark:text-slate-400'>
                    {user.role === 'participant'
                        ? "Track your workshop sign-ups and manage your registrations."
                        : "View and manage all workshop registrations."}
                </p>
            </div>

            {error && (
                <div className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200'>
                    {error}
                </div>
            )}

            {registrations.length === 0 ? (
                <div className='rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'>
                    No registrations found.
                </div>
            ) : (
                <div className='overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900'>
                    <table className='min-w-full text-sm'>
                        <thead className='bg-slate-50 dark:bg-slate-950'>
                            <tr className='text-left text-slate-600 dark:text-slate-300'>
                                <th className='px-6 py-4 font-medium'>Workshop</th>
                                <th className='px-6 py-4 font-medium'>Participant</th>
                                <th className='px-6 py-4 font-medium'>Status</th>
                                <th className='px-6 py-4 font-medium'>Registered</th>
                                {user.role === 'participant' && (
                                    <th className='px-6 py-4 font-medium text-right'>Action</th>
                                )}
                            </tr>
                        </thead>

                        <tbody className='divide-y divide-slate-200 dark:divide-slate-800'>
                            {registrations.map((reg) => (
                                <tr
                                    key={reg._id}
                                    className='hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors'
                                >
                                    <td className='px-6 py-4 font-medium text-slate-900 dark:text-slate-100'>
                                        {reg.workshop?.title || '-'}
                                    </td>

                                    <td className='px-6 py-4 text-slate-600 dark:text-slate-400'>
                                        {reg.user?.name ? (
                                            <div className='min-w-0'>
                                                <p className='truncate'>{reg.user.name}</p>
                                                <p className='truncate text-xs text-slate-500 dark:text-slate-500'>
                                                    {reg.user.email}
                                                </p>
                                            </div>
                                        ) : (
                                            '-'
                                        )}
                                    </td>

                                    <td className='px-6 py-4'>
                                        <StatusPill status={reg.status} />
                                    </td>

                                    <td className='px-6 py-4 text-slate-600 dark:text-slate-400'>
                                        {reg.createdAt ? new Date(reg.createdAt).toLocaleDateString() : '-'}
                                    </td>

                                    {user.role === 'participant' && (
                                        <td className='px-6 py-4 text-right'>
                                            {reg.status === 'registered' ? (
                                                <button
                                                    onClick={() => handleUnregister(reg._id)}
                                                    className='inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors'
                                                >
                                                    <XCircle className='h-4 w-4' />
                                                    Unregister
                                                </button>
                                            ) : (
                                                <span className='text-sm text-slate-400 dark:text-slate-500'>-</span>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}