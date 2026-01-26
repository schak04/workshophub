import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const { user } = useAuth();
    if (!user) return null;

    return (
        <div className='min-h-screen bg-black p-6'>
            <div className='max-w-4xl mx-auto'>
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold mb-2 text-gray-100'>
                        Welcome, {user.name}!
                    </h1>
                    <p className='text-gray-400 text-lg'>
                        Role: <span className='text-teal-400 font-semibold'>{user.role}</span>
                    </p>
                </div>

                <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                    <Link className='card hover:border-teal-500 transition-all duration-300 group' to='/workshops'>
                        <div className='flex items-center mb-3'>
                            <div className='w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center mr-3 group-hover:bg-teal-500 transition-colors duration-200'>
                                <span className='text-white font-bold'>W</span>
                            </div>
                            <h3 className='text-xl font-semibold text-gray-100'>Workshops</h3>
                        </div>
                        <p className='text-gray-400'>Browse and manage workshop sessions</p>
                    </Link>

                    {user.role === 'admin' && (
                        <Link className='card hover:border-green-500 transition-all duration-300 group' to='/workshops/create'>
                            <div className='flex items-center mb-3'>
                                <div className='w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3 group-hover:bg-green-500 transition-colors duration-200'>
                                    <span className='text-white font-bold'>+</span>
                                </div>
                                <h3 className='text-xl font-semibold text-gray-100'>Create Workshop</h3>
                            </div>
                            <p className='text-gray-400'>Add new workshop sessions</p>
                        </Link>
                    )}

                    {user.role === 'participant' && (
                        <>
                            <Link className='card hover:border-purple-500 transition-all duration-300 group' to='/certificates'>
                                <div className='flex items-center mb-3'>
                                    <div className='w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3 group-hover:bg-purple-500 transition-colors duration-200'>
                                        <span className='text-white font-bold'>C</span>
                                    </div>
                                    <h3 className='text-xl font-semibold text-gray-100'>My Certificates</h3>
                                </div>
                                <p className='text-gray-400'>View your earned certificates</p>
                            </Link>
                            <Link className='card hover:border-indigo-500 transition-all duration-300 group' to='/registrations'>
                                <div className='flex items-center mb-3'>
                                    <div className='w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-3 group-hover:bg-indigo-500 transition-colors duration-200'>
                                        <span className='text-white font-bold'>R</span>
                                    </div>
                                    <h3 className='text-xl font-semibold text-gray-100'>My Registrations</h3>
                                </div>
                                <p className='text-gray-400'>View and manage your workshop registrations</p>
                            </Link>
                            <Link className='card hover:border-yellow-500 transition-all duration-300 group' to='/feedback'>
                                <div className='flex items-center mb-3'>
                                    <div className='w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center mr-3 group-hover:bg-yellow-500 transition-colors duration-200'>
                                        <span className='text-white font-bold'>F</span>
                                    </div>
                                    <h3 className='text-xl font-semibold text-gray-100'>Submit Feedback</h3>
                                </div>
                                <p className='text-gray-400'>Share your workshop experience</p>
                            </Link>
                        </>
                    )}

                    {(user.role === 'instructor' || user.role === 'admin') && (
                        <>
                            <Link className='card hover:border-orange-500 transition-all duration-300 group' to='/attendance'>
                                <div className='flex items-center mb-3'>
                                    <div className='w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center mr-3 group-hover:bg-orange-500 transition-colors duration-200'>
                                        <span className='text-white font-bold'>A</span>
                                    </div>
                                    <h3 className='text-xl font-semibold text-gray-100'>Manage Attendance</h3>
                                </div>
                                <p className='text-gray-400'>Track participant attendance</p>
                            </Link>
                            <Link className='card hover:border-yellow-500 transition-all duration-300 group' to='/feedback'>
                                <div className='flex items-center mb-3'>
                                    <div className='w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center mr-3 group-hover:bg-yellow-500 transition-colors duration-200'>
                                        <span className='text-white font-bold'>F</span>
                                    </div>
                                    <h3 className='text-xl font-semibold text-gray-100'>View Feedback</h3>
                                </div>
                                <p className='text-gray-400'>Review participant feedback</p>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}