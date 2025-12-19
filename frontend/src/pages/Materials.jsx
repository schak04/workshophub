import {useEffect, useState} from 'react';
import api from '../api/axios';
import {useAuth} from '../context/AuthContext';

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

            alert("Material added successfully");

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
        <div className='p-6'>
            <h1 className='text-2xl font-semibold mb-6'>Workshop Materials</h1>

            {(user?.role === 'admin' || user?.role === 'instructor') && (
                <form
                    onSubmit={addMaterial}
                    className='border p-4 rounded mb-8 max-w-md'
                >
                    <h2 className='font-semibold mb-4'>Add Material</h2>

                    <select
                        className='border p-2 mb-3 w-full'
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

                    <input
                        type='text'
                        placeholder="Material Title"
                        className='border p-2 mb-3 w-full'
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />

                    <input
                        type='text'
                        placeholder="File URL"
                        className='border p-2 mb-3 w-full'
                        value={fileUrl}
                        onChange={e => setFileUrl(e.target.value)}
                        required
                    />

                    <button className='border px-4 py-2 rounded'>
                        Add Material
                    </button>
                </form>
            )}

            <div className='mb-4 max-w-md'>
                <select
                    className='border p-2 w-full'
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

            <table className='w-full border'>
                <thead>
                    <tr className='bg-gray-200'>
                        <th className='border p-2'>Title</th>
                        <th className='border p-2'>Workshop</th>
                        <th className='border p-2'>Uploaded By</th>
                        <th className='border p-2'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {materials.map(m => (
                        <tr key={m._id}>
                            <td className='border p-2'>
                                {m.title || "Material"}
                            </td>
                            <td className='border p-2'>
                                {m.workshop}
                            </td>
                            <td className='border p-2'>
                                {m.uploaded_by?.name}
                            </td>
                            <td className='border p-2'>
                                <a
                                    href={m.file_url}
                                    target='_blank'
                                    rel='noreferrer'
                                    className='border px-3 py-1 rounded inline-block'
                                >
                                    Open
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}