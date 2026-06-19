import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, XCircle, Clock, CalendarDays } from 'lucide-react';

function AttendancePill({ attended }) {
    if (attended === null || attended === undefined) {
        return (
            <span className='inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'>
                <Clock className='h-3 w-3' />
                Not marked
            </span>
        );
    }
    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${attended
            ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-200'
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
        }`}>
            {attended ? <CheckCircle className='h-3 w-3' /> : <XCircle className='h-3 w-3' />}
            {attended ? 'Present' : 'Absent'}
        </span>
    );
}

function ParticipantAttendance() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/attendance/my')
            .then(res => setData(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className='rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900'>Loading...</div>;
    }

    return (
        <div className='space-y-6'>
            <div>
                <h1 className='text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100'>
                    My Attendance
                </h1>
                <p className='mt-1 text-sm text-slate-600 dark:text-slate-400'>
                    Your attendance record across registered workshops.
                </p>
            </div>

            {data.length === 0 ? (
                <div className='rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'>
                    You are not registered for any workshops yet.
                </div>
            ) : (
                <div className='space-y-4'>
                    {data.map(reg => (
                        <div key={reg.registration} className='overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900'>
                            <div className='bg-slate-50 px-6 py-4 border-b border-slate-200 dark:bg-slate-950 dark:border-slate-800'>
                                <h3 className='font-medium text-slate-900 dark:text-slate-100'>
                                    {reg.workshop?.title || 'Unknown Workshop'}
                                </h3>
                                <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>
                                    {reg.workshop?.startDate && reg.workshop?.endDate ? (
                                        new Date(reg.workshop.startDate).toDateString() === new Date(reg.workshop.endDate).toDateString()
                                            ? new Date(reg.workshop.startDate).toDateString()
                                            : `${new Date(reg.workshop.startDate).toDateString()} - ${new Date(reg.workshop.endDate).toDateString()}`
                                    ) : '-'}
                                </p>
                            </div>
                            
                            {reg.records.length === 0 ? (
                                <div className='px-6 py-4 text-sm text-slate-500 dark:text-slate-400'>
                                    No attendance has been recorded for this workshop yet.
                                </div>
                            ) : (
                                <table className='min-w-full text-sm'>
                                    <thead className='bg-white dark:bg-slate-900'>
                                        <tr className='text-left text-xs text-slate-500 uppercase tracking-wider dark:text-slate-400 border-b border-slate-100 dark:border-slate-800'>
                                            <th className='px-6 py-3 font-medium'>Date</th>
                                            <th className='px-6 py-3 font-medium'>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y divide-slate-100 dark:divide-slate-800'>
                                        {reg.records.map((record, i) => (
                                            <tr key={i} className='hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors'>
                                                <td className='px-6 py-3 text-slate-600 dark:text-slate-300'>
                                                    {new Date(record.date).toDateString()}
                                                </td>
                                                <td className='px-6 py-3'>
                                                    <AttendancePill attended={record.attended} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

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
    const {user} = useAuth();

    if (user?.role === 'participant') {
        return <ParticipantAttendance />;
    }

    const [workshops, setWorkshops] = useState([]);
    const [selectedWorkshop, setSelectedWorkshop] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [registrations, setRegistrations] = useState([]);
    const [attendance, setAttendance] = useState([]);

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
        if (!selectedWorkshop) {
            setRegistrations([]);
            setAttendance([]);
            return;
        }

        api.get(`/registrations?workshop=${selectedWorkshop}`)
            .then(res => setRegistrations(res.data));

        if (selectedDate) {
            api.get(`/attendance/workshop/${selectedWorkshop}?date=${selectedDate}`)
                .then(res => setAttendance(res.data))
                .catch(err => {
                    console.error(err);
                    setAttendance([]);
                });
        }
    }, [selectedWorkshop, selectedDate]);

    const activeWs = workshops.find(w => w._id === selectedWorkshop);
    const minDate = activeWs?.startDate ? activeWs.startDate.split('T')[0] : '';
    const maxDate = activeWs?.endDate ? activeWs.endDate.split('T')[0] : '';

    const getAttendanceForReg = (regId) => {
        return attendance.find(a => a.registration?._id === regId || a.registration === regId);
    };

    const toggleAttendance = async (regId, current) => {
        if (!selectedDate) {
            alert('Please select a date first');
            return;
        }

        try {
            const res = await api.post('/attendance/mark', {
                registrationId: regId,
                date: selectedDate,
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
                    Select a workshop and a date to mark participant attendance.
                </p>
            </div>

            <div className='grid gap-6 sm:grid-cols-2 max-w-2xl'>
                <div>
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

                {selectedWorkshop && (
                    <div>
                        <label className='block text-sm font-medium text-slate-700 dark:text-slate-200'>
                            Date
                        </label>
                        <div className='relative mt-2'>
                            <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                                <CalendarDays className='h-4 w-4 text-slate-400' />
                            </div>
                            <input
                                type='date'
                                min={minDate}
                                max={maxDate}
                                value={selectedDate}
                                onChange={e => setSelectedDate(e.target.value)}
                                className='block w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-teal-400 dark:focus:ring-teal-400/25'
                            />
                        </div>
                    </div>
                )}
            </div>

            {!selectedWorkshop && (
                <div className='rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'>
                    Please select a workshop to view the attendance roster.
                </div>
            )}

            {selectedWorkshop && registrations.length === 0 && (
                <div className='rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'>
                    No participants have registered for this workshop yet.
                </div>
            )}

            {selectedWorkshop && registrations.length > 0 && selectedDate && (
                <div className='overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900'>
                    <div className='bg-slate-50 px-6 py-4 border-b border-slate-200 dark:bg-slate-950 dark:border-slate-800 flex justify-between items-center'>
                        <h3 className='font-medium text-slate-900 dark:text-slate-100'>
                            Attendance Roster
                        </h3>
                        <span className='text-xs font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700'>
                            {new Date(selectedDate).toDateString()}
                        </span>
                    </div>
                    <table className='min-w-full text-sm'>
                        <thead className='bg-white dark:bg-slate-900'>
                            <tr className='text-left text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800'>
                                <th className='px-6 py-3 font-medium'>Participant Name</th>
                                <th className='px-6 py-3 font-medium'>Email</th>
                                <th className='px-6 py-3 font-medium'>Status</th>
                                <th className='px-6 py-3 font-medium text-right'>Action</th>
                            </tr>
                        </thead>

                        <tbody className='divide-y divide-slate-100 dark:divide-slate-800'>
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
                                                onClick={() => toggleAttendance(reg._id, attended)}
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