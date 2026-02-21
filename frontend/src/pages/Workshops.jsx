import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Workshops() {
    const [workshops, setWorkshops] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        api.get('/workshops')
            .then(res => setWorkshops(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100'>
                        Workshops
                    </h1>
                    <p className='mt-1 text-sm text-slate-600 dark:text-slate-400'>
                        Manage and explore all workshop sessions.
                    </p>
                </div>

                {user?.role === 'admin' && (
                    <Link
                        to='/workshops/create'
                        className='inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 transition-colors'
                    >
                        <Plus className='h-4 w-4' />
                        Create Workshop
                    </Link>
                )}
            </div>

            <div className='overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900'>
                <table className='min-w-full text-sm'>
                    <thead className='bg-slate-50 dark:bg-slate-950'>
                        <tr className='text-left text-slate-600 dark:text-slate-300'>
                            <th className='px-6 py-4 font-medium'>Title</th>
                            <th className='px-6 py-4 font-medium'>Venue</th>
                            <th className='px-6 py-4 font-medium'>Instructor</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-200 dark:divide-slate-800'>
                        {workshops.map((ws) => (
                            <tr
                                key={ws._id}
                                className='hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors'
                            >
                                <td className='px-6 py-4 font-medium text-slate-900 dark:text-slate-100'>
                                    <Link to={`/workshops/${ws._id}`} className='hover:underline'>
                                        {ws.title}
                                    </Link>
                                </td>
                                <td className='px-6 py-4 text-slate-600 dark:text-slate-400'>
                                    {ws.venue}
                                </td>
                                <td className='px-6 py-4 text-slate-600 dark:text-slate-400'>
                                    {ws.instructor?.name || 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {workshops.length === 0 && (
                    <div className='px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400'>
                        No workshops available.
                    </div>
                )}
            </div>
        </div>
    );
}