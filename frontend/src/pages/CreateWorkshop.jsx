import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function CreateWorkshop() {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (user?.role !== 'admin') return <p>Access denied</p>;

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

    return (
        <div className='p-6 max-w-md'>
            <h1 className='text-xl font-semibold mb-4'>Create Workshop</h1>

            <form onSubmit={submit} className='grid gap-3'>
                {Object.keys(form).map(key => (
                    <input
                        key={key}
                        name={key}
                        placeholder={key}
                        value={form[key]}
                        onChange={handleChange}
                        className='input border p-2 rounded'
                    />
                ))}

                <button className='bg-black text-white py-2 rounded'>
                    Create
                </button>
            </form>
        </div>
    );
}