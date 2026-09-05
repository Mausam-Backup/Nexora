import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ 
  children, 
  redirectTo = '/' 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    // Show loading spinner while checking auth status
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    let activeUser = user;
    if (!activeUser) {
      try {
        const saved = localStorage.getItem('campussync-user');
        if (saved) activeUser = JSON.parse(saved);
      } catch (e) {}
    }
    const role = activeUser?.role;
    const dest = redirectTo !== '/' ? redirectTo : (
      role === 'admin' 
        ? '/admin/overview' 
        : role === 'teacher' 
        ? '/teacher' 
        : role === 'examination_controller' 
        ? '/examination-controller' 
        : '/student/dashboard'
    );
    return <Navigate to={dest} replace />;
  }

  return <>{children}</>;
};