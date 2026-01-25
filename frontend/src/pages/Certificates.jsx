import {useEffect, useState} from 'react';
import api from '../api/axios';
import {useAuth} from '../context/AuthContext';

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
            alert("Certificate issued");

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
        <div className='p-6'>
            <h1 className='text-2xl font-semibold mb-6'>Certificates</h1>

            {user?.role === 'admin' && (
                <form
                    onSubmit={issueCertificate}
                    className='border p-4 rounded mb-8 max-w-md'
                >
                    <h2 className='font-semibold mb-4'>Issue Certificate</h2>

                    <select
                        className='border p-2 mb-3 w-full bg-gray-900'
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

                    <select
                        className='border p-2 mb-3 w-full bg-gray-900'
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

                    <input
                        type='text'
                        placeholder="Certificate URL"
                        className='input border p-2 mb-3 w-full'
                        value={certificateUrl}
                        onChange={e => setCertificateUrl(e.target.value)}
                        required
                    />

                    <button className='border px-4 py-2 rounded'>
                        Issue Certificate
                    </button>
                </form>
            )}

            <table className='w-full border'>
                <thead>
                    <tr className='bg-amber-800'>
                        <th className='border p-2'>Workshop</th>
                        <th className='border p-2'>User</th>
                        <th className='border p-2'>Issued</th>
                        <th className='border p-2'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {certificates.map(cert => (
                        <tr key={cert._id}>
                            <td className='border p-2'>
                                {cert.workshop?.title}
                            </td>
                            <td className='border p-2'>
                                {cert.user?.name}
                            </td>
                            <td className='border p-2'>
                                {new Date(cert.issued_date).toLocaleDateString()}
                            </td>
                            <td className='border p-2'>
                                <button
                                    className='border px-3 py-1 rounded'
                                    onClick={() => downloadCertificate(cert._id)}
                                >
                                    Download
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}