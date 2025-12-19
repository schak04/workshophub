import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Navbar from './components/Navbar';

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

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />

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
            </BrowserRouter>
        </AuthProvider>
    );
}