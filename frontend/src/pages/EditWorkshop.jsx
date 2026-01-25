import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function EditWorkshop() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);

    if (user?.role !== 'admin') return <p>Access denied</p>;

    useEffect(() => {
        api.get(`/workshops/${id}`)
            .then(res => setForm(res.data.workshop));
    }, [id]);

    if (!form) return null;

    const handleChange = e =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const submit = async e => {
        e.preventDefault();
        await api.put(`/workshops/${id}`, form);
        navigate(`/workshops/${id}`);
    };

    return (
        <div className='p-6 max-w-md'>
            <h1 className='text-xl font-semibold mb-4'>Edit Workshop</h1>

            <form onSubmit={submit} className='grid gap-3'>
                {['title', 'description', 'date', 'time', 'venue', 'seats'].map(key => (
                    <input
                        key={key}
                        name={key}
                        value={form[key] || ''}
                        onChange={handleChange}
                        className='input border p-2 rounded'
                    />
                ))}

                <button className='bg-black text-white py-2 rounded'>
                    Update
                </button>
            </form>
        </div>
    );
}