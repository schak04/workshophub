import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CalendarDays, Clock, MapPin, Users } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function WorkshopDetails() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [registering, setRegistering] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        api.get(`/workshops/${id}`)
            .then(res => setData(res.data))
            .catch(err => toast.error("Failed to load workshop details"));
    }, [id]);

    if (!data) return null;

    const { workshop, registrations } = data;

    const deleteWorkshop = async () => {
        if (!window.confirm('Delete this workshop?')) return;
        setDeleting(true);
        try {
            await api.delete(`/workshops/${id}`);
            toast.success("Workshop deleted successfully");
            navigate('/workshops');
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete workshop");
        } finally {
            setDeleting(false);
        }
    };

    const handleRegister = async () => {
        try {
            setRegistering(true);
            await api.post('/registrations', {
                workshopId: id,
            });
            toast.success("Successfully registered for this workshop!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed");
        } finally {
            setRegistering(false);
        }
    };

    return (
        <div className='space-y-6 max-w-4xl'>
            <div>
                <h1 className='text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100'>
                    {workshop.title}
                </h1>
                <p className='mt-2 text-sm text-slate-600 dark:text-slate-400'>
                    {workshop.description}
                </p>
            </div>

            <div className='rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
                <div className='grid gap-6 sm:grid-cols-2'>

                    <div className='flex items-start gap-3'>
                        <CalendarDays className='h-5 w-5 mt-0.5 text-slate-500 dark:text-slate-400' />
                        <div>
                            <p className='text-xs font-medium text-slate-500 dark:text-slate-400'>Date</p>
                            <p className='text-sm font-medium text-slate-900 dark:text-slate-100'>
                                {workshop.startDate && workshop.endDate ? (
                                    new Date(workshop.startDate).toDateString() === new Date(workshop.endDate).toDateString()
                                        ? new Date(workshop.startDate).toDateString()
                                        : `${new Date(workshop.startDate).toDateString()} - ${new Date(workshop.endDate).toDateString()}`
                                ) : '-'}
                            </p>
                        </div>
                    </div>

                    <div className='flex items-start gap-3'>
                        <Clock className='h-5 w-5 mt-0.5 text-slate-500 dark:text-slate-400' />
                        <div>
                            <p className='text-xs font-medium text-slate-500 dark:text-slate-400'>Time</p>
                            <p className='text-sm font-medium text-slate-900 dark:text-slate-100'>
                                {workshop.time}
                            </p>
                        </div>
                    </div>

                    <div className='flex items-start gap-3'>
                        <MapPin className='h-5 w-5 mt-0.5 text-slate-500 dark:text-slate-400' />
                        <div>
                            <p className='text-xs font-medium text-slate-500 dark:text-slate-400'>Venue</p>
                            <p className='text-sm font-medium text-slate-900 dark:text-slate-100'>
                                {workshop.venue}
                            </p>
                        </div>
                    </div>

                    <div className='flex items-start gap-3'>
                        <Users className='h-5 w-5 mt-0.5 text-slate-500 dark:text-slate-400' />
                        <div>
                            <p className='text-xs font-medium text-slate-500 dark:text-slate-400'>Seats</p>
                            <p className='text-sm font-medium text-slate-900 dark:text-slate-100'>
                                {registrations}/{workshop.seats}
                            </p>
                        </div>
                    </div>
                </div>

                {user?.role === 'admin' && (
                    <div className='flex gap-3 mt-8 justify-end'>
                        <Link
                            to={`/workshops/edit/${id}`}
                            className='rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors'
                        >
                            Edit
                        </Link>

                        <button
                            onClick={deleteWorkshop}
                            disabled={deleting}
                            className='rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 dark:bg-red-800 dark:hover:bg-red-900 transition-colors'
                        >
                            {deleting ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                )}

                {user?.role === 'participant' && (
                    <div className='mt-8 border-t border-slate-200 pt-6 dark:border-slate-800'>
                        <button
                            onClick={handleRegister}
                            disabled={registering}
                            className='rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 transition-colors'
                        >
                            {registering ? "Registering..." : "Register for Workshop"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}