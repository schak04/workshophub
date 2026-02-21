import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';

import Workshops from './pages/Workshops';
import WorkshopDetails from './pages/WorkshopDetails';
import CreateWorkshop from './pages/CreateWorkshop';
import EditWorkshop from './pages/EditWorkshop';

import Registrations from './pages/Registrations';
import Materials from './pages/Materials';
import Attendance from './pages/Attendance';
import Feedback from './pages/Feedback';
import Certificates from './pages/Certificates';

function AppLayout() {
    const { pathname } = useLocation();
    const isAuthPage = pathname === '/login' || pathname === '/signup';

    return (
        <div className='min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100'>
            {!isAuthPage && <Navbar />}

            <main
                className={[
                    'w-full',
                    isAuthPage
                        ? 'min-h-screen flex items-center justify-center px-4'
                        : 'md:pl-64',
                ].join(' ')}
            >
                <div className={isAuthPage ? 'w-full max-w-md' : 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6'}>
                    <Routes>
                        <Route path='/login' element={<Login />} />
                        <Route path='/signup' element={<Register />} />

                        <Route
                            path='/'
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/workshops'
                            element={
                                <ProtectedRoute>
                                    <Workshops />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/workshops/:id'
                            element={
                                <ProtectedRoute>
                                    <WorkshopDetails />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/workshops/create'
                            element={
                                <ProtectedRoute roles={['admin']}>
                                    <CreateWorkshop />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/workshops/edit/:id'
                            element={
                                <ProtectedRoute roles={['admin']}>
                                    <EditWorkshop />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/registrations'
                            element={
                                <ProtectedRoute>
                                    <Registrations />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/materials'
                            element={
                                <ProtectedRoute>
                                    <Materials />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/attendance'
                            element={
                                <ProtectedRoute roles={['admin', 'instructor']}>
                                    <Attendance />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/feedback'
                            element={
                                <ProtectedRoute>
                                    <Feedback />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/certificates'
                            element={
                                <ProtectedRoute>
                                    <Certificates />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </div>

                {!isAuthPage && <Footer />}
            </main>
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppLayout />
            </BrowserRouter>
        </AuthProvider>
    );
}