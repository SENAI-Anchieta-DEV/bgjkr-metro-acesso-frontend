import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';

export const ProtectedRoute = ({ role, children }) => {
  const { signed, loading, user } = useAuth();

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

  // Se uma role específica é exigida, verifica se o usuário a tem
  if (role && user?.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  // Se há children (usado como wrapper de rota), renderiza eles
  if (children) {
    return children;
  }

  // Caso contrário, renderiza o Outlet (rota aninhada)
  return <Outlet />;
};