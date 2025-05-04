import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import clsx from 'clsx'
import { FiUsers, FiFileText, FiCalendar, FiDollarSign, FiList, FiSettings, FiHome } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import LogoutIcon from '@mui/icons-material/Logout'

const sections = [
  { label: 'Panel', icon: FiHome, path: '/' },
  {
    label: 'Clientes',
    icon: FiUsers,
    children: [
      { label: 'Lista', path: '/clientes' },
      { label: 'Nuevo', path: '/clientes/nuevo' },
    ],
  },
  {
    label: 'Expedientes',
    icon: FiFileText,
    children: [
      { label: 'Lista', path: '/expedientes' },
      { label: 'Nuevo', path: '/expedientes/nuevo' },
    ],
  },
  {
    label: 'Agenda',
    icon: FiCalendar,
    children: [
      { label: 'Calendario', path: '/agenda' },
      { label: 'Todas las citas', path: '/agenda/citas' },
      { label: 'Nueva cita', path: '/agenda/nueva' },
    ],
  },
  {
    label: 'Facturación',
    icon: FiDollarSign,
    children: [
      { label: 'Facturas', path: '/facturas' },
      { label: 'Nueva factura', path: '/facturas/nueva' },
    ],
  },
  {
    label: 'Cotizaciones',
    icon: FiList,
    children: [
      { label: 'Cotizaciones', path: '/cotizaciones' },
      { label: 'Nueva', path: '/cotizaciones/nueva' },
    ],
  },
  {
    label: 'Administración',
    icon: FiSettings,
    children: [
      { label: 'Usuarios', path: '/admin/usuarios' },
      { label: 'Equipos', path: '/admin/equipos' },
      { label: 'Perfil', path: '/perfil' },
    ],
  },
]

function Sidebar() {
  const [openSections, setOpenSections] = useState<string[]>([])
  const { logout } = useAuth()

  const toggleSection = (label: string) => {
    setOpenSections((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    )
  }

  return (
    <aside className="w-64 bg-brand-primary text-gray-200 flex flex-col">
      <div className="p-4 text-xl font-bold">LexFlow</div>
      <nav className="flex-1 mt-8 px-4 space-y-2 overflow-y-auto">
        {sections.map((sec) => (
          <li key={sec.label}>
            {sec.children ? (
              <>
                <button
                  onClick={() => toggleSection(sec.label)}
                  className="flex items-center w-full px-3 py-2 rounded hover:bg-brand-light"
                >
                  <sec.icon className="mr-3" />
                  {sec.label}
                  <span className="ml-auto">{openSections.includes(sec.label) ? '▾' : '▸'}</span>
                </button>
                {openSections.includes(sec.label) && (
                  <ul className="ml-8 mt-1 space-y-1">
                    {sec.children.map((child) => (
                      <li key={child.path}>
                        <NavLink
                          to={child.path}
                          className={({ isActive }) =>
                            clsx(
                              'block px-3 py-2 rounded hover:bg-brand-primary',
                              isActive && 'bg-brand-primary'
                            )
                          }
                        >
                          {child.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <NavLink
                to={sec.path!}
                className={({ isActive }) =>
                  clsx('flex items-center px-3 py-2 rounded hover:bg-brand-light', {
                    'bg-brand-light': isActive,
                  })
                }
              >
                <sec.icon className="mr-3" />
                {sec.label}
              </NavLink>
            )}
          </li>
        ))}
      </nav>
      <div className="p-4 mt-auto border-t border-gray-700">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-brand-secondary hover:text-white group"
        >
          <LogoutIcon className="mr-3 h-5 w-5" aria-hidden="true" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
