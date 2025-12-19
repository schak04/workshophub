import {Link} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';

export default function Navbar() {
    const {user, logout} = useAuth();

    return (
        <nav className='flex justify-between items-center px-6 py-3 border-b bg-yellow-400'>
            <Link to='/' className='font-semibold text-lg'>
                Workshop Management System
            </Link>

            <div className='flex gap-4 items-center'>
                {user ? (
                    <>
                        <Link to='/workshops'>Workshops</Link>
                        <Link to='/materials'>Materials</Link>
                        <Link to='/certificates'>Certificates</Link>

                        <button
                            onClick={logout}
                            className='border px-3 py-1 rounded bg-sky-400'
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to='/login'>Login</Link>
                        <Link to='/signup'>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}