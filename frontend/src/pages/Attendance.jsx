import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

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
        <div className='p-6'>
            <h1 className='text-2xl font-semibold mb-4'>Manage Attendance</h1>

            <select
                className='input border p-2 mb-6 w-full max-w-md'
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

            {!selectedWorkshop && (
                <p className='text-gray-500'>Please select a workshop.</p>
            )}

            {selectedWorkshop && registrations.length === 0 && (
                <p className='text-gray-500'>No registrations yet.</p>
            )}

            {registrations.length > 0 && (
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registrations.map(reg => {
                            const att = getAttendanceForReg(reg._id);
                            const attended = att?.attended || false;

                            return (
                                <tr key={reg._id}>
                                    <td>{reg.user.name}</td>
                                    <td>{reg.user.email}</td>
                                    <td>
                                        {attended ? "Present" : "Absent"}
                                    </td>
                                    <td>
                                        <div className='flex justify-center'>
                                            <button
                                                className={`px-4 py-1.5 rounded-md font-medium transition-all duration-150 ease-in-out active:scale-[0.98] shadow-sm hover:shadow-md
                                                ${attended ? 'btn-primary' : 'btn-secondary'}`}
                                                onClick={() => toggleAttendance(reg._id, attended)}
                                            >
                                                Mark {attended ? "Absent" : "Present"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}