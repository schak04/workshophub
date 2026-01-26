import {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {useAuth} from '../../context/AuthContext';

export default function Register() {
    const {signup} = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'participant'
    });
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signup(form);
            navigate('/login');
        } catch (error) {
            console.error('Registration failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-black flex items-center justify-center p-4'>
            <div className='card max-w-md w-full'>
                <div className='text-center mb-8'>
                    <h1 className='text-3xl font-bold text-gray-100 mb-2'>Create Account</h1>
                    <p className='text-gray-400'>Join the WMS</p>
                </div>

                <form onSubmit={submit} className='space-y-6'>
                    <div>
                        <label className='block text-sm font-medium text-gray-300 mb-2'>
                            Full Name
                        </label>
                        <input
                            type='text'
                            placeholder="Enter your full name"
                            className='input'
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-300 mb-2'>
                            Email Address
                        </label>
                        <input
                            type='email'
                            placeholder="Enter your email"
                            className='input'
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-300 mb-2'>
                            Password
                        </label>
                        <input
                            type='password'
                            placeholder="Create a password"
                            className='input'
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-300 mb-2'>
                            Account Type
                        </label>
                        <select
                            value={form.role}
                            onChange={(e) => setForm({ ...form, role: e.target.value })}
                            className='input'
                        >
                            <option value='participant'>Participant</option>
                            <option value='instructor'>Instructor</option>
                        </select>
                    </div>

                    <button
                        type='submit'
                        className='btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <div className='mt-6 text-center'>
                    <p className='text-gray-400'>
                        Already have an account?{' '}
                        <Link to='/login' className='link font-medium'>
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}