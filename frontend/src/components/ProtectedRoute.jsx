import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Если указаны разрешённые роли и роль пользователя не в списке — редирект
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Редирект на главную соответствующей роли
    if (user.role === 'teacher') return <Navigate to="/teacher" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}
