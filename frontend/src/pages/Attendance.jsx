import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, XCircle } from 'lucide-react';

function StatusPill({ attended }) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${attended
                    ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                }`}
        >
            {attended ? "Present" : "Absent"}
        </span>
    );
}

export default function Attendance() {
    const [workshops, setWorkshops] = useState([]);
    const [selectedWorkshop, setSelectedWorkshop] = useState('');
    const [registrations, setRegistrations] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const {user} = useAuth();

    useEffect(() => {
        if (!user) return;
        const fetchWorkshops = async () => {
            try {
                let res;
                if (user.role === 'instructor') {
                    res = await api.get('/workshops/my');
                } else {
                    res = await api.get('/workshops');
                }
                setWorkshops(res.data);
            }
            catch (err) {
                console.error(err);
            }
        };
        fetchWorkshops();
    }, [user]);

    useEffect(() => {
        if (!selectedWorkshop) return;

        api.get(`/registrations?workshop=${selectedWorkshop}`)
            .then(res => setRegistrations(res.data));

        api.get(`/attendance/workshop/${selectedWorkshop}`)
            .then(res => setAttendance(res.data));
    }, [selectedWorkshop]);

    const getAttendanceForReg = (regId) => {
        return attendance.find(a => a.registration?._id === regId || a.registration === regId);
    };

    const toggleAttendance = async (regId, current) => {
        try {
            const res = await api.post('/attendance/mark', {
                registrationId: regId,
                attended: !current
            });

            setAttendance(prev => {
                const exists = prev.find(a => a._id === res.data._id);
                if (exists) {
                    return prev.map(a => a._id === res.data._id ? res.data : a);
                }
                return [...prev, res.data];
            });
        }
        catch (err) {
            console.error(err);
            const message = err.response?.data?.message || "Error marking attendance";
            alert(message);
        }
    };

    return (
        <div className='space-y-6'>
            <div>
                <h1 className='text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100'>
                    Manage Attendance
                </h1>
                <p className='mt-1 text-sm text-slate-600 dark:text-slate-400'>
                    Select a workshop and mark participant attendance.
                </p>
            </div>

            <div className='max-w-md'>
                <label className='block text-sm font-medium text-slate-700 dark:text-slate-200'>
                    Workshop
                </label>
                <select
                    className='mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-teal-400/25 dark:focus:border-teal-400'
                    value={selectedWorkshop}
                    onChange={e => setSelectedWorkshop(e.target.value)}
                >
                    <option value=''>Select Workshop</option>
                    {workshops.map(w => (
                        <option key={w._id} value={w._id}>
                            {w.title}
                        </option>
                    ))}
                </select>
            </div>

            {!selectedWorkshop && (
                <div className='rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'>
                    Please select a workshop.
                </div>
            )}

            {selectedWorkshop && registrations.length === 0 && (
                <div className='rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'>
                    No registrations yet.
                </div>
            )}

            {registrations.length > 0 && (
                <div className='overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900'>
                    <table className='min-w-full text-sm'>
                        <thead className='bg-slate-50 dark:bg-slate-950'>
                            <tr className='text-left text-slate-600 dark:text-slate-300'>
                                <th className='px-6 py-4 font-medium'>Name</th>
                                <th className='px-6 py-4 font-medium'>Email</th>
                                <th className='px-6 py-4 font-medium'>Status</th>
                                <th className='px-6 py-4 font-medium text-right'>
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className='divide-y divide-slate-200 dark:divide-slate-800'>
                            {registrations.map(reg => {
                                const att = getAttendanceForReg(reg._id);
                                const attended = att?.attended || false;

                                return (
                                    <tr
                                        key={reg._id}
                                        className='hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors'
                                    >
                                        <td className='px-6 py-4 font-medium text-slate-900 dark:text-slate-100'>
                                            {reg.user.name}
                                        </td>
                                        <td className='px-6 py-4 text-slate-600 dark:text-slate-400'>
                                            {reg.user.email}
                                        </td>
                                        <td className='px-6 py-4'>
                                            <StatusPill attended={attended} />
                                        </td>
                                        <td className='px-6 py-4 text-right'>
                                            <button
                                                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${attended
                                                        ? 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600'
                                                        : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200'
                                                    }`}
                                                onClick={() =>
                                                    toggleAttendance(
                                                        reg._id,
                                                        attended
                                                    )
                                                }
                                            >
                                                {attended ? (
                                                    <>
                                                        <XCircle className='h-4 w-4' />
                                                        Mark Absent
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle className='h-4 w-4' />
                                                        Mark Present
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}