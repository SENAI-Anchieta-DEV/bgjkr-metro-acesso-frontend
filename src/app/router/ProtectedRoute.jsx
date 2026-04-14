import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';

export const ProtectedRoute = () => {
  const { signed, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        <h2>Carregando sistema...</h2>
      </div>
    );
  }

  if (!signed) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};