import {useState} from 'react';
import {useAuth} from '../../context/AuthContext';
import {useNavigate, Link} from 'react-router-dom';
import {LogIn} from 'lucide-react';

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
        <div className='w-full'>
            <div className='rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
                <div className='flex items-start justify-between gap-4'>
                    <div>
                        <h1 className='text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100'>
                            Welcome back
                        </h1>
                        <p className='mt-1 text-sm text-slate-600 dark:text-slate-400'>
                            Sign in to continue to WorkshopHub
                        </p>
                    </div>

                    <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800'>
                        <LogIn className='h-5 w-5 text-slate-700 dark:text-slate-200' />
                    </div>
                </div>

                <form onSubmit={submit} className='mt-6 space-y-5'>
                    <div>
                        <label className='block text-sm font-medium text-slate-700 dark:text-slate-200'>
                            Email Address
                        </label>
                        <input
                            type='email'
                            placeholder="Enter your email"
                            className='mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-teal-400/25 dark:focus:border-teal-400'
                            value={form.email}
                            onChange={e => setForm({...form, email: e.target.value})}
                            required
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-slate-700 dark:text-slate-200'>
                            Password
                        </label>
                        <input
                            type='password'
                            placeholder="Enter your password"
                            className='mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-teal-400/25 dark:focus:border-teal-400'
                            value={form.password}
                            onChange={e => setForm({...form, password: e.target.value})}
                            required
                        />
                    </div>

                    <button
                        type='submit'
                        className='inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 transition-colors'
                        disabled={loading}
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                <div className='mt-6 text-center'>
                    <p className='text-sm text-slate-600 dark:text-slate-400'>
                        Don&apos;t have an account?{' '}
                        <Link to='/signup' className='font-medium text-teal-700 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 transition-colors'>
                            Sign up here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}