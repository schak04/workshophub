import {useEffect, useState} from 'react';
import api from '../api/axios';
import {useAuth} from '../context/AuthContext';
import {Award, Download, Plus} from 'lucide-react';

export default function Certificates() {
    const {user} = useAuth();

    const [certificates, setCertificates] = useState([]);
    const [workshops, setWorkshops] = useState([]);
    const [users, setUsers] = useState([]);

    const [workshop, setWorkshop] = useState('');
    const [userId, setUserId] = useState('');
    const [certificateUrl, setCertificateUrl] = useState('');

    useEffect(() => {
        api.get('/certificates')
            .then(res => setCertificates(res.data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (user?.role !== 'admin') return;
        api.get('/workshops').then(res => setWorkshops(res.data));
        api.get('/users').then(res => setUsers(res.data));
    }, [user]);

    const issueCertificate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/certificates', {
                workshop,
                userId,
                certificate_url: certificateUrl
            });

            const res = await api.get('/certificates');
            setCertificates(res.data);

            setWorkshop('');
            setUserId('');
            setCertificateUrl('');
        } catch (err) {
            console.error(err);
            alert("Error issuing certificate");
        }
    };

    const downloadCertificate = (id) => {
        window.open(
            `http://localhost:8000/api/certificates/download/${id}`,
            '_blank'
        );
    };

    return (
        <div className='space-y-8'>
            <div>
                <h1 className='text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100'>
                    Certificates
                </h1>
                <p className='mt-1 text-sm text-slate-600 dark:text-slate-400'>
                    Issue and manage workshop certificates.
                </p>
            </div>

            {user?.role === 'admin' && (
                <div className='max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
                    <div className='flex items-center gap-2 mb-6'>
                        <Plus className='h-5 w-5 text-slate-500 dark:text-slate-400' />
                        <h2 className='text-sm font-semibold text-slate-900 dark:text-slate-100'>
                            Issue Certificate
                        </h2>
                    </div>

                    <form onSubmit={issueCertificate} className='grid gap-5 sm:grid-cols-2'>
                        <div>
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
                                User
                            </label>
                            <select
                                className='mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500'
                                value={userId}
                                onChange={e => setUserId(e.target.value)}
                                required
                            >
                                <option value=''>Select User</option>
                                {users.map(u => (
                                    <option key={u._id} value={u._id}>
                                        {u.name} ({u.email})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className='sm:col-span-2'>
                            <label className='block text-sm font-medium text-slate-700 dark:text-slate-200'>
                                Certificate URL
                            </label>
                            <input
                                type='text'
                                value={certificateUrl}
                                onChange={e => setCertificateUrl(e.target.value)}
                                className='mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500'
                                required
                            />
                        </div>

                        <div className='sm:col-span-2'>
                            <button
                                type='submit'
                                className='inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 transition-colors'
                            >
                                <Award className='h-4 w-4' />
                                Issue Certificate
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className='overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900'>
                <table className='min-w-full text-sm'>
                    <thead className='bg-slate-50 dark:bg-slate-950'>
                        <tr className='text-left text-slate-600 dark:text-slate-300'>
                            <th className='px-6 py-4 font-medium'>Workshop</th>
                            <th className='px-6 py-4 font-medium'>User</th>
                            <th className='px-6 py-4 font-medium'>Issued</th>
                            <th className='px-6 py-4 font-medium text-right'>Action</th>
                        </tr>
                    </thead>

                    <tbody className='divide-y divide-slate-200 dark:divide-slate-800'>
                        {certificates.map(cert => (
                            <tr
                                key={cert._id}
                                className='hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors'
                            >
                                <td className='px-6 py-4 font-medium text-slate-900 dark:text-slate-100'>
                                    {cert.workshop?.title || '-'}
                                </td>
                                <td className='px-6 py-4 text-slate-600 dark:text-slate-400'>
                                    {cert.user?.name || '-'}
                                </td>
                                <td className='px-6 py-4 text-slate-600 dark:text-slate-400'>
                                    {cert.issued_date
                                        ? new Date(cert.issued_date).toLocaleDateString()
                                        : '-'}
                                </td>
                                <td className='px-6 py-4 text-right'>
                                    <button
                                        onClick={() => downloadCertificate(cert._id)}
                                        className='inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 transition-colors'
                                    >
                                        <Download className='h-4 w-4' />
                                        Download
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {certificates.length === 0 && (
                    <div className='px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400'>
                        No certificates issued yet.
                    </div>
                )}
            </div>
        </div>
    );
}