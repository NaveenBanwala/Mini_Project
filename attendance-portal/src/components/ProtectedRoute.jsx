import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const ProtectedRoute = ({ allowedRoles }) => {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" replace />;

    // The ?. prevents "property undefined" crashes
    const userRole = user?.role?.toLowerCase();

    if (!userRole) {
        console.error("User object exists but role is missing!", user);
        return <Navigate to="/login" replace />;
    }

    const isAuthorized = allowedRoles.some(role => role.toLowerCase() === userRole);

    if (!isAuthorized) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;