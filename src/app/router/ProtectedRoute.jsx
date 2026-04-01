import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // Enquanto o React verifica se tem um token salvo, mostramos um loading
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        <h2>Carregando sistema...</h2>
      </div>
    );
  }

  // Se o cara NÃO estiver logado, chuta ele pro login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se ele tiver o Token, deixa ele acessar a página (Dashboard, Cadastro, etc)
  return <Outlet />;
};