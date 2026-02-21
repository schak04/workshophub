import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function EditWorkshop() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);

    if (user?.role !== 'admin') {
        return (
            <div className='rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'>
                Access denied
            </div>
        );
    }

    useEffect(() => {
        api.get(`/workshops/${id}`)
            .then(res => setForm(res.data.workshop))
            .catch(err => console.error(err));
    }, [id]);

    if (!form) return null;

    const handleChange = e =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const submit = async e => {
        e.preventDefault();
        await api.put(`/workshops/${id}`, form);
        navigate(`/workshops/${id}`);
    };

    const fields = [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'description', label: 'Description', type: 'text', textarea: true },
        { key: 'date', label: 'Date', type: 'date' },
        { key: 'time', label: 'Time', type: 'text' },
        { key: 'venue', label: 'Venue', type: 'text' },
        { key: 'seats', label: 'Seats', type: 'number' }
    ];

    return (
        <div className='max-w-2xl space-y-6'>
            <div className='flex items-start justify-between gap-4'>
                <div>
                    <Link
                        to={`/workshops/${id}`}
                        className='inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors'
                    >
                        <ArrowLeft className='h-4 w-4' />
                        Back
                    </Link>

                    <h1 className='mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100'>
                        Edit Workshop
                    </h1>
                    <p className='mt-1 text-sm text-slate-600 dark:text-slate-400'>
                        Update the workshop details below.
                    </p>
                </div>

                <button
                    type='submit'
                    form='edit-workshop'
                    className='rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 transition-colors'
                >
                    Update
                </button>
            </div>

            <div className='rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
                <form
                    id='edit-workshop'
                    onSubmit={submit}
                    className='grid gap-5 sm:grid-cols-2'
                >
                    {fields.map((f) => (
                        <div
                            key={f.key}
                            className={f.textarea ? 'sm:col-span-2' : ''}
                        >
                            <label className='block text-sm font-medium text-slate-700 dark:text-slate-200'>
                                {f.label}
                            </label>

                            {f.textarea ? (
                                <textarea
                                    name={f.key}
                                    value={form[f.key] || ''}
                                    onChange={handleChange}
                                    rows={4}
                                    className='mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-teal-400/25 dark:focus:border-teal-400'
                                />
                            ) : (
                                <input
                                    name={f.key}
                                    type={f.type}
                                    value={form[f.key] || ''}
                                    onChange={handleChange}
                                    className='mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-teal-400/25 dark:focus:border-teal-400'
                                />
                            )}
                        </div>
                    ))}
                </form>
            </div>
        </div>
    );
}