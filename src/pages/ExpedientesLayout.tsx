import React from 'react';
import { Outlet } from 'react-router-dom';

// Este componente simplemente renderiza las rutas anidadas
const ExpedientesLayout: React.FC = () => {
  return <Outlet />;
};

export default ExpedientesLayout; 