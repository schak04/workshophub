import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function CreateWorkshop() {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (user?.role !== 'admin') {
        return (
            <div className='rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'>
                Access denied
            </div>
        );
    }

    const [form, setForm] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        venue: '',
        seats: '',
        instructor: ''
    });

    const handleChange = e =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const submit = async e => {
        e.preventDefault();
        await api.post('/workshops', form);
        navigate('/workshops');
    };

    const fields = [
        { key: 'title', label: 'Title', placeholder: "Workshop title", type: 'text' },
        { key: 'description', label: 'Description', placeholder: "Short description for the workshop", type: 'text' },
        { key: 'date', label: 'Date', placeholder: "", type: 'date' },
        { key: 'time', label: 'Time', placeholder: "e.g. 2:00 PM - 5:00 PM", type: 'text' },
        { key: 'venue', label: 'Venue', placeholder: "e.g. Room A-301 / Virtual", type: 'text' },
        { key: 'seats', label: 'Seats', placeholder: "e.g. 30", type: 'number' },
        { key: 'instructor', label: 'Instructor', placeholder: "Instructor ID", type: 'text' },
    ];

    return (
        <div className='max-w-2xl space-y-6'>
            <div className='flex items-start justify-between gap-4'>
                <div>
                    <div className='flex items-center gap-2'>
                        <Link
                            to='/workshops'
                            className='inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors'
                        >
                            <ArrowLeft className='h-4 w-4' />
                            Back
                        </Link>
                    </div>
                    <h1 className='mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100'>
                        Create Workshop
                    </h1>
                    <p className='mt-1 text-sm text-slate-600 dark:text-slate-400'>
                        Fill in the details below to create a new workshop.
                    </p>
                </div>

                <button
                    type='submit'
                    form='create-workshop'
                    className='rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 transition-colors'
                >
                    Create
                </button>
            </div>

            <div className='rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
                <form id='create-workshop' onSubmit={submit} className='grid gap-5 sm:grid-cols-2'>
                    {fields.map((f) => (
                        <div key={f.key} className={f.key === 'description' ? 'sm:col-span-2' : ''}>
                            <label className='block text-sm font-medium text-slate-700 dark:text-slate-200'>
                                {f.label}
                            </label>
                            {f.key === 'description' ? (
                                <textarea
                                    name={f.key}
                                    placeholder={f.placeholder}
                                    value={form[f.key]}
                                    onChange={handleChange}
                                    rows={4}
                                    className='mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-teal-400/25 dark:focus:border-teal-400'
                                />
                            ) : (
                                <input
                                    name={f.key}
                                    placeholder={f.placeholder}
                                    value={form[f.key]}
                                    onChange={handleChange}
                                    type={f.type}
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