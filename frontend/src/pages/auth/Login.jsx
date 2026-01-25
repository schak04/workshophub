import {useState} from 'react';
import {useAuth} from '../../context/AuthContext';
import {useNavigate, Link} from 'react-router-dom';

export default function Login() {
    const {login} = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({email: '', password: ''});
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(form);
            navigate('/');
        } catch (error) {
            console.error("Login failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-gray-900 flex items-center justify-center p-4'>
            <div className='card max-w-md w-full'>
                <div className='text-center mb-8'>
                    <h1 className='text-3xl font-bold text-gray-100 mb-2'>Welcome</h1>
                    <p className='text-gray-400'>Sign in to your account</p>
                </div>

                <form onSubmit={submit} className='space-y-6'>
                    <div>
                        <label className='block text-sm font-medium text-gray-300 mb-2'>
                            Email Address
                        </label>
                        <input
                            type='email'
                            placeholder="Enter your email"
                            className='input w-full'
                            value={form.email}
                            onChange={e => setForm({...form, email: e.target.value})}
                            required
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-300 mb-2'>
                            Password
                        </label>
                        <input
                            type='password'
                            placeholder="Enter your password"
                            className='input w-full'
                            value={form.password}
                            onChange={e => setForm({...form, password: e.target.value})}
                            required
                        />
                    </div>

                    <button
                        type='submit'
                        className='btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={loading}
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                <div className='mt-6 text-center'>
                    <p className='text-gray-400'>
                        Don't have an account?{' '}
                        <Link to='/signup' className='link font-medium'>
                            Sign up here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}