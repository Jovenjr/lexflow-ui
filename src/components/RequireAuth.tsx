import React from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RequireAuth: React.FC = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Muestra un estado de carga mientras se verifica la autenticación inicial
    return <div>Verificando autenticación...</div>; // O un spinner
  }

  if (!user) {
    // Redirige al usuario a la página de login si no está autenticado.
    // Guarda la ubicación actual para que podamos redirigir de vuelta después del login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si está autenticado, renderiza el contenido de la ruta solicitada.
  return <Outlet />; // Outlet renderiza el componente hijo de la ruta
};

export default RequireAuth; 