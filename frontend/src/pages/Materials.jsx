import {useEffect, useState} from 'react';
import api from '../api/axios';
import {useAuth} from '../context/AuthContext';
import {Plus, FileText, ExternalLink} from 'lucide-react';

export default function Materials() {
    const {user} = useAuth();

    const [materials, setMaterials] = useState([]);
    const [workshops, setWorkshops] = useState([]);

    const [workshop, setWorkshop] = useState('');
    const [title, setTitle] = useState('');
    const [fileUrl, setFileUrl] = useState('');

    useEffect(() => {
        api.get('/workshops')
            .then(res => setWorkshops(res.data))
            .catch(err => console.error(err));
    }, []);

    const loadMaterials = async (workshopId = '') => {
        try {
            const res = await api.get(
                workshopId ? `/materials?workshop=${workshopId}` : '/materials'
            );
            setMaterials(res.data);
        }
        catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadMaterials();
    }, []);

    const addMaterial = async (e) => {
        e.preventDefault();
        try {
            await api.post('/materials', {
                workshop,
                title,
                file_url: fileUrl
            });

            setTitle('');
            setFileUrl('');
            setWorkshop('');

            loadMaterials();
        }
        catch (err) {
            console.error(err);
            alert("Error adding material");
        }
    };

    return (
        <div className='space-y-8'>
            <div>
                <h1 className='text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100'>
                    Workshop Materials
                </h1>
                <p className='mt-1 text-sm text-slate-600 dark:text-slate-400'>
                    Upload and access workshop learning resources.
                </p>
            </div>

            {(user?.role === 'admin' || user?.role === 'instructor') && (
                <div className='rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
                    <div className='flex items-center gap-2 mb-6'>
                        <Plus className='h-5 w-5 text-slate-500 dark:text-slate-400' />
                        <h2 className='text-sm font-semibold text-slate-900 dark:text-slate-100'>
                            Add Material
                        </h2>
                    </div>

                    <form onSubmit={addMaterial} className='grid gap-5 sm:grid-cols-2 max-w-3xl'>
                        <div className='sm:col-span-2'>
                            <label className='block text-sm font-medium text-slate-700 dark:text-slate-200'>
                                Workshop
                            </label>
                            <select
                                className='mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500'
                                value={workshop}
                                onChange={e => setWorkshop(e.target.value)}
                                required
                            >
                                <option value=''>Select Workshop</option>
                                {workshops.map(w => (
                                    <option key={w._id} value={w._id}>
                                        {w.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-slate-700 dark:text-slate-200'>
                                Title
                            </label>
                            <input
                                type='text'
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className='mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500'
                                required
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-slate-700 dark:text-slate-200'>
                                File URL
                            </label>
                            <input
                                type='text'
                                value={fileUrl}
                                onChange={e => setFileUrl(e.target.value)}
                                className='mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500'
                                required
                            />
                        </div>

                        <div className='sm:col-span-2'>
                            <button className='inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 transition-colors'>
                                <Plus className='h-4 w-4' />
                                Add Material
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className='max-w-md'>
                <label className='block text-sm font-medium text-slate-700 dark:text-slate-200'>
                    Filter by Workshop
                </label>
                <select
                    className='mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500'
                    onChange={e => loadMaterials(e.target.value)}
                >
                    <option value=''>All Workshops</option>
                    {workshops.map(w => (
                        <option key={w._id} value={w._id}>
                            {w.title}
                        </option>
                    ))}
                </select>
            </div>

            <div className='overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900'>
                <table className='min-w-full text-sm'>
                    <thead className='bg-slate-50 dark:bg-slate-950'>
                        <tr className='text-left text-slate-600 dark:text-slate-300'>
                            <th className='px-6 py-4 font-medium'>Title</th>
                            <th className='px-6 py-4 font-medium'>Workshop</th>
                            <th className='px-6 py-4 font-medium'>Uploaded By</th>
                            <th className='px-6 py-4 font-medium text-right'>Action</th>
                        </tr>
                    </thead>

                    <tbody className='divide-y divide-slate-200 dark:divide-slate-800'>
                        {materials.map(m => (
                            <tr
                                key={m._id}
                                className='hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors'
                            >
                                <td className='px-6 py-4 font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2'>
                                    <FileText className='h-4 w-4 text-slate-400' />
                                    {m.title || "Material"}
                                </td>

                                <td className='px-6 py-4 text-slate-600 dark:text-slate-400'>
                                    {m.workshop}
                                </td>

                                <td className='px-6 py-4 text-slate-600 dark:text-slate-400'>
                                    {m.uploaded_by?.name}
                                </td>

                                <td className='px-6 py-4 text-right'>
                                    <a
                                        href={m.file_url}
                                        target='_blank'
                                        rel='noreferrer'
                                        className='inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 transition-colors'
                                    >
                                        <ExternalLink className='h-4 w-4' />
                                        Open
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {materials.length === 0 && (
                    <div className='px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400'>
                        No materials available.
                    </div>
                )}
            </div>
        </div>
    );
}