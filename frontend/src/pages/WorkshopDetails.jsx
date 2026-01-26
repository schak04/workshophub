import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function WorkshopDetails() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [registering, setRegistering] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        api.get(`/workshops/${id}`)
            .then(res => setData(res.data))
            .catch(err => console.error(err));
    }, [id]);

    if (!data) return null;

    const { workshop, registrations } = data;

    const deleteWorkshop = async () => {
        if (!window.confirm("Delete this workshop?")) return;
        await api.delete(`/workshops/${id}`);
        navigate('/workshops');
    };

    const handleRegister = async () => {
        try {
            setRegistering(true);
            setMessage('');

            await api.post('/registrations', {
                workshopId: id,
            });

            setMessage("Successfully registered for this workshop!");
        } catch (err) {
            console.error(err);
            setMessage(
                err.response?.data?.message || "Registration failed"
            );
        } finally {
            setRegistering(false);
        }
    };

    return (
        <div className='p-6 max-w-xl'>
            <h1 className='text-2xl font-semibold mb-2'>{workshop.title}</h1>

            <p className='mb-2'>{workshop.description}</p>
            <p><strong>Date:</strong> {new Date(workshop.date).toDateString()}</p>
            <p><strong>Time:</strong> {workshop.time}</p>
            <p><strong>Venue:</strong> {workshop.venue}</p>
            <p><strong>Seats:</strong> {workshop.seats}</p>
            <p><strong>Registrations:</strong> {registrations}</p>

            {(user?.role === 'admin') && (
                <div className='flex gap-3 mt-6'>
                    <Link
                        to={`/workshops/edit/${id}`}
                        className='btn-secondary'
                    >
                        Edit
                    </Link>

                    <button
                        onClick={deleteWorkshop}
                        className='btn-danger'
                    >
                        Delete
                    </button>
                </div>
            )}

            {user?.role === 'participant' && (
                <div className='mt-4'>
                    <button
                        onClick={handleRegister}
                        disabled={registering}
                        className='border px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50'
                    >
                        {registering ? "Registering..." : "Register for Workshop"}
                    </button>

                    {message && (
                        <p className='mt-2 text-sm text-teal-600'>{message}</p>
                    )}
                </div>
            )}
        </div>
    );
}