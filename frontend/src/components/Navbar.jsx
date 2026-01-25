import {Link} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';

export default function Navbar() {
    const {user, logout} = useAuth();

    return (
        <nav className='flex justify-between items-center px-6 py-4 bg-gray-800 border-b border-gray-700 shadow-lg'>
            <Link to='/' className='font-bold text-2xl text-yellow-500 hover:text-blue-400 transition-colors duration-200'>
                WorkshopHub
            </Link>

            <div className='flex gap-6 items-center'>
                {user ? (
                    <>
                        <Link to='/workshops' className='link font-medium'>Workshops</Link>
                        <Link to='/registrations' className='link font-medium'>Registrations</Link>
                        <Link to='/attendance' className='link font-medium'>Attendance</Link>
                        <Link to='/materials' className='link font-medium'>Materials</Link>
                        <Link to='/feedback' className='link font-medium'>Feedback</Link>
                        <Link to='/certificates' className='link font-medium'>Certificates</Link>

                        <button
                            onClick={logout}
                            className='btn-danger'
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to='/login' className='link font-medium'>Login</Link>
                        <Link to='/signup' className='link font-medium'>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}