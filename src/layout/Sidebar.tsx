import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const Section: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => {
  const [open, setOpen] = React.useState(true);
  return (
    <div className="text-sm">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full px-4 py-2 text-gray-400 uppercase">
        {title}
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${open ? '' : '-rotate-90'}`} />
      </button>
      {open && <div className="pl-2">{children}</div>}
    </div>
  );
};

const navItem = (to: string, label: string) => (
  <NavLink to={to} className={({isActive}) => `sidebar-item ${isActive ? 'sidebar-item-active' : ''}`}>{label}</NavLink>
);

const Sidebar: React.FC = () => (
  <aside className="w-56 bg-gray-900 text-gray-100 flex-shrink-0 h-full overflow-y-auto">
    <div className="flex items-center gap-2 px-4 py-4">
      <span className="text-xl font-bold">LexFlow</span>
    </div>
    {navItem('/', 'Panel')}
    <Section title="Clientes">
      {navItem('/clientes', 'Listado')}
    </Section>
    <Section title="Expedientes">
      {navItem('/expedientes', 'Todos')}
    </Section>
    <Section title="Agenda">
      {navItem('/agenda', 'Todas las citas')}
      {navItem('/agenda/nueva', 'Nueva cita')}
    </Section>
    <Section title="Facturación">
      {navItem('/facturas', 'Facturas')}
      {navItem('/cotizaciones', 'Cotizaciones')}
    </Section>
    <Section title="Administración">
      {navItem('/usuarios', 'Usuarios')}
    </Section>
    <div className="px-4 py-6">
      <button className="sidebar-item w-full justify-start text-red-500">Cerrar Sesión</button>
    </div>
  </aside>
);

export default Sidebar;
