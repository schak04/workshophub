import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
        <div className='p-6'>
            <div className='flex justify-between items-center mb-6'>
                <h1 className='text-2xl font-semibold'>Workshops</h1>

                {user?.role === 'admin' && (
                    <Link
                        to='/workshops/create'
                        className='btn-secondary px-4 py-2 rounded'
                    >
                        Create Workshop
                    </Link>
                )}
            </div>

            <div className='grid gap-4'>
                {workshops.map(ws => (
                    <Link
                        key={ws._id}
                        to={`/workshops/${ws._id}`}
                        className='border p-4 rounded hover:bg-green-700 group'
                    >
                        <h2 className='text-lg font-medium'>{ws.title}</h2>
                        <p className='text-sm text-gray-500 group-hover:text-black'>{ws.venue}</p>
                        <p className='text-sm'>
                            Instructor: {ws.instructor?.name || 'N/A'}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
