import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from './AuthProvider';

export default function ProtectedRoutes() {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Outlet /> : <Navigate to='/login' />;
}